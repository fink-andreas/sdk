
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
};

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.replaceAll = function (search, replace) {
    var replacer = new RegExp(search, "g");
    return this.replace(replacer, replace);
}

Node.prototype.isChildOf = function (node) {
    var parentNode = this;
    while ((parentNode = parentNode.parentNode) != undefined) {
        if (parentNode == node) {
            return true;
        }
    }
    return false;
}

// static innovaphone.lib functions

var innovaphone = innovaphone || {};
innovaphone.lib1 = innovaphone.lib1 || (function () {

    var activeInput = null,
        loadingScripts = [];

    var keyCodes = {
        arrowDown: 40,
        arrowUp: 38,
        escape: 27,
        enter: 13,
        tab: 9
    };

    function isInt(value) {
        return !isNaN(value) && parseInt(value) == value;
    }

    function isFloat(value) {
        return !isNaN(value) && parseFloat(value) == value;
    }

    function isPrimitiveType(value) {
        if (typeof (value) == "string" || typeof (value) == "number" || typeof (value) == "boolean") {
            return true;
        }
        return false;
    }

    function httpGet(url, funcComplete, funcFailed) {
        var xmlReq = new window.XMLHttpRequest();
        if (xmlReq) {
            xmlReq.open("GET", url, funcComplete ? true : false);
            xmlReq.setRequestHeader("Connection", "close");
            xmlReq.send(null);
            if (funcComplete) {
                xmlReq.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            funcComplete(this.responseText);
                        }
                        else {
                            if (funcFailed) funcFailed(this);
                        }
                    }
                }
            }
        }
        return xmlReq;
    }

    function httpPostFile(url, file, funcComplete) {
    }

    function loadObjectScripts(scripts, onload) {
        var loaded = 0;
        var test = "";
        for (var i = 0; i < scripts.length; i++) {
            test += scripts[i];
            loadObjectScript(scripts[i], scriptLoaded);
        }

        function scriptLoaded() {
            if (++loaded == scripts.length) {
                onload();
            }
        }
    }

    function loadObjectScript(type, onload) {
        var parts = type.split("/");
        var path = "";
        for (var i = 0; i < parts.length - 1; i++) {
            path += parts[i] + "/";
        }
        var className = parts[i];
        var classParts = className.split(".");
        var current = window;
        var loaded = true;
        var obj = null;
        for (var i = 0; i <= classParts.length; i++) {
            if (!current) {
                var scriptFile = className + ".js";
                loaded = false;
                if (path) {
                    scriptFile = path + scriptFile;
                }
                if (onload) {
                    // search through script tags, which are currently loading and not yet ready
                    var loadingObj = null;
                    for (var s = 0; s < loadingScripts.length; s++) {
                        if (loadingScripts[s].path == scriptFile) {
                            loadingObj = loadingScripts[s];
                            break;
                        }
                    }
                    var func = function () {
                        scriptLoaded(classParts);
                    };
                    if (!loadingObj) {   // not loading, so create a new script tag
                        var head = document.getElementsByTagName("head")[0];
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.addEventListener("load", func);
                        script.src = scriptFile;
                        head.appendChild(script);
                        obj = { script: script, path: scriptFile };
                        loadingScripts.push(obj);
                    }
                    else {                  // loading, so just add event listener
                        loadingObj.script.addEventListener("load", func);
                    }
                }
                else {
                    alert("no script file should be loaded without callback function (" + scriptFile + ")");
                }
                break;
            }
            if (i == classParts.length) break;
            var old = current;
            current = current[classParts[i]];
            if (!current) {          // classname directly found in object 
                for (var property in old) {     // check if there is a property independent of the casing of the class name or/and file name
                    if (old.hasOwnProperty(property)) {
                        if (property.toLowerCase() == classParts[i].toLowerCase()) {
                            current = old[property];
                            break;
                        }
                    }
                }
            }
        }
        if (loaded && onload) { // javascript file has been already loaded, so directly call onload
            loadResources(classParts);
        }

        function loadResources(classParts) {
            var current = window;
            var i = 0;
            for (i = 0; i < classParts.length - 1; i++) {
                current = current[classParts[i]];
            }
            if (current && current[classParts[i] + "Resources"] && !current[classParts[i] + "ResourcesLoaded"]) {
                current[classParts[i] + "Resources"](onload);
            }
            else {
                onload();
            }
        }

        function scriptLoaded(classParts) {
            if (loadingScripts.indexOf(obj) >= 0) {
                loadingScripts.splice(loadingScripts.indexOf(obj), 1);
            }
            loadResources(classParts);
        }
    }

    function fireEvent(element, eventName, memo) {
        var event;
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);

        event.eventName = eventName;
        event.memo = memo || {};

        element.dispatchEvent(event);
    }

    function addClass(element, className) {
        removeClass(element, className);
        element.className += (element.className ? " " : "") + className;
    }

    function removeClass(element, className) {
        var classes = element.className.split(" ");
        element.className = "";
        for (var i in classes) {
            if (classes[i] && classes[i] != className) {
                element.className += (element.className ? " " : "") + classes[i];
            }
        }
    }

    function start(langFile, langs, onload) {
        var params = location.search.substring(1),
            pairs = params.split("&"),
            numberOfArguments = pairs.length,
            start = {},
            onapirequest = new Event(start),
            onapiresult = new Event(start),
            onapiupdate = new Event(start),
            onchannelconnected = new Event(start),
            onchannelclosed = new Event(start),
            onchannelmessage = new Event(start),
            logins = [],
            currentSrc = 0;

        start.lang = "en";
        start.scheme = "dark";
        start.args = {};
        start.apis = {};
        start.onlangchanged = new Event(start);
        start.onschemechanged = new Event(start);
        start.onargschanged = new Event(start);
        start.postClientMessage = function (obj) {
            window.parent.postMessage(JSON.stringify(obj), "*");
        };
        start.show = function () {
            start.postClientMessage({ mt: "Action", type: "ShowApp" });
        };
        start.close = function () {
            start.postClientMessage({ mt: "Action", type: "CloseApp" });
        };
        start.home = function () {
            start.postClientMessage({ mt: "Action", type: "ShowApp", value: "@home" });
        };
        start.startActivity = function () {
            start.postClientMessage({ mt: "Action", type: "StartActivity" });
        };
        start.finishActivity = function () {
            start.postClientMessage({ mt: "Action", type: "FinishActivity" });
        };
        start.provideApi = function (api) {
            return new (function (api) {
                var that = this;

                this.onmessage = new Event(this);
                this.send = function (msg, consumer, src) { start.postClientMessage({ mt: "ApiResult", api: api, consumer: consumer, src: src, msg: msg }); };
                this.update = function (model) { start.postClientMessage({ mt: "ApiModel", api: api, model: model }); };

                onapirequest.attach(function (src, obj) { if (obj.api == api) that.onmessage.notify({ consumer: obj.consumer, src: obj.src, msg: obj.msg }); });
                start.postClientMessage({ mt: "RegisterApi", api: api });
            })(api);
        };
        start.consumeApi = function (api) {
            return new (function (api) {
                var that = this;

                this.model = {};
                this.providers = [];
                this.onupdate = new Event(this);
                this.onmessage = new Event(this);
                this.send = function (msg, provider, src, title) { start.postClientMessage({ mt: "ApiRequest", api: api, provider: provider, src: src, title: title, msg: msg }); }

                function update() {
                    var newModel = start.apis[api] || {};
                    if (JSON.stringify(newModel) != JSON.stringify(that.model)) {
                        that.model = newModel;
                        that.providers = [];
                        for (var key in newModel) that.providers.push(key);
                        that.onupdate.notify();
                    }
                }

                this.Src = function (onmessage) {
                    return new (function (onmessage, apiConsumer) {
                        var src = "apisrc-" + (++currentSrc);
                        this.close = function () {
                            apiConsumer.onmessage.detach(onapiresult);
                            src = null;
                        };
                        this.send = function (msg, provider, title) {
                            if (src) apiConsumer.send(msg, provider, src, title);
                        };
                        function onapiresult(sender, obj) {
                            if (obj.src == src) onmessage(obj);
                        }
                        apiConsumer.onmessage.attach(onapiresult);
                    })(onmessage, that);
                };

                onapiupdate.attach(function (src, obj) { update() });
                onapiresult.attach(function (src, obj) { if (obj.api == api) that.onmessage.notify({ provider: obj.provider, src: obj.src, msg: obj.msg || {}, errorText: obj.errorText }); });
                update();
                start.postClientMessage({ mt: "ConsumeApi", api: api });
            })(api);
        };
        start.onopenchannel = function (channel, opener, args) { start.postClientMessage({mt: "ChannelClosed", channel: channel }); };
        start.openChannel = function (dst, args) {
            return new (function (dst, args) {
                var that = this,
                    channel = null;
                    src = ++currentSrc;

                this.onconnected = function () { };
                this.onclosed = function () { };
                this.onmessage = function (msg) { };
                this.send = function (msg) {
                    if (channel) start.postClientMessage({ mt: "ChannelMessage", channel: channel, msg: msg });
                };
                this.close = function () {
                    if (channel) start.postClientMessage({ mt: "ChannelClosed", channel: channel });
                    channel = null;
                    src = null;
                    onchannelconnected.detach(connected);
                    onchannelclosed.detach(closed);
                    onchannelmessage.detach(message);
                };
                
                function connected(sender, obj) {
                    if (obj.src == src) {
                        channel = obj.channel;
                        that.onconnected();
                    }
                }
                function closed(sender, obj) {
                    if (obj.src == src || obj.channel == channel) {
                        that.onclosed();
                    }
                }
                function message(sender, obj) {
                    if (obj.channel == channel) {
                        that.onmessage(obj.msg);
                    }
                }

                onchannelconnected.attach(connected);
                onchannelclosed.attach(closed);
                onchannelmessage.attach(message);
                start.postClientMessage({ mt: "OpenChannel", src: src, dst: dst, args: args });
            })(dst, args);
        };
        start.acceptChannel = function (channel) {
            return new (function (channel) {
                var that = this;

                this.onclosed = function () { };
                this.onmessage = function (msg) { };
                this.send = function (msg) {
                    if (channel) start.postClientMessage({ mt: "ChannelMessage", channel: channel, msg: msg });
                };
                this.close = function () {
                    if (channel) start.postClientMessage({ mt: "ChannelClosed", channel: channel });
                    channel = null;
                    onchannelclosed.detach(closed);
                    onchannelmessage.detach(message);
                };

                function closed(sender, obj) {
                    if (obj.channel == channel) {
                        that.onclosed();
                    }
                }
                function message(sender, obj) {
                    if (obj.channel == channel) {
                        that.onmessage(obj.msg);
                    }
                }

                onchannelclosed.attach(closed);
                onchannelmessage.attach(message);
                start.postClientMessage({ mt: "ChannelConnected", channel: channel });
            })(channel);
        };
        start.rejectChannel = function (channel) {
            start.postClientMessage({ mt: "ChannelClosed", channel: channel });
        };

        window.addEventListener("message", function (e) {
            var obj = JSON.parse(e.data || "{}");
            switch (obj.mt) {
                case "SetLang":
                    start.lang = obj.lang;
                    start.onlangchanged.notify();
                    break;
                case "SetScheme":
                    start.scheme = obj.scheme;
                    start.onschemechanged.notify();
                    break;
                case "SetArgs":
                    start.args = obj.args;
                    start.onargschanged.notify();
                    break;
                case "ConsumeApi":
                    if (e.source != opener && e.source != parent) {
                        new (function (iframe, api) {
                            onapiupdate.attach(update);
                            onapiresult.attach(result);
                            function update(src, obj) {
                                check();
                                if (iframe) iframe.postMessage(JSON.stringify(obj), "*");
                            }
                            function result(src, obj) {
                                check();
                                if (iframe && obj.api == api) iframe.postMessage(JSON.stringify(obj), "*");
                            }
                            function check() {
                                if (!iframe || iframe.closed) {
                                    onapiupdate.detach(update);
                                    onapiresult.detach(result);
                                    iframe = null;
                                    api = null;
                                }
                            }
                            iframe.postMessage(JSON.stringify({ mt: "ApiUpdate", apis: start.apis }), "*");
                        })(e.source, obj.api);
                        start.postClientMessage(obj);
                    }
                    break;
                case "ApiRequest":
                    if (e.source == opener || e.source == parent) onapirequest.notify(obj);
                    else start.postClientMessage(obj);
                    break;
                case "ApiResult":
                    if (e.source == opener || e.source == parent) onapiresult.notify(obj);
                    break;
                case "ApiUpdate":
                    if (e.source == opener || e.source == parent) {
                        start.apis = obj.apis;
                        onapiupdate.notify(obj);
                    }
                    break;
                case "OpenChannel":
                    start.onopenchannel(obj.channel, obj.opener, obj.args);
                    break;
                case "ChannelConnected":
                    onchannelconnected.notify(obj);
                    break;
                case "ChannelClosed":
                    onchannelclosed.notify(obj);
                    break;
                case "ChannelMessage":
                    onchannelmessage.notify(obj);
                    break;
                case "getLogin":
                    logins.push(e.source);
                    (parent ? parent : opener).postMessage(e.data, "*");
                    break;
                case "Login":
                    var login = logins.shift();
                    if (login) login.postMessage(e.data, "*");
                    break;
            }
        });

        for (var i = 0; i < numberOfArguments; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var argname = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            if (argname == "lang") {
                start.lang = value;
            }
            else if (argname == "scheme") {
                start.scheme = value;
            }
            else if (argname == "name") {
                start.name = value;
            }
            else {
                start.args[argname] = value;
            }
        }
        start.url = location.href;
        start.url = start.url.slice(0, start.url.search(".htm"));
        start.url = start.url.slice(0, start.url.lastIndexOf("/"));
        start.url = start.url.replace("http", "ws");
        start.postClientMessage({ mt: "Alive" });
        if (langFile) loadObjectScript(langFile + "." + start.lang, function () { onload(start); });
        else onload(start);
    }

    function replace$Args(translatedString) {
        for (var i = 1; i < arguments.length; i++) {
            var replacer = new RegExp("\\$" + i.toString(), "g");
            translatedString = translatedString.replace(replacer, arguments[i]);
        }
        return translatedString;
    }

    function Event(sender) {
        this.sender = sender;
        this.listeners = [];
    }

    Event.prototype = {
        attach: function (listener) {
            this.listeners.push(listener);
        },
        detach: function (listener) {
            var index = this.listeners.indexOf(listener);
            if (index > -1) this.listeners.splice(index, 1);
        },
        notify: function (args) {
            var list = this.listeners.slice();
            for (var i = 0; i < list.length; i++) {
                list[i](this.sender, args);
            }
        }
    };

    function Languages(texts, lang) {
        var that = this;
        this.current = lang;
        if (!texts[this.current]) this.current = "en";
        this.texts = texts[this.current];
        this.onlangchanged = new Event(this);
        this.onnoderemoved = new Event(this);

        this.activate = function (newLang) {
            that.current = texts[newLang] ? newLang : "en";
            that.texts = texts[that.current];
            that.onlangchanged.notify(that.current);
        };

        this.text = function (id, args) {
            var t = texts[that.current][id] || texts["en"][id];
            if (t && args) args.forEach(function (e, i) { t = t.replace(new RegExp("\\$" + i.toString(), "g"), e); });
            return t || "";
        };

        this.create = function (node, property, id, args) {
            return new TranslatedNode(that, node.container || node, property || "innerText", id, args);
        };

        this.clear = function (node) {
            if (node && node.container) node = node.container;
            that.onnoderemoved.notify(node);
        };
    }

    function TranslatedNode(languages, node, property, id, args) {
        var that = this;

        this.remove = function () {
            languages.onlangchanged.detach(that.update);
            languages.onnoderemoved.detach(that.checkRemoved);
        };

        this.update = function () {
            if (that.node) that.node[property] = languages.text(id, args);
        };

        this.setId = function (newId) {
            id = newId;
            that.update();
        };

        this.setArgs = function (newArgs) {
            args = newArgs;
            that.update();
        };

        this.checkRemoved = function (sender, node) {
            if (!node || node == that.node || node.contains && node.contains(that.node)) that.remove();
        };

        this.node = node;
        this.update();
        languages.onlangchanged.attach(that.update);
        languages.onnoderemoved.attach(that.checkRemoved);
    }

    return {
        isInt: isInt,
        isFloat: isFloat,
        isPrimitiveType: isPrimitiveType,
        httpGet: httpGet,
        httpPostFile: httpPostFile,
        loadObjectScript: loadObjectScript,
        loadObjectScripts: loadObjectScripts,
        fireEvent: fireEvent,
        addClass: addClass,
        removeClass: removeClass,
        start: start,
        replace$Args: replace$Args,
        Event: Event,
        Languages: Languages
    }
})();
