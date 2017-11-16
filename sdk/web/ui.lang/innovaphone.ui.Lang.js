/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.dropdown/innovaphone.ui.DropDown.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.LangResources = innovaphone.ui.LangResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.dropdown/innovaphone.ui.DropDown"], function () {
        innovaphone.ui.LangResourcesLoaded = true;
        onload();
    });
};

innovaphone.ui.Lang = innovaphone.ui.Lang || (function () {
    function Lang(container) {
        var dropDown = new innovaphone.ui.DropDown(container, 135, false, false);
        dropDown.setCallback(innovaphone.lib.changeLanguage);
        var languages = innovaphone.lib.getLanguages();
        for (var i = 0; i < languages.length; i++) {
            dropDown.addItem(languages[i].short, languages[i].name);
        }

        dropDown.sort();
        dropDown.select(innovaphone.lib.getActiveLanguage());

        // public interface
        this.container = dropDown.container;
    }

    return Lang;
}());