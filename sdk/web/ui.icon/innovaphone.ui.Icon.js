/// <reference path="../lib/innovaphone.lib.js" />

innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Icon = innovaphone.ui.Icon || (function () {
    function Icon(container, iconUrl, iconPosX, iconPosY, width, height, left, top) {
        var onClickFnc = null,
            onMouseEnterFnc = null,
            onMouseLeaveFnc = null,
            onMouseDownFnc = null,
            onMouseUpFnc = null,

            onClickObj = null,
            onMouseEnterObj = null,
            onMouseLeaveObj = null,
            onMouseDownObj = null,
            onMouseUpObj = null;

        if (!container) {
            container = document.createElement("span");
        }
        var icon = icon = document.createElement("div");

        width = (width) ? width  + "px" : "20px",
        height = (height) ? height + "px" : "20px",
        iconPosX  = (iconPosX) ? iconPosX + "px" : "0px",
        iconPosY = (iconPosY) ? iconPosY + "px" : "0px",

        icon.style.backgroundImage = "url('" + iconUrl + "')";
        icon.style.backgroundRepeat = "no-repeat";
        icon.style.width = width;
        icon.style.height = height;
        icon.style.overflow = "hidden";
        icon.style.backgroundPosition = iconPosX + " " + iconPosY;
        icon.style.margin = "auto";
        if (left || top) {
            icon.style.position = "absolute";
            icon.style.left = left + "px";
            icon.style.top = top + "px";
        }
        innovaphone.lib.setNoSelect(icon);

        container.appendChild(icon);
        
        function onClick(event) {
            if (onClickFnc)
                onClickFnc(onClickObj, event);
        }

        function onMouseDown(event) {
            if (onMouseDownFnc)
                onMouseDownFnc(onMouseDownObj, event);
        }

        function onMouseUp(event) {
            if (onMouseUpFnc)
                onMouseUpFnc(onMouseUpObj, event);
        }

        function onMouseEnter(event) {
            if (onMouseEnterFnc)
                onMouseEnterFnc(onMouseEnterObj, event);
        }

        function onMouseLeave(event) {
            if (onMouseLeaveFnc)
                onMouseLeaveFnc(onMouseLeaveObj, event);
        }

        // public interface
        this.container = container;
        this.icon = icon;

        this.setWidth = function (width) {
            icon.style.width = width + "px";
        }

        this.setHeight = function (height) {
            icon.style.height = height + "px";
        }

        this.addSpriteClass = function (className) {
            icon.style.backgroundPosition = "var(--bgX) " + iconPosY;
            innovaphone.lib.addClass(icon, className);
        }

        this.setTitle = function (title) {
            icon.title = title;
        }

        this.setURL = function (url) {
            icon.style.backgroundImage = "url('" + url + "')";
            container.appendChild(icon);
        }

        this.show = function () {
            icon.style.display = "";
        }

        this.hide = function () {
            icon.style.display = "none";
        }

        this.setOnClick = function (clickFnc, obj) {
            icon.style.cursor = "pointer";
            onClickFnc = clickFnc;
            onClickObj = obj;
            icon.addEventListener("click", onClick);
        }

        this.setOnMouseDown = function (mouseDownFnc, obj) {
            onMouseDownFnc = mouseDownFnc;
            onMouseDownObj = obj;
            icon.addEventListener("mousedown", onMouseDown);
        }

        this.setOnMouseUp = function (mouseUpFnc, obj) {
            onMouseUpFnc = mouseUpFnc;
            onMouseUpObj = obj;
            icon.addEventListener("mouseup", onMouseUp);
        }
        this.setOnMouseEnter = function (mouseEnterFnc, obj) {
            onMouseEnterFnc = mouseEnterFnc;
            onMouseEnterObj = obj;
            icon.addEventListener("mouseenter", onMouseEnter);
        }

        this.setOnMouseLeave = function (mouseLeaveFnc, obj) {
            onMouseLeaveFnc = mouseLeaveFnc;
            onMouseLeaveObj = obj;
            icon.addEventListener("mouseleave", onMouseLeave);
        }

    }  return Icon;
}());