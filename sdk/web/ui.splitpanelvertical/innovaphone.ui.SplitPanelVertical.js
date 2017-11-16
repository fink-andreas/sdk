/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.SplitPanelVertical = innovaphone.ui.SplitPanelVertical || (function () {
    function SplitPanelVertical(container, storageId, height) {

        var instance = this,
            top = document.createElement("div"),
            splitter = document.createElement("div"),
            splitterText = document.createElement("div"),
            down = document.createElement("div"),
            grabber = document.createElement("div"),
            eventStart = (innovaphone.lib.isTouch ? "touchstart" : "mousedown"),
            eventStop = (innovaphone.lib.isTouch ? "touchend" : "mouseup"),
            eventMove = (innovaphone.lib.isTouch ? "touchmove" : "mousemove"),
            start = false,
            lastHeight = 0,
            minTopHeight = 100;

        top.style.position = "relative";
        //top.style.top = 500;
        ////top.style.bottom = 0;
        //top.style.left = 0;
        top.style.width = "100%";
        top.style.height = "43%";
        innovaphone.lib.addClass(top, "ijs-panel-top");
        container.appendChild(top);

        splitter.style.borderStyle = "solid";
        splitter.style.borderWidth = "1px";
        splitter.style.position = "relative";
        //splitter.style.left = 0;
        //splitter.style.right = 0;
        splitter.style.display = "table";
        splitter.style.width = "100%";
        //splitter.style.marginLeft = "5px";
        innovaphone.lib.addClass(splitter, "ijs-splitter");
        //container.appendChild(splitter);              // do not append splitter as long as vertical splitpanel does not work

        splitterText.style.display = "table-cell";
        splitterText.style.textAlign = "middle";
        splitterText.style.wordWrap = "break-word";
        splitterText.style.position = "relative";
        splitterText.style.height = "4px";
        splitterText.style.minHeight = "4px";
        splitterText.style.maxHeight = "4px";
        splitterText.style.cursor = "col-resize";
        splitterText.style.lineWidth = "0.4";
        splitterText.style.fontWeight = "bold";
        innovaphone.lib.addClass(splitterText, "ijs-splitter-text");
        //splitterText.innerHTML = ".<br/>.<br/>.<br/>.<br/>.<br/>.<br/>.";

        //grabber.style.position = "absolute";
        //grabber.style.top = 0;
        //grabber.style.bottom = 0;
        //if (innovaphone.lib.isTouch) {
        //    grabber.style.top = "-5px";
        //    grabber.style.height = "15px";
        //}
        //else {
        //    grabber.style.top = "0px";
        //    grabber.style.height = "4px";
        //}
        //grabber.style.zIndex = 1;
        //grabber.style.cursor = "col-resize";
        //grabber.style.backgroundColor = "transparent";


        splitter.appendChild(splitterText);
        //splitter.appendChild(grabber);

        down.style.position = "relative";
        //down.style.top = 0;
        //down.style.bottom = 0;
        //down.style.left = 0;
        down.style.width = "100%";
        down.style.height = "54%";
        innovaphone.lib.addClass(down, "ijs-panel-down");
        container.appendChild(down);

        //function mouseDown(event) {
        //    start = true;
        //    container.style.cursor = "col-resize";
        //    window.addEventListener(eventStop, mouseUp);
        //    window.addEventListener(eventMove, mouseMove);
        //    event.preventDefault();
        //    event.stopPropagation();
        //}

        //function mouseMove(event) {
        //    var x = 0;
        //    if (innovaphone.lib.isTouch) {
        //        x = event.changedTouches[0].pageX;
        //    }
        //    else {
        //        x = event.pageX || event.screenX;
        //    }
        //    redraw(x);
        //    event.preventDefault();
        //    event.stopPropagation();
        //}

        //function mouseUp(event) {
        //    if (start) {
        //        container.style.cursor = 'default';
        //        start = false;
        //        lastWidth = top.offsetWidth;
        //        if (storageId) localStorage[storageId] = lastWidth;
        //        event.preventDefault();
        //        event.stopPropagation();
        //    }
        //    window.removeEventListener(eventStop, mouseUp);
        //    window.removeEventListener(eventMove, mouseMove);
        //}

        function resize(event) {
            redraw(lastHeight);
        }

        function redraw(fixTopHeight) {
            if (container.offsetHeight == 0) {   // currently not visible
                return;
            }
            if (!innovaphone.lib.isInt(fixTopHeight)) {
                fixTopHeight = parseInt(fixTopHeight);
            }
            if (fixTopHeight < minTopHeight) fixTopHeight = minTopHeight;
            if (fixTopHeight > (container.offsetHeight - minTopHeight)) {
                fixTopHeight = container.offsetHeight - minTopHeight;
            }
            ////var addLeft = (fixLeftWidth ? fixLeftWidth : left.offsetWidth) - parseInt(splitter.style.marginLeft);
            ////splitter.style.left = left.offsetLeft + addLeft + 'px';
            ////right.style.left = splitter.offsetLeft + splitter.offsetWidth + 'px';
            ////left.style.right = splitter.offsetWidth + right.offsetWidth + 'px';
            ////lastWidth = left.offsetWidth;
            //var addLeft = (fixTopHeight ? fixTopHeight : top.offsetHeight) - parseInt(splitter.style.marginLeft);
            //splitter.style.top = top.offsetHeight + addLeft + 'px';
            //down.style.top = splitter.offsetLeft + splitter.offsetWidth + 'px';
            //top.style.down = splitter.offsetWidth + down.offsetWidth + 'px';
            //lastHeight = top.offsetHeight;
        }

        //splitter.addEventListener(eventStart, mouseDown);
        //grabber.addEventListener(eventStart, mouseDown);
        //window.addEventListener("resize", resize);

        if (storageId && localStorage[storageId]) {
            height = localStorage[storageId];
        }
        redraw(height);

        // public interface
        this.getTop = function () { return top; };
        this.getDown = function () { return down; };
        this.cleanupTop = function () { while (top.childNodes.length) top.removeChild(top.firstChild) };
        this.cleanupDown = function () { while (down.childNodes.length) down.removeChild(down.firstChild) };
        this.redraw = redraw;
        this.getLastHeight = function () { return lastHeight; };
    } return SplitPanelVertical;
}());