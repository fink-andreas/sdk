/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.popup/innovaphone.ui.Popup.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.WizardResources = innovaphone.ui.WizardResources || function () {
    innovaphone.lib.loadObjectScripts(["web/ui.popup/innovaphone.ui.Popup"], function () {
        innovaphone.ui.WizardResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.Wizard = innovaphone.ui.Wizard || (function () {
    function Wizard(container, headText, columnCount, width, height, funcOnFinish, textNext, textPrevious, textFinish) {
        var pages = [],
            currentPage = 0,
            pageOrder = [];

        container = container ? container : document.body;

        function showPage(pageNumber) {
            pages[currentPage].hide();
            pages[pageNumber].show();
            if (pageNumber > currentPage) {
                pageOrder.push(currentPage);
            }
            currentPage = pageNumber;
        }

        function previousPage() {
            showPage(pageOrder.pop());
        }

        function close(pageNumber) {
            for (var i = 0; i < pages.length; i++) {
                if (pageNumber == undefined || i != pageNumber) {
                    pages[i].close();
                }
            }
        }

        // public interface
        this.close = close;
        this.showPage = showPage;

        this.addPage = function (pageHeadText, lastPage, funcOnNext) {
            var popup = new innovaphone.ui.Popup(container, headText, columnCount, width, height, pageHeadText);
            var page = pages.length;
            popup.setOnClose(function () { close(page); });
            var nextPage = 0;
            // determine buttons
            if (lastPage && pages.length == 0) {    // just one wizard page
                popup.addButton(textFinish, function () { if (funcOnFinish()) { close(); } }, true);
            }
            else if (lastPage) {
                popup.addButton(textPrevious, function () { previousPage(); });
                popup.addButton(textFinish, function () { if (funcOnFinish()) { close(); } }, true);
            }
            else if (pages.length == 0) {
                nextPage = 1;
            }
            else {
                nextPage = page + 1;
                popup.addButton(textPrevious, function () { previousPage(); });
            }
            if (nextPage > 0) {
                var funcNext = function () {
                    if (funcOnNext) {
                        if (funcOnNext()) {         // if there is a funcOnNext and it returns true, the next page is shown
                            showPage(nextPage);
                        }
                    }
                    else {
                        showPage(nextPage);
                    }
                }
                popup.addButton(textNext, funcNext, true);
            }
            popup.hide();
            pages.push(popup);
            if (lastPage) {
                showPage(0);
            }
            return popup;
        }
    } return Wizard;
}());