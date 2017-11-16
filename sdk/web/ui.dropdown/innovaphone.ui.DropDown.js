/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.input/innovaphone.ui.Input.js" />
/// <reference path="../ui.scrollbar/innovaphone.ui.ScrollBar.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.DropDownResources = innovaphone.ui.DropDownResources || function (onload) {
    innovaphone.lib.loadObjectScripts([
            "web/ui.input/innovaphone.ui.Input",
            "web/ui.scrollbar/innovaphone.ui.ScrollBar"
    ], function () {
        innovaphone.ui.DropDownResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.DropDown = innovaphone.ui.DropDown || (function () {

    function DropDown(container, width, invertedColors, userInput, maxInputLength, left, top, parent) {

        var instance = this,
            activator = document.createElement("span"),
            activatorIconOuter = document.createElement("span"),
            activatorIcon = document.createElement("span"),
            activatorInfo = document.createElement("span"),
            menu = document.createElement("span"),
            scroll = new innovaphone.ui.ScrollBar(menu),
            menuContent = scroll.getContent(),
            items = [],
            isShown = false,
            selectedValue = null,
            callback = null,
            deactivateCallback = null,
            activateCallback = null,
            width = Math.max(60, (parseInt(width ? width : 135))) + "px",
            minWidth = (parseInt(width) - 25) + "px",
            inputTemp = null,
            hoverIndex = null,
            newElement = false,
            maxHeight = 250,
            searchText = "",
            searchTimeout = null;

        if (!container) {
            container = document.createElement("span");
            if (left != undefined || top != undefined) {
                container.style.position = "absolute";
                if (left != undefined) container.style.left = left + "px";
                if (top != undefined) container.style.top = top + "px";
            }
        }
        if (parent != undefined) {
            parent.appendChild(container);
        }
        // build DOM
        container.tabIndex = "0";
        container.appendChild(activator);
        activator.appendChild(activatorIconOuter);
        activatorIconOuter.appendChild(activatorIcon);
        activator.appendChild(activatorInfo);
        container.appendChild(menu);
        container.addEventListener("focus", focus);

        // initialize UI
        activator.style.fontSize = "14px";
        innovaphone.lib.addClass(activator, "ijs-dropdown-activator");
        if (invertedColors) {
            innovaphone.lib.addClass(activator, "ijs-dropdown-activator-inverted");
        }
        activator.style.position = "relative";
        activator.style.height = "23px";
        activator.style.width = width;
        activator.style.borderWidth = "1px";
        activator.style.borderStyle = "solid";
        activator.style.boxSizing = "border-box";
        activator.style.cursor = "pointer";
        activator.style.display = "block";
        activator.style.margin = "0px";
        activator.style.paddingTop = "0px";
        activator.style.paddingRight = "15px";
        activator.style.paddingBottom = "0px";
        activator.style.paddingLeft = "3px";
        activator.style.textAlign = "left";
        
        innovaphone.lib.addClass(activatorIconOuter, "ijs-dropdown-activator-icon-outer");
        activatorIconOuter.style.borderLeftWidth = "1px";
        activatorIconOuter.style.borderLeftStyle = "solid";
        activatorIconOuter.style.position = "absolute";
        activatorIconOuter.style.height = "21px";
        activatorIconOuter.style.width = "15px";
        activatorIconOuter.style.top = "0px";
        activatorIconOuter.style.right = "0px";

        innovaphone.lib.addClass(activatorIcon, "ijs-dropdown-activator-icon");
        if (invertedColors) {
            innovaphone.lib.addClass(activatorIcon, "ijs-dropdown-activator-icon-inverted");
        }
        activatorIcon.style.position = "absolute";
        activatorIcon.style.top = "7px";
        activatorIcon.style.right = "4px";
        activatorIcon.style.height = "7px";
        activatorIcon.style.width = "7px";

        activatorInfo.style.top = "1px";
        activatorInfo.style.right = "17px";
        activatorInfo.style.bottom = "0px";
        activatorInfo.style.left = "3px";
        activatorInfo.style.overflow = "hidden";
        activatorInfo.style.position = "absolute";
        activatorInfo.style.textOverflow = "ellipsis";
        activatorInfo.style.whiteSpace = "nowrap";

        innovaphone.lib.addClass(menu, "ijs-dropdown-menu");
        if (invertedColors) {
            innovaphone.lib.addClass(menu, "ijs-dropdown-menu-inverted");
        }
        menu.style.position = "absolute";
        menu.style.width = width;
        menu.style.height = "auto";
        menu.style.clear = "both";
        menu.style.borderWidth = "1px";
        menu.style.borderStyle = "solid";
        menu.style.padding = "0px";
        menu.style.textAlign = "left";
        menu.style.zIndex = 199;
        menu.style.display = "none";
        menu.style.maxHeight = maxHeight + "px";
        scroll.setMaxHeight(maxHeight);

        function show() {
            if (isShown) return;
            if (activateCallback) activateCallback();
            isShown = true;
            menu.style.display = "block";
            innovaphone.lib.addClass(activator, "ijs-dropdown-activator-active");
            window.addEventListener("keydown", keyDown);
            activator.removeEventListener("mousedown", show);
            activator.addEventListener("mousedown", activatorMouseDown);
            window.addEventListener("mousedown", mouseDown);
            var text = activatorInfo.textContent;
            var item = null;
            if (userInput) {
                activatorInfo.textContent = "";
                inputTemp = new innovaphone.ui.InputText(null, text);
                item = findItemByStartText(inputTemp.value().trim());
                if (maxInputLength) {
                    inputTemp.setMaxLength(maxInputLength);
                }
                inputTemp.addEventListener("keydown", inputKeyDown);
                inputTemp.addEventListener("keyup", inputKeyUp);
                inputTemp.setOnChange(inputChanged);
                inputTemp.style.width = (activator.offsetWidth - activator.firstChild.offsetWidth - 18) + "px";
                inputTemp.style.borderStyle = "none";
                inputTemp.style.outline = "none";
                activatorInfo.appendChild(inputTemp.container);
                window.setTimeout(setInputFocus, 10);
            }
            else {
                item = findItemByStartText(text);
            }
            innovaphone.lib.setActiveInput(instance);
            scroll.resize();
            if (item) {
                itemHoverChange(getIndexByItem(item));
            }
        }

        function mouseDown(event) {
            if (event && event.target.isChildOf(container)) return;
            doMouseOut();
        }

        function activatorMouseDown(event) {
            if (inputTemp && event && event.target.isChildOf(activatorInfo)) return;
            hide();
            /*
            function mouseOut(event) {
            var target = innovaphone.lib.isTouch ? event.target : event.relatedTarget;
            if (target && (target == container || containerContains(target))) { // do not handle mouse out for own or containing elements
                return;
            }
            doMouseOut();
        }
*/
        }

        function hide() {
            if (!isShown) return;
            isShown = false;
            itemHoverChange(null);
            menu.style.display = "none";
            window.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("keydown", keyDown);
            activator.removeEventListener("mousedown", activatorMouseDown);
            activator.addEventListener("mousedown", show);
            container.removeEventListener("keydown", containerKeyDown);
            innovaphone.lib.removeClass(activator, "ijs-hover");
            innovaphone.lib.removeClass(activator, "ijs-dropdown-activator-active");
            innovaphone.lib.setActiveInput(null);
            if (deactivateCallback) deactivateCallback();
            container.focus();  // keep the focus after hiding
        }

        function findItem(value) {
            var max = items.length;
            for (var i = 0; i < max; i++) {
                var item = items[i];
                if (item.value == value) {
                    return item;
                }
            }
            return null;
        }

        function findItemByText(text) {
            var max = items.length;
            for (var i = 0; i < max; i++) {
                var item = items[i];
                if (item.text.toUpperCase() == text.toUpperCase()) {
                    return item;
                }
            }
            return null;
        }

        function findItemByStartText(text) {
            var max = items.length;
            for (var i = 0; i < max; i++) {
                var item = items[i];
                if (item.text.toUpperCase().startsWith(text.toUpperCase())) {
                    return item;
                }
            }
            return null;
        }
        
        function getIndexByItem(item) {
            for(var i = 0; i < items.length; i++) {
                if(items[i] == item) {
                    return i;
                }
            }
            return 0;
        }

        function updateInfo(value, item) {
            activatorInfo.innerHTML = "";
            if (!item)
                activatorInfo.textContent = "";
            else if (innovaphone.lib.isPrimitiveType(item))
                activatorInfo.textContent = item;
            else if (item.userControl) {
                tmpNode = item.container.firstChild.cloneNode(true);
                tmpNode.style.width = activatorInfo.style.width;
                tmpNode.style.position = "relative";
                tmpNode.style.top = "-1px";
                activatorInfo.appendChild(tmpNode);
            }
            else
                activatorInfo.textContent = item.text;


            selectedValue = value;

            delete inputTemp;
            inputTemp = null;
        }

        function userSelect(value) {
            newElement = false;
            hide();
            select(value);
            if (callback) callback(selectedValue);
        }

        function select(value) {
            var item = findItem(value);
            if (item) {
                updateInfo(item.value, item);
            }
            else {
                updateInfo(null, null);
            }
        }

        function containerContains(element) {
            while ((element = element.parentNode)) {
                if (element == container) return true;
            }
            return false;
        }

        function focus(event) {
            innovaphone.lib.addClass(activator, "ijs-hover");
            activator.style.outlineColor = "transparent";
            container.addEventListener("keydown", containerKeyDown);
        }

        function containerKeyDown(event) {
            if (!items.length) return;
            var newIndex = null;
            switch (event.keyCode) {
                case innovaphone.lib.keyCodes.escape:
                case innovaphone.lib.keyCodes.tab:
                    if (!event.defaultPrevented && isShown) {
                        event.preventDefault();
                        doMouseOut(event.keyCode == innovaphone.lib.keyCodes.escape);
                    }
                    return;
                case innovaphone.lib.keyCodes.arrowDown:
                    event.preventDefault();     // this shouldn't bee needed, but firefox moves the whole page upwards otherwise...
                    if (hoverIndex == null || hoverIndex == (items.length - 1)) {
                        newIndex = 0;
                    }
                    else {
                        newIndex = hoverIndex + 1;
                    }
                    break;
                case innovaphone.lib.keyCodes.arrowUp:
                    if (hoverIndex == null || hoverIndex == 0) {
                        newIndex = items.length - 1;
                    }
                    else {
                        newIndex = hoverIndex - 1;
                    }
                    break;
                case innovaphone.lib.keyCodes.enter:
                    if (hoverIndex != null) {
                        userSelect(items[hoverIndex].value);
                    }
                    return;
                default:
                    return;
            }
            if (hoverIndex == null) {
                show();
            }
            else {
                itemHoverChange(newIndex, true);
            }
        }

        function itemHoverChange(newIndex, scrollToNewIndex) {
            if (hoverIndex != null) {
                innovaphone.lib.removeClass(items[hoverIndex].container, "ijs-hover");
            }
            hoverIndex = newIndex;
            if (hoverIndex != null) {
                innovaphone.lib.addClass(items[hoverIndex].container, "ijs-hover");
                if(scrollToNewIndex) {
                    scrollTo(items[hoverIndex]);
                }
            }
        }

        function itemMouseEnter(event) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].container == event.target) {
                    itemHoverChange(i);
                    break;
                }
            }
        }

        function doMouseOut(ignoreInputTemp) {
            if (ignoreInputTemp == undefined) ignoreInputTemp = false;
            if (inputTemp) {
                if (ignoreInputTemp) {
                    inputTemp.reset();
                }
                var item = findItemByText(inputTemp.value().trim());
                if (item) {
                    newElement = false;
                    updateInfo(item.value, item);
                } else {
                    newElement = true;
                    updateInfo(inputTemp.value(), inputTemp.value());
                }
                if (!ignoreInputTemp) {
                    if (callback) callback(selectedValue);
                }
            }
            hide();
        }

        function setInputFocus() {
            inputTemp.focus();
            inputTemp.setSelectionRange(inputTemp.value().length, inputTemp.value().length);
        }

        function keyDownTimeout() {
            searchText = "";
            searchTimeout = null;
        }
        
        function keyDown(event) {
            switch(event.keyCode) {
                case innovaphone.lib.keyCodes.escape:
                    if(!event.defaultPrevented) {
                        event.preventDefault();
                        doMouseOut(true);
                    }
                    break;
            }
            // we try to jump to the searched item 
            if(!inputTemp && event.key.length == 1) {
                searchText += event.key;
                item = findItemByStartText(searchText);
                if (item) {
                    itemHoverChange(getIndexByItem(item) , true);
                }
                window.clearTimeout(searchTimeout);
                searchTimeout = window.setTimeout(keyDownTimeout, 1000);
            }
        }

        function inputKeyDown(event) {
            switch (event.keyCode) {
                case innovaphone.lib.keyCodes.tab:
                    doMouseOut();
                    break;
                case innovaphone.lib.keyCodes.enter:
                    event.preventDefault(); // set event.defaultPrevented=true, e.g. to prevent a popup from closing
                    if(hoverIndex != null) {
                        userSelect(items[hoverIndex].value);
                    }
                    else {
                        doMouseOut();
                    }
                    break;
                case innovaphone.lib.keyCodes.arrowDown:
                case innovaphone.lib.keyCodes.arrowUp:
                case innovaphone.lib.keyCodes.escape:
                    break;
                default:
                    itemHoverChange(null);
                    break;
            }
        }
        
        function inputSelect(value) {
            inputTemp.setValue(value);
            doMouseOut();
        }

        function inputChanged() {
            hoverIndex = null;
            inputSelect(inputTemp.value());
        }
        
        function inputKeyUp(event) {
            if(event.key.length == 1) { // length is just 1 for characters, not for keys like ArrawUp, Enter etc.
                hoverIndex = null;
                var item = findItemByText(inputTemp.value().trim());
                if (!item) {
                    item = findItemByStartText(inputTemp.value().trim());
                }
                if (item) {
                    itemHoverChange(getIndexByItem(item), true);
                }
            }
        }
        

        function scrollTo(item) {
            scroll.scrollIntoView(item.container);
        }

        function Item(container, owner, value, item, minWidth, sortText) {
            container = container || document.createElement("div");

            theText = "";
            if (innovaphone.lib.isPrimitiveType(item)) {
                theText = (sortText ? sortText : item);
                item = document.createTextNode(item);
                this.userControl = false;
            }
            else {
                theText = (sortText ? sortText : item.textContent);
                this.userControl = true;
            }

            // initialize UI
            innovaphone.lib.addClass(container, "ijs-dropdown-menu-item");
            if (invertedColors) {
                innovaphone.lib.addClass(container, "ijs-dropdown-menu-item-inverted");
            }
            container.style.cursor = "pointer";
            container.style.display = "block";
            container.style.minHeight = "22px";
            container.style.overflow = "hidden";
            container.style.paddingTop = "0px";
            container.style.paddingRight = "0px";
            container.style.paddingBottom = "0px";
            container.style.paddingLeft = "5px";
            container.style.minWidth = minWidth;
            container.style.whiteSpace = "nowrap";
            container.style.backgroundRepeat = "no-repeat";
            container.style.backgroundPosition = "bottom";
            container.style.backgroundSize = "100% auto";
            innovaphone.lib.makeUnselectable(container);

            container.appendChild(item);

            // events
            container.addEventListener("mouseup", function () {
                if (inputTemp) {
                    inputTemp.setOnChange(null);
                }
                userSelect(value);
            });
            container.addEventListener("mouseenter", itemMouseEnter);

            // public interface
            this.container = container;
            this.value = value;
            this.text = theText;
        }

        activator.addEventListener("mousedown", show);

        // public interface
        this.container = container;
        this.focus = activator.focus;

        this.addItem = function (value, item, sortText) {
            var result = new Item(null, this, value, item, minWidth);
            scroll.appendContent(result.container);
            items.push(result);
            return result;
        }

        this.findItem = function (value) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].value == value) return items[i];
            }
            return null;
        }

        this.removeItem = function (value) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].value == value) {
                    scroll.removeContent(items[i].container);
                    items.splice(i, 1);
                    break;
                }
            }
        }

        this.clear = function () {
            updateInfo(null, null);
            selectedValue = null;
            scroll.clearContent();
            items = [];
        }

        // sorts the items by string, ascending
        this.sort = function () {
            scroll.clearContent();
            items.sort(function (a, b) {
                var aText = a.text.toLowerCase();
                var bText = b.text.toLowerCase();
                if (aText > bText) return 1;
                if (aText < bText) return -1;
                return 0;
            });
            for (var i = 0; i < items.length; i++) {
                scroll.appendContent(items[i].container);
            }
        }

        this.select = select;

        this.selectIndex = function (index) {
            if (items.length > index) {
                select(items[index].value);
            }
        }

        this.selected = function () {
            return selectedValue;
        }

        this.isNewElement = function () {
            return newElement;
        }

        this.setCallback = function (funcCallback) {
            callback = funcCallback;
        }

        this.setActivateCallback = function (funcActivateCallback) {
            activateCallback = funcActivateCallback;
        }

        this.setDeactivateCallback = function (funcDeactivateCallback) {
            deactivateCallback = funcDeactivateCallback;
        }
    }
    return DropDown;
}());