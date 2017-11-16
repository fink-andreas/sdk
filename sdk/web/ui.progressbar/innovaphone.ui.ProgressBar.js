/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ProgressBar = innovaphone.ui.ProgressBar || (function () {
    function ProgressBar(width) {
        var instance = this,
            container = document.createElement("div"),
            bar = document.createElement("div"),
            barProgress = document.createElement("div"),
            barText = document.createElement("div");

        if (!width) {
            width = 200;
        }
        bar.style.width = width + "px";
        bar.style.borderStyle = "solid";
        bar.style.borderWidth = "1px";
        bar.style.height = "20px";
        barProgress.style.height = "100%";
        barProgress.style.width = 0;
        innovaphone.lib.addClass(barProgress, "ijs-progress-bar");
        barText.style.position = "absolute";
        barText.style.top = "0px";
        barText.style.left = ((width / 2) - 4) + "px";

        bar.appendChild(barProgress);
        bar.appendChild(barText);
        container.appendChild(bar);

        this.container = container;

        this.update = function (percent) {
            barProgress.style.width = percent + "%";
            barText.innerText = Math.ceil(percent) + "%";
        }

	this.show = function () {
            container.style.display = "";
        }

        this.hide = function () {
            container.style.display = "none";
        }

        this.update(0);
    }
    return ProgressBar;
}());
