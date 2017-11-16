/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.AppTabs = innovaphone.ui.AppTabs || function (container, storageId) {
    var instance = this,
        outer = document.createElement("div"),
        left = document.createElement("div"),
        right = document.createElement("div"),
        active = 0,
        tabs = [],
        content = [];

    innovaphone.lib.addClass(outer, "ijs-menu-bar");
    outer.style.borderBottomWidth = "1px";
    outer.style.borderBottomStyle = "solid";
    outer.style.height = "32px";
    outer.style.position = "relative";
    outer.style.whiteSpace = "nowrap";
    container.appendChild(outer);

    left.style.left = "0";
    left.style.right = "auto";
    left.style.display = "inline-block";
    left.style.top = "0";
    left.style.position = "absolute";
    left.style.whiteSpace = "nowrap";
    left.style.bottom = "auto";
    outer.appendChild(left);

    right.style.left = "auto";
    right.style.right = "0";
    right.style.display = "inline-block";
    right.style.top = "0";
    right.style.position = "absolute";
    right.style.whiteSpace = "nowrap";
    right.style.bottom = "auto";
    outer.appendChild(right);

    function createTabElement() {
        var div = document.createElement("div");
        div.style.display = "inline-block";
        div.style.whiteSpace = "nowrap";
        div.style.height = "22px";
        div.style.lineHeight = "1";
        div.style.paddingLeft = "15px";
        div.style.paddingRight = "15px";
        return div;
    }

    function AppTab(index, text, onInit, obj) {
        this.text = text;
        this.obj = obj;
        this.div = createTabElement();
        innovaphone.lib.addClass(this.div, "ijs-menu-normal");
        this.div.style.fontSize = "13px";
        this.div.style.cursor = "pointer";
        this.div.style.paddingTop = "11px";
        this.div.style.textAlign = "center";
        this.div.style.verticalAlign = "top";
        this.div.style.backgroundRepeat = "no-repeat";
        this.div.style.backgroundSize = "100% 100%";
        this.div.style.borderBottomWidth = "1px";
        this.div.style.borderBottomStyle = "solid";
        this.div.addEventListener('click', function () { click(index); });
        this.div.textContent = text;
        left.appendChild(this.div);

        this.init = false;
        this.onInit = onInit;
    }

    function Ctrl(element) {
        var div = createTabElement();
        div.style.cursor = "pointer";
        div.style.paddingTop = "11px";
        div.appendChild(element);
        innovaphone.lib.addClass(div, "ijs-menu-normal");
        right.appendChild(div);
    }

    function click(newActive) {
        innovaphone.lib.removeClass(tabs[active].div, "ijs-menu-selected");
        innovaphone.lib.addClass(tabs[active].div, "ijs-menu-normal");
        content[active].style.display = "none";

        active = newActive;
        content[active].style.display = "block";
        innovaphone.lib.addClass(tabs[active].div, "ijs-menu-selected");
        innovaphone.lib.removeClass(tabs[active].div, "ijs-menu-normal");

        innovaphone.lib.fireEvent(window, "resize");
        if (storageId) localStorage[storageId] = tabs[active].text;
        if (!tabs[active].init) {
            tabs[active].onInit(content[active], tabs[active].obj);
            tabs[active].init = true;
        }
    }

    // public interface
    this.container = container;

    this.addApp = function (name, onInit, obj) {
        var n = tabs.length;
        tabs[n] = new AppTab(n, name, onInit, obj);

        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.top = "33px";
        div.style.left = "0";
        div.style.right = "0";
        div.style.bottom = "0";
        div.style.display = "none";

        content[n] = div;
        container.appendChild(content[n]);
    }

    this.addRight = function (element) {
        var r = new Ctrl(element);
    }

    this.addRightDropDown = function (element) {
        element.style.display = "block";
        element.style.position = "relative";
        element.style.marginTop = "4px";
        this.addRight(element);
    }

    // image must have a size of 25x11px
    this.addRightLogo = function (imageUrl) {
        var logo = document.createElement("div");
        logo.style.backgroundImage = "url(\"" + imageUrl + "\")";
        logo.style.backgroundRepeat = "no-repeat";
        logo.style.width = "25px";
        logo.style.height = "11px";
        logo.style.marginTop = "10px";
        this.addRight(logo);
    }

    this.show = function () {
        if (storageId) {
            var a = localStorage[storageId];
            if (a) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].text == a) {
                        active = i;
                        break;
                    }
                }
            }
            click(active);
        }
    }

    this.focus = function (text) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].text == text) {
                click(i);
                return true;
            }
        }
        return false;
    }
};