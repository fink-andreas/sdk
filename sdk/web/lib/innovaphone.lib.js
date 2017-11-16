
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

// The default toISOString function adds the miliseconds. But we don't need them.
// Because of this, whe use an own function.
Date.prototype.toISOStringWithoutMS = function () {
    return this.getUTCFullYear() + '-' +
            pad(this.getUTCMonth() + 1) + '-' +
            pad(this.getUTCDate()) + 'T' +
            pad(this.getUTCHours()) + ':' +
            pad(this.getUTCMinutes()) + ':' +
            pad(this.getUTCSeconds()) + 'Z';

    function pad(num) {
        if (num < 10)
            return '0' + num;
        else
            return num;
    }
}

/** static innovaphone.lib functions **/

var innovaphone = innovaphone || {};
innovaphone.lib = innovaphone.lib || (function () {

    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
        blockingInstances = 0,
        blockingDiv = null,
        activeInput = null,
        loadingScripts = [],
        activeLang = "en",
        languages = null,
        storageIdLang = null;

    var keyCodes = {
        arrowDown: 40,
        arrowUp: 38,
        escape: 27,
        enter: 13,
        tab: 9
    };

    if (!isTouch) { // add class no-touch to the body, which can be used inside the CSS to avoid e.g. hover effects on touch devices
        if (document.readyState == "complete") {
            setNoTouch();
        }
        else {
            window.addEventListener("load", function () {
                setNoTouch();
            });
        }
    }

    function setNoTouch() {
        addClass(document.body, "ijs-no-touch");
    }

    function setNoSelect(container) {
        container.style.webkitTouchCallout = "none";
        container.style.webkitUserSelect = "none";
        container.style.khtmlUserSelect = "none";
        container.style.MozUserSelect = "none";
        container.style.msUserSelect = "none";
        container.style.userSelect = "none";
        container.style.draggable = false;
        container.onselectstart = function () { return false; }
        container.ondragstart = function () { return false; }
    }

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

    function blockUIAndWait(block) {
        if (block) {
            if (!blockingDiv) {
                blockingDiv = document.createElement("div");
                blockingDiv.style.display = "block";
                blockingDiv.style.backgroundColor = "rgba(1, 1, 1, 0.2)";
                blockingDiv.style.bottom = 0;
                blockingDiv.style.left = 0;
                blockingDiv.style.right = 0;
                blockingDiv.style.top = 0;
                blockingDiv.style.position = "fixed";
                blockingDiv.style.zIndex = 1000000;
                blockingDiv.style.backgroundRepeat = "no-repeat";
                blockingDiv.style.backgroundPosition = "center";
                addClass(blockingDiv, "ijs-blocking");
            }
            document.body.appendChild(blockingDiv);
            blockingInstances++;
        }
        else {
            if (blockingInstances > 0) {
                blockingInstances--;
            }
            if (blockingInstances == 0) {
                document.body.removeChild(blockingDiv);
            }
        }
    }

    // args is a 2 dimensional array like [ [ "name", "value" ], ["name", "value"] ]
    function buildURL(url, args) {
        if (args && args.length > 0) {
            var delim = "&";
            if (url.indexOf("?") < 0) {
                delim = "?";
            }
            for (var i = 0; i < args.length; i++) {
                url += delim + args[i][0] + "=";
                if (args[i][1] != null && args[i][1] != undefined) {
                    url += encodeURIComponent(args[i][1]);
                }
                delim = "&";
            }
        }
        return url;
    }

    function submitGet(url, funcComplete, blockUI) {
        var xmlReq = new window.XMLHttpRequest();
        if (xmlReq) {
            xmlReq.open("GET", url, funcComplete ? true : false);
            xmlReq.setRequestHeader("Connection", "close");
            if (blockUI) {
                blockUIAndWait(true);
            }
            xmlReq.send(null);
            if (funcComplete) {
                xmlReq.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (blockUI) {
                            blockUIAndWait(false);
                        }
                        if (this.status == 200) {
                            funcComplete(this.responseText);
                        }
                        else {
                            alert("xmlReq.status = " + this.status + "\nresponseText = " + this.responseText);
                        }
                    }
                }
            }
            else {
                if (blockUI) {
                    blockUIAndWait(false);
                }
                if (xmlReq.readyState == 4) {
                    return xmlReq.responseText;
                }
                else {
                    alert("xmlReq.status = " + xmlReq.status + "\nresponseText = " + xmlReq.responseText);
                    return null;
                }
            }
        }
        return xmlReq;
    }

    function submitPost(parameters, url, funcComplete, blockUI) {
        var parms = "lang=" + localStorage.lang;
        if ((parameters instanceof Array) || (typeof parameters === 'object')) {
            for (var parameter in parameters) {
                parms += "&" + encodeURIComponent(parameter) + "=" + encodeURIComponent(parameters[parameter]);
            }
        } else {
            alert("submitPost -> invalid parameters: " + parameters);
            return;
        }

        var xmlReq = new window.XMLHttpRequest();
        (typeof blockUI === "undefined") ? blockUI = true : blockUI = blockUI;

        if (xmlReq) {
            if (blockUI) {
                blockUIAndWait(true);
            }
            xmlReq.open('post', url, funcComplete ? true : false);
            xmlReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlReq.setRequestHeader("Content-length", parms.length);
            xmlReq.setRequestHeader("Connection", "close");
            xmlReq.send(parms);
            if (funcComplete) {
                xmlReq.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (blockUI) {
                            blockUIAndWait(false);
                        }
                        if (this.status == 200) {
                            funcComplete(this.responseText);
                        }
                        else {
                            alert("xmlReq.status = " + this.status + "\nresponseText = " + this.responseText);
                        }
                    }
                }
            }
            else {
                if (xmlReq.readyState == 4) {
                    if (blockUI) {
                        blockUIAndWait(false);
                    }
                    return xmlReq.responseText;
                }
                else {
                    alert("xmlReq.status = " + xmlReq.status + "\nresponseText = " + xmlReq.responseText);
                    return null;
                }
            }
            return xmlReq;
        }
    }

    function submitFormData(parms, url, funcComplete, blockUI) {
        var formData = new FormData();
        formData.append("lang", localStorage.lang);
        if ((parms instanceof Array) || (typeof parms === 'object')) {
            for (var parameter in parms) {
                if ((parms[parameter] instanceof Array) || (typeof parms[parameter] === 'object')) {
                    for (var element in parms[parameter]) {
                        formData.append(parameter + "[" + element + "]", parms[parameter][element]);
                    }
                } else {
                    formData.append(parameter, parms[parameter]);
                }
            }
        } else {
            alert("submitFormData -> invalid parameters: " + parms);
            return;
        }

        var xmlReq = new window.XMLHttpRequest();
        (typeof blockUI === "undefined") ? blockUI = true : blockUI = blockUI;

        if (xmlReq) {
            if (blockUI) {
                blockUIAndWait(true);
            }
            xmlReq.open('POST', url, funcComplete ? true : false);
            xmlReq.send(formData);
            if (funcComplete) {
                xmlReq.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (blockUI) {
                            blockUIAndWait(false);
                        }
                        if (this.status == 200) {
                            funcComplete(this.responseText);
                        }
                        else {
                            alert("xmlReq.status = " + this.status + "\nresponseText = " + this.responseText);
                        }
                    }
                }
            }
            else {
                if (blockUI) {
                    blockUIAndWait(false);
                }
                if (xmlReq.readyState == 4) {
                    return xmlReq.responseText;
                }
                else {
                    alert("xmlReq.status = " + xmlReq.status + "\nresponseText = " + xmlReq.responseText);
                    return null;
                }
            }
        }
        return xmlReq;
    }

    function loadScript(src) {
        var script = submitGet(src);
        script += "\n//# sourceURL=" + src;
        globalEval(script);
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
        var loaded = false;
        var obj = null;
        for (var i = 0; i < classParts.length; i++) {
            loaded = false;
            if (!current[classParts[i]]) {          // classname directly found in object 
                for (var property in current) {     // check if there is a property independent of the casing of the class name or/and file name
                    if (current.hasOwnProperty(property)) {
                        if (property.toLowerCase() == classParts[i].toLowerCase()) {
                            loaded = true;
                            break;
                        }
                    }
                }
            }
            else {
                loaded = true;
            }
            if (!loaded) {
                var scriptFile = className + ".js";
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
                    loadScript(scriptFile);
                }
                break;
            }
            current = current[classParts[i]];
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

    function globalEval(src) {
        if (window.execScript) {
            window.execScript(src);
            return;
        }
        var fn = function () {
            window.eval.call(window, src);
        };
        fn();
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

    function makeUnselectable(element) {
        element.style.MozUserSelect = "none";
        element.style.webkitUserSelect = "none";
        element.style.webkitTouchCallout = "none";
        element.setAttribute("unselectable", "on");
    }

    function setActiveInput(element) {
        activeInput = element;
    }

    function getActiveInput() {
        return activeInput;
    }

    function stringToXml(text, mimeType) {
        var parser = new DOMParser();
        if (!mimeType) mimeType = "text/xml";
        var xml = parser.parseFromString(text, mimeType);
        return xml;
    }

    /**
    translatedString: the already translated string, which contains occurrences of $1, $2, $3... which have to be replaced
    param1: $1 will be replaced with the value of param1
    paramX: $X will be replaced with the value of paramX
    **/
    function translate(translatedString) {
        for (var i = 1; i < arguments.length; i++) {
            var replacer = new RegExp("\\$" + i.toString(), "g");
            translatedString = translatedString.replace(replacer, arguments[i]);
        }
        return translatedString;
    }

    function changeLanguage(lang) {
        if (storageIdLang) localStorage[storageIdLang] = lang;
        if (activeLang != lang) {   // reload
            location.href = location.href;
        }
    }

    function setActiveLanguage(lang) {
        activeLang = lang;
    }

    function initLanguages(storageIdInit, languagesInit, defaultLanguage) {
        storageIdLang = storageIdInit;
        languages = languagesInit;
        if (defaultLanguage) {
            activeLang = defaultLanguage;
        }
        if (storageIdLang && localStorage[storageIdLang]) {
            activeLang = localStorage[storageIdLang];
        }
        changeLanguage(activeLang);
    }

    function languageFile(file) {
        return file + "." + activeLang;
    }

    function getLanguages() {
        return languages;
    }

    function getActiveLanguage() {
        return activeLang;
    }

    function clearSelection() {
        if (document.selection && document.selection.empty) {
            document.selection.empty();
        } else if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
        }
    }

    function getLanguageUrlParam() {
        var args = [];
        var url = location.href;
        var params = location.search.substring(1);
        var pairs = params.split("&");
        var numberOfArguments = pairs.length;

        var lang = "en";
        for (var i = 0; i < numberOfArguments; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var argname = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            args[argname] = unescape(value);
            if (argname == "lang") {
                lang = args[argname];
            }
        }
        return lang;
    }

    function addCSSFile(href) {
        var link = document.createElement("link");
        link.setAttribute("href", href);
        link.setAttribute("type", "text/css");
        link.setAttribute("rel", "stylesheet");
        document.head.appendChild(link);
    }

    function removeCSSFile(href) {
        for (var i = 0; i < document.head.childNodes.length; i++) {
            var child = document.head.childNodes[i];
            if (child.nodeName.toLowerCase() == "link") {
                var linkHref = child.getAttribute("href");
                if (href == linkHref) {
                    document.head.removeChild(child);
                    return;
                }
            }
        }
    }

    activeLang = getLanguageUrlParam();

    return {
        isTouch: isTouch,
        makeUnselectable: makeUnselectable,
        removeClass: removeClass,
        addClass: addClass,
        fireEvent: fireEvent,
        globalEval: globalEval,
        loadObjectScript: loadObjectScript,
        loadObjectScripts: loadObjectScripts,
        loadScript: loadScript,
        submitGet: submitGet,
        submitPost: submitPost,
        submitFormData: submitFormData,
        isInt: isInt,
        isFloat: isFloat,
        isPrimitiveType: isPrimitiveType,
        buildURL: buildURL,
        blockUIAndWait: blockUIAndWait,
        getActiveInput: getActiveInput,
        setActiveInput: setActiveInput,
        keyCodes: keyCodes,
        stringToXml: stringToXml,
        translate: translate,
        initLanguages: initLanguages,
        setActiveLanguage: setActiveLanguage,
        changeLanguage: changeLanguage,
        languageFile: languageFile,
        getLanguages: getLanguages,
        getActiveLanguage: getActiveLanguage,
        clearSelection: clearSelection,
        setNoSelect: setNoSelect,
        getLanguageUrlParam: getLanguageUrlParam,
        addCSSFile: addCSSFile,
        removeCSSFile: removeCSSFile
    }
})();
