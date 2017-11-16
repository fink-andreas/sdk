/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Hider = innovaphone.ui.Hider || (function () {
    function Hider(container, caption, funcClickOnCaption) {
        var captionOuter = document.createElement("div"),
            captionText = document.createElement("div"),
            hider = document.createElement("div"),
            separator = document.createElement("div"),
            content = document.createElement("div"),
            hiddenWidth = "45px",
            onShow = null,
            onHide = null;

        if (!container) container = document.createElement("div");
        
        container.style.position = "absolute";
        container.style.left = 0;
        container.style.right = 0;
        container.style.top = 0;
        container.style.bottom = 0;

        captionOuter.style.position = "absolute";
        captionOuter.style.left = 0;
        captionOuter.style.right = 0;
        captionOuter.style.top = 0;

        captionText.style.position = "relative";
        captionText.style.whiteSpace = "nowrap";
        captionText.style.marginTop = "5px";
        innovaphone.lib.addClass(captionText, "ijs-hider-caption");

        hider.style.backgroundPosition = "center center";
        hider.style.backgroundRepeat = "no-repeat";
        hider.style.borderStyle = "solid";
        hider.style.borderWidth = "1px";
        hider.style.cursor = "pointer";
        hider.style.cssFloat = "right";
        hider.style.height = "8px";
        hider.style.width = "9px";
        hider.style.padding = "5px";
        hider.style.position = "absolute";
        hider.style.right = 0;
        hider.style.top = 0;
        innovaphone.lib.addClass(hider, "ijs-hider-hide");
        
        separator.style.backgroundSize = "100% auto";
        separator.style.height = "1px";
        separator.style.left = 0;
        separator.style.right = 0;
        separator.style.top = "40px";
        separator.style.position = "absolute";
        innovaphone.lib.addClass(separator, "ijs-hider-separator");
        
        content.style.position = "absolute";
        content.style.left = 0;
        content.style.right = 0;
        content.style.top = "50px";
        content.style.bottom = 0;

        captionOuter.appendChild(captionText);
        captionOuter.appendChild(hider);
        container.appendChild(captionOuter);
        container.appendChild(separator);
        container.appendChild(content);

        function hide() {
            var width = captionText.clientWidth;
            hider.removeEventListener("click", hide);
            hider.addEventListener("click", show)
            separator.style.display = "none";
            content.style.display = "none";
            captionOuter.style.width = hiddenWidth;
            captionOuter.style.height = "";
            captionOuter.style.bottom = 0;
            captionText.style.display = "block";
            captionText.style.marginLeft = "0px";
            captionText.style.position = "relative";
            captionText.style.top = width + "px";
            captionText.style.fontSize = "19px";
            captionText.style.transform = "rotate(-90deg)";
            captionText.style.webkitTransform = "rotate(-90deg)";
            hider.style.transform = "rotate(-180deg)";
            hider.style.webkitTransform = "rotate(-180deg)";
            if (onHide) {
                onHide();
            }
        }

        function show() {
            hider.removeEventListener("click", show);
            hider.addEventListener("click", hide)
            separator.style.display = "block";
            content.style.display = "block";
            captionOuter.style.width = "";
            captionOuter.style.height = "30px";
            captionText.style.display = "inline-block";
            captionText.style.marginLeft = "15px";
            captionText.style.top = "";
            captionText.style.fontSize = "21px";
            captionText.style.transform = "";
            captionText.style.webkitTransform = "";
            hider.style.transform = "";
            hider.style.webkitTransform = "";
            if (onShow) {
                onShow();
            }
        }

        // public interface
        this.container = container;
        this.hiddenWidth = hiddenWidth;
        this.content = content;
        
        this.setCaption = function (caption, funcClickOnCaption) {
            captionText.innerHTML = caption;
            if (funcClickOnCaption) {
                captionText.onclick = funcClickOnCaption;
                captionText.style.cursor = "pointer";
            }
            else {
                captionText.onclick = null;
                captionText.style.cursor = "";
            }
        }

        this.setOnShow = function (funcOnShow) {
            onShow = funcOnShow;
        }

        this.setOnHide = function (funcOnHide) {
            onHide = funcOnHide;
        }

        this.setCaption(caption, funcClickOnCaption);
        show();
    } return Hider;
}());