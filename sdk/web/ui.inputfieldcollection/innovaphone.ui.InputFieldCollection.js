/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.scrollbar/innovaphone.ui.ScrollBar.js" />
/// <reference path="../ui.input/innovaphone.ui.Input.js" />
/// <reference path="../ui.icon/innovaphone.ui.Icon.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.InputFieldCollectionResources = innovaphone.ui.InputFieldCollectionResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.scrollbar/innovaphone.ui.ScrollBar",
                                       "web/ui.input/innovaphone.ui.Input",
                                       "web/ui.anchor/innovaphone.ui.Anchor",
                                       "web/ui.icon/innovaphone.ui.Icon"
    ], function () {
        innovaphone.ui.InputFieldCollectionResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.InputFieldCollectionContainer = innovaphone.ui.InputFieldCollectionContainer || (function () {
    function InputFieldCollectionContainer(container, width, height, inputfieldType, header, iconUrl, addIconPosX, addIconPosY, delIconPosX, delIconPosY, iconWidth, iconHeight, withScrollbar, popup, left, top, parent) {
        if (!container) container = document.createElement("div");
        if (withScrollbar == undefined) {
            var withScrollbar = true;
        }
        var head = document.createElement("div");
        var bodyScroll = document.createElement("div");
        if (withScrollbar) {
            var scrollBar = new innovaphone.ui.ScrollBar(bodyScroll);
        }
        var body = document.createElement("div");
        var headHeight = (header) ? 20 : 0;
        var iconMarginLeft = 20;
        var newElements = [];
        var existingElements = [];
        var deletedElements = [];
        var outerPopup = popup;

        if (left == undefined && top == undefined) {
            container.style.position = "relative";
        }
        else {
            container.style.position = "absolute";
            if (left != undefined) container.style.left = left + "px";
            if (top != undefined) container.style.top = top + "px";
        }
        if (parent != undefined) {
            parent.appendChild(container);
        }
        container.style.width = width + "px";
        if (scrollBar) {
            container.style.height = height + "px";
        }

        if (scrollBar) {
            head.style.position = "absolute";
            head.style.top = 0;
            head.style.left = 0;
            head.style.height = headHeight + "px";
        }
        head.style.display = "inline-block";
        head.style.whiteSpace = "nowrap";
        if (header) {
            head.innerHTML = header;
        }

        container.appendChild(head);

        if (scrollBar) {
            bodyScroll.style.position = "absolute";
            bodyScroll.style.top = headHeight + "px";
            bodyScroll.style.left = 0;
            bodyScroll.style.bottom = 0;
        }
        bodyScroll.style.display = "inline-block";
        bodyScroll.style.whiteSpace = "nowrap";

        container.appendChild(bodyScroll);

        body.style.position = "relative";
        body.style.display = "inline-block";
        if (withScrollbar) {
            scrollBar.appendContent(body);
            scrollBar.setWidth(width);
        } else {
            bodyScroll.appendChild(body);
            bodyScroll.style.width = width + "px";
            bodyScroll.style.maxWidth = bodyScroll.style.width;
        }

        function addElement() {
            if ((!body.firstChild) || (newElements[0].value() != "")) {     // ignore next element if element is not filled
                if ((newElements[0]) && (newElements[0].value() != "")) {
                    body.firstChild.title = newElements[0].value();         // to get browser error messages
                }
                var elementContainer = document.createElement("div");
                elementContainer.style.position = "relative";
                elementContainer.style.marginTop = "5px";
                var icon = new innovaphone.ui.Icon(null, iconUrl, addIconPosX, addIconPosY, iconWidth, iconHeight, width -iconWidth -5, 0);
                icon.setOnClick(function () { addElement(); });
                icon.container.style.display = "inline-block";
                icon.container.style.marginLeft = iconMarginLeft + "px";
                var inputElement = new innovaphone.ui.Input(null, inputfieldType);
                inputElement.setWidth(width - iconWidth - iconMarginLeft - 5);
                elementContainer.appendChild(inputElement.container);
                elementContainer.appendChild(icon.container);
                if (body.firstChild) {
                    var delIcon = new innovaphone.ui.Icon(null, iconUrl, delIconPosX, delIconPosY, iconWidth, iconHeight, width - iconWidth - 5, 0);
                    var element = newElements[0];
                    delIcon.setOnClick(makeDeleteNewElementFunction(element));
                    delIcon.container.style.display = "inline-block";
                    delIcon.container.style.marginLeft = iconMarginLeft + "px";
                    body.firstChild.replaceChild(delIcon.container, body.firstChild.lastChild);
                }
                newElements.unshift(inputElement);     // add element on first array position
                body.insertBefore(elementContainer, body.firstChild);
                inputElement.focus();
            }
            resize();
        }

        function makeDeleteNewElementFunction(element) {
            return function () {
                var len = body.childNodes.length;
                var value = element.value();
                for (var idx = 0; idx < len; idx++) {
                    if (inputfieldType == "text") {
                        var node = body.childNodes[idx].firstChild.childNodes[1];      // attention: input type text has one additional div for clearing
                    } else {
                        var node = body.childNodes[idx].firstChild.firstChild;
                    }
                    var nodeName = node.nodeName;
                    if (nodeName == "INPUT") {
                        if (node.value == element.value()) {
                            var elementToRemove = body.childNodes[idx];
                            body.removeChild(body.childNodes[idx]);
                            var elementIdx = newElements.indexOf(element);
                            newElements.splice(elementIdx, 1);
                            break;
                        }
                    }
                }
                resize();
            }
        }

        function addExistingElements(elements, callbackFunction) {
            if (elements) {
                for (var key in elements) {
                    var elementContainer = document.createElement("div");
                    elementContainer.style.position = "relative";
                    elementContainer.style.marginTop = "5px";
                    var elementWidth = width - iconWidth - iconMarginLeft - 5;
                    switch (inputfieldType) {
                        case "url":
                        case "file":
                            var element = new innovaphone.ui.Anchor(null, elements[key], elements[key], elementWidth);
                            break;
                        default:
                            var element = new innovaphone.ui.Input(null, "text", elements[key]);           // display existing data as readonly text fields      
                            element.setWidth(elementWidth);
                            element.disable();
                            element.setTitle(elements[key]);
                    }
                    if (callbackFunction) {
                        callbackFunction(element, elements[key]);
                    }
                    existingElements[key] = element;
                    var delIcon = new innovaphone.ui.Icon(null, iconUrl, delIconPosX, delIconPosY, iconWidth, iconHeight, width - iconWidth - 5, 0);
                    delIcon.setOnClick(makeDeleteExistingElementFunction(key));
                    delIcon.container.style.display = "inline-block";
                    delIcon.container.style.marginLeft = iconMarginLeft + "px";
                    elementContainer.appendChild(element.container);
                    elementContainer.appendChild(delIcon.container);
                    body.appendChild(elementContainer);
                }
                resize();
            }
        }

        function makeDeleteExistingElementFunction(key) {
            return function () {
                var len = body.childNodes.length;
                var value = existingElements[key].value();
                for (var idx = 1; idx < len; idx++) {
                    if (body.childNodes[idx].firstChild.childNodes[1]) {
                        var node = body.childNodes[idx].firstChild.childNodes[1];      // attention: input type text has one additional div for clearing
                    } else {
                        var node = body.childNodes[idx].firstChild.childNodes[0];      
                    }
                    var nodeName = node.nodeName;
                    if ((node.value == existingElements[key].value()) &&
                        (((nodeName == "INPUT") && (node.disabled)) || (nodeName == "A"))) {       // input field or anchor
                        var elementToRemove = body.childNodes[idx];
                        body.removeChild(body.childNodes[idx]);
                        deletedElements[key] = existingElements[key];
                        delete existingElements[key];
                        break;
                    }
                }
                resize();
            }
        }

        function resize() {
            if (scrollBar) {
                scrollBar.resize();
            }
            if (outerPopup) {
                outerPopup.resize();
            }
        }

        // public interfaces
        this.container = container;
        this.addElement = function () {
            addElement();
        }

        this.addExistingElements = function (elements, callbackFunction) {
            addExistingElements(elements, callbackFunction);
        }

        this.getNewValues = function () {
            var values = [];
            for (var idx = 0; idx < newElements.length; idx++) {
                if (newElements[idx].value() != "") {
                    values[values.length] = newElements[idx].value();
                }
            }
            return values;
        }

        this.getDeletedElements = function () {
            var elements = [];
            for (var key in deletedElements) {
                elements[key] = deletedElements[key].value();
            }
            return elements;
        }

        this.getDeletedElementKeys = function () {
            var keys = [];
            for (var key in deletedElements) {
                keys.push(key);
            }
            return keys;
        }

        this.getDeletedElementValues = function () {
            var values = [];
            for (var key in deletedElements) {
                values.push(deletedElements[key].value());
            }
            return values;
        }

        this.getNewFiles = function () {
            var files = [];
            if (inputfieldType == "file") {
                for (var idx = 0; idx < newElements.length; idx++) {
                    var elementFiles = newElements[idx].getFiles();
                    if (elementFiles.length > 0) {
                        for (var fileIdx = 0; fileIdx < elementFiles.length; fileIdx++) {
                            files[files.length] = elementFiles[fileIdx];
                        }
                    }
                }
            }
            return files;
        }

        this.resize = resize;

    } return InputFieldCollectionContainer;
}());


innovaphone.ui.InputFieldCollection = innovaphone.ui.InputFieldCollection || (function () {
    function InputFieldCollection(container, width, height, inputfieldType, header, elements, iconUrl, addIconPosX, addIconPosY, delIconPosX, delIconPosY, iconWidth, iconHeight, scrollbar, popup, callbackFunction, left, top, parent) {
        var iconWidth = (iconWidth) ? iconWidth : 20;
        var iconHeight = (iconHeight) ? iconHeight : 20;

        var inputFieldCollectionContainer = new innovaphone.ui.InputFieldCollectionContainer(container, width, height, inputfieldType, header, iconUrl, addIconPosX, addIconPosY,
                                                                                             delIconPosX, delIconPosY, iconWidth, iconHeight, scrollbar, popup, left, top, parent);
        inputFieldCollectionContainer.addElement();
        inputFieldCollectionContainer.addExistingElements(elements, callbackFunction);

        // public interfaces
        this.container = inputFieldCollectionContainer.container;

        this.resize = function () {
            inputFieldCollectionContainer.resize();
        }
        this.getNewValues = function () {
            return inputFieldCollectionContainer.getNewValues();
        }
        this.getNewFiles = function () {
            return inputFieldCollectionContainer.getNewFiles();
        }
        this.getDeletedElements = function () {
            return inputFieldCollectionContainer.getDeletedElements();
        }
        this.getDeletedElementKeys = function () {
            return inputFieldCollectionContainer.getDeletedElementKeys();
        }
        this.getDeletedElementValues = function () {
            return inputFieldCollectionContainer.getDeletedElementValues();
        }
    }
    return InputFieldCollection;
}());
