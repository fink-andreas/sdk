/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.drag/innovaphone.ui.Drag.js" />
/// <reference path="../ui.button/innovaphone.ui.Button.js" />
/// <reference path="../ui.elementscontainer/innovaphone.ui.ElementsContainer.js" /

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.PopupResources = innovaphone.ui.PopupResources || function (onload) {
    innovaphone.lib.loadObjectScripts(
        ["web/ui.drag/innovaphone.ui.Drag",
            "web/ui.elementscontainer/innovaphone.ui.ElementsContainer",
            "web/ui.scrollbar/innovaphone.ui.ScrollBar",
            "web/ui.button/innovaphone.ui.Button"], function () {
                innovaphone.ui.PopupResourcesLoaded = true;
                onload();
            });
};
innovaphone.ui.Popup = innovaphone.ui.Popup || (function () {
    function Popup(container, headText, columnCount, width, height, subHeaderText) {
        var instance = this,
            background = document.createElement("div"),
            main = document.createElement("div"),
            head = document.createElement("div"),
            subHeader = (subHeaderText ? document.createElement("div") : null),
            content = document.createElement("div"),
            closer = document.createElement("div"),
            buttons = null,
            buttonOnEnter = null,
            buttonOnEscape = null,
            mouseEvent = innovaphone.lib.isTouch ? "touchend" : "mouseup",
            elementsContainer = new innovaphone.ui.ElementsContainer(null, columnCount),
            adjustedColumns = [],
            onClose = null,
            closed = false;
        var popupScroll = null;
        var browserZoomFactor = 1;

        var originalPopupInputHeight = height;
        var lastWindowHeight = window.innerHeight;
        if (originalPopupInputHeight >= window.innerHeight) {
            if (window.devicePixelRatio >= 1) {
                browserZoomFactor = 1 / window.devicePixelRatio;
            } else {
                browserZoomFactor = 1 * window.devicePixelRatio;
            }
        }
        height = originalPopupInputHeight * browserZoomFactor;

        addToList();

        if (!container) container = document.body;  // place popups in the middle of the whole page per default

        background.style.position = "absolute";
        background.style.zIndex = 1;
        background.style.top = 0;
        background.style.bottom = 0;
        background.style.left = 0;
        background.style.right = 0;
        background.style.backgroundColor = "rgba(100,100,100,0.2)";
        container.appendChild(background);

        main.style.position = "absolute";
        main.style.borderWidth = "4px";
        main.style.borderColor = "transparent";
        main.style.borderStyle = "solid";
        main.style.width = width + "px";
        main.style.height = height + "px";
        innovaphone.lib.addClass(main, "ijs-popup-main");
        background.appendChild(main);

        head.style.position = "absolute";
        head.style.left = 0;
        head.style.right = 0;
        head.style.top = 0;
        head.style.height = "20px";
        head.style.fontSize = "14px";
        head.style.textAlign = "center";
        head.style.fontWeight = "bold";
        innovaphone.lib.addClass(head, "ijs-header");
        head.innerHTML = headText;
        main.appendChild(head);

        if (subHeader) {
            subHeader.style.position = "absolute";
            subHeader.style.top = head.offsetHeight + "px";
            subHeader.style.right = 0;
            subHeader.style.left = 0;
            subHeader.style.height = "50px";
            subHeader.style.fontWeight = "bold";
            subHeader.style.fontSize = "14px";
            subHeader.style.padding = "10px";
            innovaphone.lib.addClass(subHeader, "ijs-sub-header");
            subHeader.innerHTML = subHeaderText;
            main.appendChild(subHeader);
        }
        content.style.position = "absolute";
        var contentHeight = head.offsetHeight;
        if (subHeader) {
            contentHeight += subHeader.offsetHeight;
        }
        content.style.top = contentHeight + "px";
        content.style.left = 0;
        content.style.right = 0;
        content.style.bottom = 0;
        content.style.padding = "5px";
        content.style.height = (height - contentHeight - 30) + "px";    // 30px -> buttons

        popupScroll = new innovaphone.ui.ScrollBar(content);
        popupScroll.appendContent(elementsContainer.container);
        main.appendChild(content);

        closer.style.cursor = "pointer";
        closer.style.position = "absolute";
        closer.style.right = "-30px";
        closer.style.top = "-30px";
        closer.style.zIndex = 1;
        closer.style.height = "60px";
        closer.style.width = "60px";
        closer.style.backgroundRepeat = "no-repeat";
        innovaphone.lib.addClass(closer, "ijs-close");
        main.appendChild(closer);

        function center() {
            // position main in the center of container
            var top = (container.clientHeight / 2 - main.offsetHeight / 2);
            var left = (container.clientWidth / 2 - main.offsetWidth / 2);
            if (top < 0) top = 0;
            if (left < 0) left = 0;
            main.style.top = top + "px";
            main.style.left = left + "px";
        }

        function close() {
            if (closed) return; // prevent multiple closing calls, which might happen with e.g. a wizard
            closed = true;
            container.removeChild(background);
            document.body.removeEventListener("keydown", onEscape);
            //document.body.removeEventListener(mouseEvent, onClick);
            removeFromList();
            if (onClose) {
                onClose();
            }
        }

        function closeOnEvent() {
            if (buttonOnEscape) {           // else close
                buttonOnEscape.click();
            }
            else {
                close();
            }
        }

        function addToList() {
            innovaphone.ui.Popup.list.push(instance);
        }

        function removeFromList() {
            var index = innovaphone.ui.Popup.list.indexOf(instance);
            if (index >= 0) {
                innovaphone.ui.Popup.list.splice(index, 1);
            }
        }

        function onClick(event) {
            if (!isTopPopup()) {
                return;
            }
            if (event.target) {
                var parentNode = event.target;
                while (parentNode != null) {
                    if (parentNode == main) {   // do nothing if clicked on main or a childNode of main
                        return;
                    }
                    parentNode = parentNode.parentNode;
                }
                closeOnEvent();
            }
        }

        function isTopPopup() {
            var index = innovaphone.ui.Popup.list.indexOf(instance);
            if (index == (innovaphone.ui.Popup.list.length - 1)) {  // only remove last opened popup
                return true;
            }
            return false;
        }

        function onEnter(event) {
            if (event.keyCode == innovaphone.lib.keyCodes.enter) {
                if (!event.defaultPrevented) {  // e.g. a user used enter inside a dropdown input to close the dropdown
                    buttonOnEnter.click();
                }
            }
        }

        function onEscape(event) {
            if (event.keyCode == innovaphone.lib.keyCodes.escape && !event.defaultPrevented) {
                if (!isTopPopup()) {
                    return;
                }
                if (innovaphone.lib.getActiveInput() != null) { // there is another input which might consume ESC 
                    return;
                }
                closeOnEvent();
            }
        }

        function popupResize(event) {
            if (window.innerHeight != lastWindowHeight) {    // window height changed
                if (originalPopupInputHeight >= window.innerHeight) {
                    if (window.devicePixelRatio >= 1) {
                        browserZoomFactor = 1 / window.devicePixelRatio;
                    } else {
                        browserZoomFactor = 1 * window.devicePixelRatio;
                    }
                } else {
                    browserZoomFactor = 1;
                }
                var buttonHeight = 30 / browserZoomFactor;   // height of button div
                var newPopupHeight = originalPopupInputHeight * browserZoomFactor;
                main.style.height = newPopupHeight + "px";
                content.style.height = (newPopupHeight - (contentHeight / browserZoomFactor) - buttonHeight) + "px";
                if (buttons) { // position button div
                    buttons.style.top = (newPopupHeight - buttonHeight) + "px";
                }
                lastWindowHeight = window.innerHeight;
                popupScroll.resize();
            }
        }

        closer.onclick = close;
        document.body.addEventListener("keydown", onEscape);
        window.addEventListener("resize", popupResize, false);
        //document.body.addEventListener(mouseEvent, onClick);  // do not close popup on click which is not inside popup
        innovaphone.ui.Drag.makeDraggable(main, head);
        center();
        popupScroll.resize();   // resize scrollbar to inner height of popup

        // public interface
        this.hide = function () {
            background.style.display = "none";
            removeFromList();
        }

        this.show = function () {
            background.style.display = "";
            for (var i = 0; i < adjustedColumns.length; i++) {
                elementsContainer.adjustColumnWidth(adjustedColumns[i]);
            }
            addToList();
        }

        this.close = close;

        this.addElement = function (element, fillLine) {
            elementsContainer.addElement(element, fillLine);
            element.addEventListener("keydown", onEnter);
        }

        this.adjustColumnWidth = function (column) {
            elementsContainer.adjustColumnWidth(column);
            adjustedColumns.push(column);
            popupScroll.resize();
        }

        this.setOnClose = function (funcOnClose) {
            onClose = funcOnClose;
        }

        this.addButton = function (text, funcOnClick, clickOnEnter, clickOnEscape) {
            if (!buttons) { // create a div which contains all buttons, e.g. for wizards, and recalc main height + center position
                buttons = document.createElement("div");
                buttons.style.position = "absolute";
                buttons.style.top = (height - 30) + "px";
                buttons.style.padding = "5px";
                buttons.style.height = "30px";
                buttons.style.right = 0;
                buttons.style.marginRight = "20px";
                main.appendChild(buttons);
                center();
            }
            var button = new innovaphone.ui.Button(buttons, text, funcOnClick);
            if (clickOnEnter) {
                buttonOnEnter = button;
            }
            if (clickOnEscape) {
                buttonOnEscape = button;
            }
            button.getButtonElement().style.marginLeft = "20px";
            return button;
        }

        this.content = popupScroll.getContent();

        this.resize = function () {
            popupScroll.resize();
        }
    }
    Popup.list = [];    // a global static list which contains all popup which are currently visible
    return Popup;
}());