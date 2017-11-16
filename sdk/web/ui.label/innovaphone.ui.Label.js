/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Label = innovaphone.ui.Label || (function () {
    function Label(container, text) {
        var span = document.createElement("span"),
            input = null,
            onChanged = null,
            oldValue = null;

        if (!container) container = document.createElement("span");
        span.style.position = "relative";
        span.innerHTML = text;
        container.appendChild(span);

        // public interface
        this.container = container;

        this.setOnChanged = function (funcOnChanged) {
            if (!onChanged) span.addEventListener("click", click);
            onChanged = funcOnChanged;

            function click(event) {
                if (!input) {
                    oldValue = span.innerHTML;
                    input = document.createElement("input");
                    input.value = span.innerHTML;
                    input.style.width = "100px";
                    span.innerHTML = "";
                    span.appendChild(input);
                    input.focus();
                    input.addEventListener("blur", focusOut);
                    input.addEventListener("keypress", function (event) { if (event.keyCode == innovaphone.lib.keyCodes.enter) focusOut(); });
                }
                event.stopPropagation();
                event.preventDefault();
            }

            function focusOut() {
                span.removeChild(input);
                span.innerHTML = input.value;
                if (oldValue != input.value) {
                    onChanged(input.value);
                }
                input = null;
            }
        }
    } return Label;
}());
