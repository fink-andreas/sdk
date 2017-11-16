/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.IFrame = innovaphone.ui.IFrame || (function () {
    function IFrame(container, src, name) {
        if (!container) container = document.createElement("span");
        
        var iFrame = document.createElement("iframe");
        iFrame.src = src;
        iFrame.name = name;
        iFrame.style.width = "100%";
        iFrame.style.height = "100%";
        iFrame.style.border = "none";
        container.appendChild(iFrame);

        // public interface
        this.container = container;

        this.open = function (html) {
            window.open(html, iFrame.name);
        }

    } return IFrame;
}());