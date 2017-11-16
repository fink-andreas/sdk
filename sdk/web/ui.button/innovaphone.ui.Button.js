/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Button = innovaphone.ui.Button || (function () {
    function Button(container, text, funcOnClick, left, top, obj) {
        var instance = this;
        this.obj = obj;
        if (!container) {
            container = document.createElement("span");
        }

        var button = document.createElement("button");
        if (left != undefined || top != undefined) {
            button.style.position = "absolute";
            if (left != undefined) button.style.left = left + "px";
            if (top != undefined) button.style.top = top + "px";
        }
        button.innerHTML = text;
        button.style.height = "24px";
        button.style.minWidth = "65px";
        button.style.borderWidth = "1px";
        button.style.borderStyle = "solid";
        innovaphone.lib.addClass(button, "ijs-button");
        button.addEventListener("click", onclick);
        container.appendChild(button);

        function onclick() {
            if (funcOnClick) funcOnClick(instance);
        }

        // public interface
        this.container = container;

        this.click = function () {
            button.click();
        }

        this.getButtonElement = function () {
            return button;
        }

        this.setText = function (text) {
            button.innerHTML = text;
        }

        this.disable = function () {
            button.disabled = true;
        }

        this.enable = function () {
            button.disabled = false;
        }
    } return Button;
}());