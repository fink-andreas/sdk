/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Anchor = innovaphone.ui.Anchor || (function () {
    function Anchor(container, url, text, width, height, left, top, parent) {
        var instance = this;
        if (!container) {
            container = document.createElement("span");
        }

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

        var anchor = document.createElement("a");
        anchor.style.position = "relative";
        anchor.style.display = "inline-block";

        text = (text) ? text : url;
        height = (height) ? height : 20;
        anchor.href = url;
        anchor.textContent = text;
        anchor.style.height = height + "px";
        anchor.style.maxHeight = anchor.style.height;
        if (width) {
            anchor.style.width = width + "px";
        }
        anchor.style.color = "#fdb901";
        anchor.style.textDecoration = "none";
        anchor.style.maxWidth = anchor.style.width;
        anchor.style.overflow = "hidden";
        anchor.style.textOverflow = "ellipsis";
        anchor.target = "_blank";
        anchor.title = url;
        anchor.value = url;
        innovaphone.lib.addClass(anchor, "ijs-anchor");
        container.appendChild(anchor);

        // public interface
        this.container = container;

        this.getUrl = function () {
            return anchor.href;
        }

        this.value = function () {
            return anchor.value;
        }

        this.setUrl = function (url) {
            anchor.href = url;
        }

        this.setTitle = function (title) {
            anchor.title = title;
        }

        this.setTarget = function (target) {
            anchor.target = target;
        }

        this.setOnClick = function (onClick) {
            anchor.onclick = onClick;
        }
    } return Anchor;
}());