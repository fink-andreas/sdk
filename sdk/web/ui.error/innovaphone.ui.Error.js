/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.popup/innovaphone.ui.Popup.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ErrorResources = innovaphone.ui.ErrorResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.popup/innovaphone.ui.Popup"], function () {
        innovaphone.ui.ErrorResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.Error = innovaphone.ui.Error || (function () {
    function Error() {
        var instance = this;
        var activeElement = null;

        // public interface
        this.showError = function (errorMsg, errorCode) {
            var errorOuter = document.createElement("div"),
                errorInner = document.createElement("div"),
                errorImg = document.createElement("div"),
                errorText = document.createElement("div");

            errorOuter.style.display = "table";
            errorOuter.style.position = "relative";
            errorOuter.style.height = "150px";

            errorInner.style.display = "table-cell";
            errorInner.style.paddingLeft = "20px";
            errorInner.style.position = "relative";
            errorInner.style.textAlign = "left";
            errorInner.style.verticalAlign = "middle";

            errorImg.style.backgroundRepeat = "none";
            errorImg.style.display = "inline-block";
            errorImg.style.height = "30px";
            errorImg.style.position = "relative";
            errorImg.style.verticalAlign = "middle";
            errorImg.style.width = "30px";
            innovaphone.lib.addClass(errorImg, "ijs-error-img");

            errorText.style.display = "inline-block";
            errorText.style.fontSize = "15px";
            errorText.style.lineHeight = "1";
            errorText.style.marginLeft = "10px";
            errorText.style.maxWidth = "210px";
            errorText.style.position = "relative";
            errorText.style.verticalAlign = "middle";
            errorText.style.whiteSpace = "normal";
            errorText.style.wordWrap = "break-word";
            errorText.innerHTML = errorMsg + "<br>(0x" + errorCode.toString(16) + ")";
            innovaphone.lib.addClass(errorText, "ijs-error-text");

            errorInner.appendChild(errorImg);
            errorInner.appendChild(errorText);
            errorOuter.appendChild(errorInner);
            var popup = new innovaphone.ui.Popup(null, "", 1, 300, 200);

            popup.addElement(errorOuter);
            if (document.activeElement) {
                activeElement = document.activeElement;
                document.activeElement.blur();  // remove focus from active element to prevent 
                popup.setOnClose(function () {
                    activeElement.focus();
                    activeElement = null;
                });
            }
            popup.resize();
        }
    }
    return new Error();
}());