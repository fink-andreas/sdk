/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.popup/innovaphone.ui.Popup.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.EditPopupResources = innovaphone.ui.EditPopupResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.popup/innovaphone.ui.Popup"], function () {
        innovaphone.ui.EditPopupResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.EditPopup = innovaphone.ui.EditPopup || (function () {
    function EditPopup(container, headText, columnCount, width, height, textOk, textCancel, funcOk, funcCancel) {
        var popup = new innovaphone.ui.Popup(container, headText, columnCount, width, height),
            popupFuncOk = function () { if (funcOk()) { popup.close(); } },
            popupFuncCancel = function () { if (funcCancel) { funcCancel(); }; popup.close(); };

        popup.addButton(textOk, popupFuncOk, true);
        popup.addButton(textCancel, popupFuncCancel, false, true);
        
        // public interface
        this.close = popup.close;
        this.addElement = popup.addElement;
        this.adjustColumnWidth = popup.adjustColumnWidth;
        this.setOnClose = popup.setOnClose;
        this.content = popup.content;
        this.resize = popup.resize;

    } return EditPopup;
}());