/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.SplitPanel = innovaphone.ui.SplitPanel || (function () {
    function SplitPanel(container, storageId, width) {

        var instance = this,
            left = document.createElement("div"),
            splitter = document.createElement("div"),
            splitterText = document.createElement("div"),
            right = document.createElement("div"),
            grabber = document.createElement("div"),
            eventStart = (innovaphone.lib.isTouch ? "touchstart" : "mousedown"),
            eventStop = (innovaphone.lib.isTouch ? "touchend" : "mouseup"),
            eventMove = (innovaphone.lib.isTouch ? "touchmove" : "mousemove"),
            start = false,
            lastWidth = 0,
            minLeftWidth = 30;

        left.style.position = "absolute";
        left.style.top = 0;
        left.style.bottom = 0;
        left.style.left = 0;
        innovaphone.lib.addClass(left, "ijs-panel-left");
        container.appendChild(left);

        splitter.style.borderStyle = "solid";
        splitter.style.borderWidth = "1px";
        splitter.style.position = "absolute";
        splitter.style.top = 0;
        splitter.style.bottom = 0;
        splitter.style.display = "table";
        splitter.style.height = "100%";
        splitter.style.marginLeft = "5px";
        innovaphone.lib.addClass(splitter, "ijs-splitter");
        container.appendChild(splitter);

        splitterText.style.display = "table-cell";
        splitterText.style.verticalAlign = "middle";
        splitterText.style.wordWrap = "break-word";
        splitterText.style.position = "relative";
        splitterText.style.width = "4px";
        splitterText.style.minWidth = "4px";
        splitterText.style.maxWidth = "4px";
        splitterText.style.cursor = "col-resize";
        splitterText.style.lineHeight = "0.4";
        splitterText.style.fontWeight = "bold";
        innovaphone.lib.addClass(splitterText, "ijs-splitter-text");
        splitterText.innerHTML = ".<br/>.<br/>.<br/>.<br/>.<br/>.<br/>.";

        grabber.style.position = "absolute";
        grabber.style.top = 0;
        grabber.style.bottom = 0;
        if (innovaphone.lib.isTouch) {
            grabber.style.left = "-5px";
            grabber.style.width = "15px";
        }
        else {
            grabber.style.left = "0px";
            grabber.style.width = "4px";
        }
        grabber.style.zIndex = 1;
        grabber.style.cursor = "col-resize";
        grabber.style.backgroundColor = "transparent";


        splitter.appendChild(splitterText);
        splitter.appendChild(grabber);

        right.style.position = "absolute";
        right.style.top = 0;
        right.style.bottom = 0;
        right.style.right = 0;
        innovaphone.lib.addClass(right, "ijs-panel-right");
        container.appendChild(right);

        function mouseDown(event) {
            start = true;
            container.style.cursor = "col-resize";
            window.addEventListener(eventStop, mouseUp);
            window.addEventListener(eventMove, mouseMove);
            event.preventDefault();
            event.stopPropagation();
        }

        function mouseMove(event) {
            var x = 0;
            if (innovaphone.lib.isTouch) {
                x = event.changedTouches[0].pageX;
            }
            else {
                x = event.pageX || event.screenX;
            }
            x -= container.getBoundingClientRect().left;
            redraw(x);
            event.preventDefault();
            event.stopPropagation();
        }

        function mouseUp(event) {
            if (start) {
                container.style.cursor = 'default';
                start = false;
                lastWidth = left.offsetWidth;
                if (storageId) localStorage[storageId] = lastWidth;
                event.preventDefault();
                event.stopPropagation();
            }
            window.removeEventListener(eventStop, mouseUp);
            window.removeEventListener(eventMove, mouseMove);
        }

        function resize(event) {
            redraw(lastWidth);
        }

        function redraw(fixLeftWidth) {
            if (container.offsetWidth == 0) {   // currently not visible
                return;
            }
            if (!innovaphone.lib.isInt(fixLeftWidth)) {
                fixLeftWidth = parseInt(fixLeftWidth);
            }
            if (fixLeftWidth < minLeftWidth) fixLeftWidth = minLeftWidth;
            if (fixLeftWidth > (container.offsetWidth - minLeftWidth)) {
                fixLeftWidth = container.offsetWidth - minLeftWidth;
            }
            var addLeft = (fixLeftWidth ? fixLeftWidth : left.offsetWidth) - parseInt(splitter.style.marginLeft);
            splitter.style.left = left.offsetLeft + addLeft + 'px';
            right.style.left = splitter.offsetLeft + splitter.offsetWidth + 'px';
            left.style.right = splitter.offsetWidth + right.offsetWidth + 'px';
            lastWidth = left.offsetWidth;
        }

        splitter.addEventListener(eventStart, mouseDown);
        grabber.addEventListener(eventStart, mouseDown);
        window.addEventListener("resize", resize);

        if (storageId && localStorage[storageId]) {
            width = localStorage[storageId];
        }
        redraw(width);

        // public interface
        this.getLeft = function () { return left; };
        this.getRight = function () { return right; };
        this.cleanupLeft = function () { while (left.childNodes.length) left.removeChild(left.firstChild) };
        this.cleanupRight = function () { while (right.childNodes.length) right.removeChild(right.firstChild) };
        this.redraw = redraw;
        this.getLastWidth = function () { return lastWidth; };
        this.innerSplitPanel = function () {
            innovaphone.lib.removeClass(left, "ijs-panel-left");
            innovaphone.lib.addClass(left, "ijs-panel-right");
        }
    } return SplitPanel;
}());