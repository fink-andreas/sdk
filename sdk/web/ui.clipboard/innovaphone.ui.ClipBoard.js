/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ClipBoard = innovaphone.ui.ClipBoard || (function () {
    function ClipBoard(container, value, width, height, bordered) {
        if (!container) {
            container = document.createElement("span");
        }

        var textarea = document.createElement("textarea");
        textarea.style.overflow = "auto";
        textarea.style.maxHeight = height + "px";
        textarea.style.height = "auto";
        if (bordered) {
            textarea.style.border = "solid";
            textarea.style.borderWidth = "1px";
            textarea.disabled = true;
        } else {
            textarea.style.border = "none";
        }
        textarea.readOnly = true;

        setValue(value);
        setWidth(width);

        function setValue(value) {
            if (value != null && value != undefined) {
                textarea.value = value;
            }
        }

        function setWidth(width) {
            if (width != null && width != undefined) {
                textarea.style.width = (width - 4) + "px";
            }
        }

        function setHeight(height) {
            if (height != null && height != undefined) {
                textarea.style.height = (height - 4) + "px";
            }
        }

        function copyTextToClipBoard(value) {
            setValue(value);
            var disabled = textarea.disabled;
            textarea.disabled = false;

            try {
                textarea.select();
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('unable to copy to clipboard');
                console.log(err.message);
            }
            textarea.disabled = disabled;
            return successful;
        }

        function setRowCountCalculatedHeight(rowHeight, rowChars, separator) {
            var counter = 0;
            textarea.style.minHeight = rowHeight + "px";
            textarea.cols = rowChars;
            var rows = textarea.value.split(separator);
            for (var idx = 0; idx < rows.length; idx++) {
                counter += Math.ceil(rows[idx].length / rowChars);     // count additional lines caused by long text 
            }
            textarea.rows = counter;
            textarea.style.height = (textarea.rows * rowHeight) + "px";
            textarea.style.maxHeight = textarea.style.height;
        }

        function setOverflow(overflow) {
            textarea.style.overflow = overflow;
        }


        container.appendChild(textarea);

        // public interface
        this.container = container;
        this.value = function () { return textarea.value; };
        this.setValue = setValue;
        this.setWidth = setWidth;
        this.setHeight = setHeight;
        this.copyTextToClipBoard = copyTextToClipBoard;
        this.setOverflow = setOverflow;
        this.setRowCountCalculatedHeight = setRowCountCalculatedHeight;

    } return ClipBoard;
}());

