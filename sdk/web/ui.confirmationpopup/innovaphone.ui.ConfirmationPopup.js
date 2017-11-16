/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.popup/innovaphone.ui.Popup.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ConfirmationPopupResources = innovaphone.ui.ConfirmationPopupResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.popup/innovaphone.ui.Popup"], function () {
        innovaphone.ui.ConfirmationPopupResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.ConfirmationPopup = innovaphone.ui.ConfirmationPopup || (function () {
    function ConfirmationPopup(container, textQuestion, textYes, textNo, funcYes, funcNo) {
        var popup = new innovaphone.ui.Popup(container, "", 1, 550, 250),
            popupFuncYes = function () { if (funcYes()) { popup.close(); } },
            popupFuncNo = function () { if (funcNo) { funcNo(); }; popup.close(); },
            divOuter = document.createElement("div"),
            divInner = document.createElement("div"),
            divImg = document.createElement("div"),
            divText = document.createElement("div");

        divOuter.style.display = "table";
        divOuter.style.height = "180px";

        divInner.style.display = "table-cell";
        divInner.style.textAlign = "left";
        divInner.style.verticalAlign = "middle";
        divInner.style.paddingLeft = "20px";

        divImg.style.display = "inline-block";
        divImg.style.backgroundRepeat = "no-repeat";
        divImg.style.verticalAlign = "middle";
        divImg.style.height = "45px";
        divImg.style.width = "51px";
        innovaphone.lib.addClass(divImg, "ijs-confirmation-popup-img");

        divText.style.display = "inline-block";
        divText.style.fontSize = "15px";
        divText.style.lineHeight = "1";
        divText.style.marginLeft = "10px";
        divText.style.maxWidth = "450px";
        divText.style.verticalAlign = "middle";
        divText.style.whiteSpace = "normal";
        divText.style.wordWrap = "break-word";
        divText.innerHTML = textQuestion;

        divInner.appendChild(divImg);
        divInner.appendChild(divText);
        divOuter.appendChild(divInner);

        popup.addElement(divOuter);

        popup.addButton(textYes, popupFuncYes, true, false);
        popup.addButton(textNo, popupFuncNo, false, true);

        // public interface
        this.close = popup.close;

    } return ConfirmationPopup;
}());