/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ContentHeader = innovaphone.ui.ContentHeader || (function () {
    function ContentHeader(container, title) {
        container = (container ? container : document.createElement("div"));

        var titleOuter = document.createElement("div"),
            titleInner = document.createElement("div"),
            content = document.createElement("div");

        titleOuter.style.height = "40px";
        titleOuter.style.paddingLeft = "10px";
        titleOuter.style.display = "table";
        titleOuter.style.position = "absolute";
        titleOuter.style.top = 0;
        titleOuter.style.width = "100%";
        innovaphone.lib.addClass(titleOuter, "ijs-content-header");

        titleInner.style.whiteSpace = "nowrap";
        titleInner.style.display = "table-cell";
        titleInner.style.verticalAlign = "middle";
        titleInner.style.fontSize = "17px";
        //titleInner.style.fontWeight = "bold"; (jsc)

        content.style.position = "absolute";
        content.style.top = "40px";
        content.style.bottom = 0;
        content.style.left = 0;
        content.style.right = 0;

        titleOuter.appendChild(titleInner);
        container.appendChild(titleOuter);
        container.appendChild(content);

        function setTitle(text) {
            titleInner.innerHTML = text;
        }

        setTitle(title);

        // public interface
        this.container = container;
        this.content = content;

        this.appendContent = function (element) {
            content.appendChild(element);
        }

        this.clearContent = function () {
            content.innerHTML = "";
        }

        this.setTitle = setTitle;
    } return ContentHeader;
}());