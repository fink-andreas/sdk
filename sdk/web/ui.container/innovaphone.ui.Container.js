/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Container = innovaphone.ui.Container || (function () {
    function Container(left, top, width, height, parent, content) {
        var container = document.createElement("div");
        var setOnMouseEnter;
        var setOnMouseEnterObj;
        var setOnMouseLeave;
        var setOnMouseLeaveObj;
        var setOnClick;
        var setObj;

        if (left == undefined && top == undefined) {
            container.style.position = "relative";
        }
        else {
            container.style.position = "absolute";
            if (left != undefined) container.style.left = left + "px";
            if (top != undefined) container.style.top = top + "px";
        }
        if (width) {
            if (width == -1) container.style.width = "100%";
            else container.style.width = width + "px";
        }
        if (height) {
            if (height == -1) container.style.height = "100%";
            else container.style.height = height + "px";
        }
        container.style.overflow = "hidden";
        if (parent) parent.appendChild(container);
        if (content) container.appendChild(typeof content == 'string' ? document.createTextNode(content) : content);

        function onmouseenter() {
            if (setOnMouseEnter) setOnMouseEnter(setOnMouseEnterObj);
        }

        function onmouseleave() {
            if (setOnMouseLeave) setOnMouseLeave(setOnMouseLeaveObj);
        }

        function onclick() {
            if (setOnClick) setOnClick(setObj);
        }

        // public interface
        this.container = container;
        this.setContent = function (content) {
            while (container.hasChildNodes()) container.removeChild(container.firstChild);
            if (content) container.appendChild(typeof content == 'string' ? document.createTextNode(content) : content);
        }

        this.show = function () {
            container.style.display = "";
        }

        this.hide = function () {
            container.style.display = "none";
        }

        this.setBorder = function (borderWidth) {
            if (!borderWidth) borderWidth = 1;
            this.container.style.border = "solid";
            this.container.style.borderWidth = borderWidth + "px";
            innovaphone.lib.addClass(this.container, "ijs-container-border");
        }

        this.setBorderWidth = function (left, top, right, buttom) {
            this.container.style.borderLeftWidth = left + "px";
            this.container.style.borderTopWidth = top + "px";
            this.container.style.borderRightWidth = right + "px";
            this.container.style.borderBottomWidth = buttom + "px";
        }

        this.setOnMouseEnter = function (funcOnMouseEnter, obj) {
            container.addEventListener("mouseenter", onmouseenter);
            setOnMouseEnter = funcOnMouseEnter;
            setOnMouseEnterObj = obj;
        }

        this.setOnMouseLeave = function (funcOnMouseLeave, obj) {
            container.addEventListener("mouseleave", onmouseleave);
            setOnMouseLeave = funcOnMouseLeave;
            setOnMouseLeaveObj = obj;
        }

        this.setOnClick = function (funcOnClick, obj) {
            container.style.cursor = "pointer";
            container.addEventListener("click", onclick);
            setOnClick = funcOnClick;
            setObj = obj;
        }

        this.addElement = function (element) {
            container.appendChild(element);
        }

    } return Container;
}());