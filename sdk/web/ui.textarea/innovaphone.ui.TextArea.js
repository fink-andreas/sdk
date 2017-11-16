/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.TextArea = innovaphone.ui.TextArea || (function () {
    function TextArea(container, value, width, height, left, top, parent) {
        if (!container) {
            container = document.createElement("span");
            if (left == undefined && top == undefined) {
                container.style.position = "relative";
            }
            else {
                container.style.position = "absolute";
                if (left != undefined) container.style.left = left + "px";
                if (top != undefined) container.style.top = top + "px";
            }
        }
        if (parent != undefined) {
            parent.appendChild(container);
        }

        var textarea = document.createElement("textarea");
        textarea.style.overflow = "auto";

        setValue(value);
        setWidth(width);
        setHeight(height);
        textarea.addEventListener("keydown", keyDown);

        function setValue(value) {
            if (value == null || value == undefined) return;
            textarea.value = value;
        }

        function setWidth(width) {
            textarea.style.width = (width - 4) + "px";
        }

        function setHeight(height) {
            textarea.style.height = (height - 4) + "px";
        }

        function setTitle (text) {
            textarea.title = text;
        }

        function keyDown(event) {
            switch (event.keyCode) {
                case innovaphone.lib.keyCodes.enter:
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    break;
            }
        }

        function setRowCountCalculatedHeight(rowHeight, rowChars, separator) {
            var counter = 0;
            textarea.style.minHeight = rowHeight + "px";
            textarea.cols = rowChars;
            var rows = textarea.value.split(separator);
            for (var idx = 0; idx < rows.length; idx++) {
                counter += Math.ceil(rows[idx].length / rowChars);
            }
            textarea.rows = counter;
            textarea.style.height = (textarea.rows * rowHeight) + "px";
        }

        function setBorderNone() {
            textarea.style.border = "none";
        }

        function setOverflow(overflow) {
            textarea.style.overflow = overflow;
        }

        function setReadOnly() {
            textarea.readOnly = "readonly";
        }

        container.appendChild(textarea);

        // public interface
        this.container = container;
        this.disableResize = function () { textarea.style.resize = "none"; }
        this.value = function () { return textarea.value; };
        this.setValue  = setValue;
        this.setWidth  = setWidth;
        this.setHeight = setHeight;
        this.setTitle = setTitle;
        this.setBorderNone = setBorderNone;
        this.setOverflow = setOverflow;
        this.setReadOnly = setReadOnly;
        this.setRowCountCalculatedHeight = setRowCountCalculatedHeight;

    } return TextArea;
}());


