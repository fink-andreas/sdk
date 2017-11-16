/*---------------------------------------------------------------------------*/
/* innovaphone.ui.VisibilityObserver.js                                      */
/* A client for connecting to the innovaphone PBX                            */
/*---------------------------------------------------------------------------*/

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.VisibilityObserver = innovaphone.ui.VisibilityObserver || (function (global) {

    function VisibilityObserver() {
        var instance = this,
            elementSubscriptions = [],
            pageSubscriptions = [],
            pageVisible = !window.hidden,
            timer = null,
            timeoutValue = 200,
            longTimeoutValue = 5000,
            childNodeObserver = null,
            attributeObserver = null;

        var timeout = function () {
            timer = null;
            updateSubscriptions();
        }

        var startTimer = function () {
            if (timer) window.clearTimeout(timer);
            timer = window.setTimeout(timeout, timeoutValue);
        }

        var startLongTimer = function (mutations) {
            if (!timer) timer = window.setTimeout(timeout, longTimeoutValue);
        }

        var isRemoved = function (element) {
            while (element) {
                if (element === document.body) return false;
                element = element.parentNode;
            }
            return true;
        }

        var updateSubscriptions = function () {
            if (document.hidden) {
                if (pageVisible) {
                    pageVisible = false;
                    childNodeObserver.disconnect();
                    attributeObserver.disconnect();
                    for (var i in pageSubscriptions) {
                        pageSubscriptions[i].onvisibilitychange(false);
                    }
                    for (var i in elementSubscriptions) {
                        var s = elementSubscriptions[i];
                        if (s.visible) {
                            s.visible = false;
                            s.onvisibilitychange(false);
                        }
                    }
                }
            }
            else {
                if (!pageVisible) {
                    pageVisible = true;
                    childNodeObserver.observe(document.body, { childList: true, subtree: true });
                    attributeObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"], subtree: true });
                    for (var i in pageSubscriptions) pageSubscriptions[i].onvisibilitychange(true);
                }
                var removed = [];
                for (var i in elementSubscriptions) {
                    var s = elementSubscriptions[i];
                    var e = s.element;
                    if (isRemoved(e)) {
                        removed.push(s);
                    }
                    else {
                        var rect = e.getBoundingClientRect();
                        var visible = e.offsetParent && rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth;
                        if (visible != s.visible) {
                            s.visible = visible;
                            s.onvisibilitychange(visible);
                        }
                    }
                }
                for (var i in removed) removed[i].onremove();
                removed = null;
            }
        }

        // event handlers
        window.addEventListener("resize", startTimer);
        window.addEventListener("scroll", startTimer);
        window.addEventListener("loaded", startTimer);
        window.addEventListener("DOMContentLoaded", startTimer);
        document.addEventListener("visibilitychange", startTimer);
        childNodeObserver = new MutationObserver(startTimer);
        attributeObserver = new MutationObserver(startLongTimer);
        if (pageVisible) {
            childNodeObserver.observe(document.body, { childList: true, subtree: true });
            attributeObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"], subtree: true });
        }

        // public
        this.observeElement = function (element, onvisibilitychange, onremove) {
            var subscription = { element: element, visible: false, onvisibilitychange: onvisibilitychange, onremove: onremove };
            elementSubscriptions.push(subscription);
            startTimer();
            return subscription;
        }

        this.unobserveElement = function (subscription) {
            for (var i in elementSubscriptions) {
                if (elementSubscriptions[i] === subscription) {
                    elementSubscriptions.splice(i, 1);
                    return;
                }
            }
        }

        this.observePage = function (onvisibilitychange) {
            var subscription = { onvisibilitychange: onvisibilitychange };
            pageSubscriptions.push(subscription);
            onvisibilitychange(pageVisible);
            return subscription;
        }

        this.unobservePage = function (subscription) {
            for (var i in pageSubscriptions) {
                if (pageSubscriptions[i] === subscription) {
                    pageSubscriptions.splice(i, 1);
                    return;
                }
            }
        }

        this.dispose = function () {
            if (timer) window.clearTimeout(timer);
            timer = null;
            window.removeEventListener("resize", startTimer);
            window.removeEventListener("scroll", startTimer);
            window.removeEventListener("loaded", startTimer);
            window.removeEventListener("DOMContentLoaded", startTimer);
            document.removeEventListener("visibilitychange", startTimer);
            childNodeObserver.disconnect();
            attributeObserver.disconnect();
            childNodeObserver = null;
            attributeObserver = null;
            elementSubscriptions = null;
            pageSubscriptions = null;
        }
    }

    VisibilityObserver.singleton;
    VisibilityObserver.getInstance = function () {
        if (!VisibilityObserver.singleton) VisibilityObserver.singleton = new VisibilityObserver();
        return VisibilityObserver.singleton;
    }

    // public
    return VisibilityObserver;
})(window);
