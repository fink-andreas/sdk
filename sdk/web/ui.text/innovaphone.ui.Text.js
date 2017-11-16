/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Text = innovaphone.ui.Text || (function () {
    function Text(text, left, top, parent, width, height) {
        var container = document.createElement("span");
        setText(text);
        if (left != undefined || top != undefined) {
            container.style.position = "absolute";
            if (left != undefined) container.style.left = left + "px";
            if (top != undefined) container.style.top = top + "px";
        }
        if (width || height) {
            container.style.width = width + "px";
            container.style.height = height + "px";
        }
        if (parent != undefined) {
            parent.appendChild(container);
        }

        function setText(text) {
            if (text == undefined) return;
            container.innerHTML = text;
        }

        // public interface
        this.container = container;

        this.setText = setText;

        this.show = function () {
            container.style.display = "";
        }

        this.hide = function () {
            container.style.display = "none";
        }

        this.setFontBold = function () {
            container.style.fontWeight = "bold";
        }

        this.setFontNormal = function () {
            container.style.fontWeight = "";
        }

        this.setLeft = function () {
            container.style.textAlign = "left";
        }

        this.setCenter = function () {
            container.style.textAlign = "center";
        }

        this.setRight = function () {
            container.style.textAlign = "right";
        }

        this.getText = function () {
            return container.innerHTML;
        }

        this.setOnClick = function (funcOnClick) {
            container.onclick = funcOnClick;
            container.style.cursor = "pointer";
        }

        this.setOnDblClick = function (funcOnDblClick) {
            container.ondblclick = funcOnDblClick;
            container.style.cursor = "pointer";
        }

        this.setTitle = function (title) {
            container.title = title;
        }
    } return Text;
}());