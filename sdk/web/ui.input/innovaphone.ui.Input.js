/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Input = innovaphone.ui.Input || (function () {
    function Input(container, type, value, left, top, parent) {
        var instance = this,
            span = document.createElement("span"),
            input = document.createElement("input"),
            clearX = null,
            inputFocused = false,
            changeFocus = false,
            clearXShown = false,
            funcOnChange = null,
            funcOnEnter = null,
            originalValue = value,
            defaultValue = value,
            defaultWidth = 200,
            clearPadding = 17;


        if (container) {
            container.appendChild(span);
        }
        else {
            container = span;
        }

        if (parent != undefined) {
            if (container) {
                parent.appendChild(container);
            }
            else {
                parent.appendChild(span);
            }
        }

        if (left == undefined && top == undefined) {
            span.style.position = "relative";
        }
        else {
            span.style.position = "absolute";
            if (left != undefined) span.style.left = left + "px";
            if (top != undefined) span.style.top = top + "px";
        }

        try {
            if (type) input.type = type;
        } catch (ex) {
            if (type == "date") {
                type = "text";
                input.type = type;
            }
        }

        function createClearX() {
            clearX = document.createElement("div");
            clearX.style.position = "absolute";
            clearX.style.top = "1px";
            clearX.style.right = "4px";
            clearX.style.width = "9px";
            clearX.style.height = "15px";
            clearX.style.paddingLeft = "3px";
            clearX.style.lineHeight = 1;
            clearX.style.cursor = "pointer";
            clearX.innerHTML = "x";
            //innovaphone.lib.addClass(clearX, "ijs-input-clear");
            clearX.addEventListener("click", clear);
            clearX.onmousedown = function () {
                if (inputFocused) {
                    changeFocus = true;
                    setTimeout(updateClearX, 0);
                }
            };
        }

        function updateClearX() {
            if (clearX != null) {
                if (changeFocus) {
                    input.focus();
                }
                else if (inputFocused && input.value != "") {
                    if (!clearXShown) {
                        span.appendChild(clearX);
                        clearXShown = true;
                    }
                }
                else if (clearXShown) {
                    span.removeChild(clearX);
                    clearXShown = false;
                }
            }
        }

        input.addEventListener("focus", function () {
            inputFocused = true;
            changeFocus = false;
            updateClearX();
        });

        input.addEventListener("blur", function () {
            inputFocused = false;
            setTimeout(updateClearX, 0);
            if (!changeFocus) {
                if (funcOnChange && defaultValue != input.value) {
                    var event = document.createEvent("HTMLEvents");
                    event.initEvent("change", true, true);
                    event.eventName = "change";
                    event.memo = {};
                    funcOnChange(event);
                }
                defaultValue = input.value;
            }
        });
        
        input.addEventListener("input", function () {
            updateClearX();
        });

        input.addEventListener("keydown", function(event) {
            if(event != undefined && event.keyCode == innovaphone.lib.keyCodes.escape) {
                if (input.value != defaultValue) {
                    event.preventDefault(); // consume this event to prevent e.g. the popup from closing
                    // blur() and focus() are a workaround for a Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=646811
                    input.value = defaultValue;
                    input.blur();
                    input.value = defaultValue;
                    if (input.value != "") {
                        input.setSelectionRange(input.value.length, input.value.length);
                    }
                    input.focus();
                }
            }
        });

        input.spellcheck = false;
        input.style.fontFamily = "inherit";
        input.style.fontSize =  "inherit";

        if (type == undefined || type == "" || type == "text") {
            createClearX();
        }

        setValue(value);
        span.appendChild(input);

        function setValue(value, overrideOriginalValue) {
            if (value == null || value == undefined) return;
            input.value = value;
            defaultValue = value;
            updateClearX();
            if (overrideOriginalValue) originalValue = value;
        }

        function clear(event) {
            input.value = "";
            updateClearX();
        }

        function changed(event) {
            if (funcOnChange && !changeFocus) {
                funcOnChange(event);
                defaultValue = input.value;
            }
        }

        function keyDown(event) {
            switch (event.keyCode) {
                case innovaphone.lib.keyCodes.enter:
                    if (funcOnEnter) {
                        funcOnEnter(event);
                    }
                    break;
            }
        }

        // public interface
        this.container = container;
        this.style = input.style;
        this.value = function () { return input.value; };

        // do not use this.focus = input.focus; as this behaves strange
        // same for setSelectionRange/addEventListener
        this.setSelectionRange = function (start, end) {
            input.setSelectionRange(start, end);
        }

        this.addEventListener = function (type, listener) {
            input.addEventListener(type, listener);
        }

        this.focus = function () {  
            input.focus();
        }

        this.blur = function () {
            input.blur();
        }

        this.reset = function () {
            setValue(originalValue);
        }

        this.setValue = setValue;

        this.setMaxLength = function (maxLength) {
            input.maxLength = maxLength;
        }

        this.setWidth = function (width) {
            input.style.width = (width - 4) + "px"; // 4 => 1px paddingLeft, 1px paddingRight, 1px borderLeft, 1px borderRight
        }

        this.setPlaceHolder = function (placeHolder) {
            input.placeholder = placeHolder;
        }

        this.setOnEnter = function (onEnter) {
            if (funcOnEnter && !onEnter) {
                input.removeEventListener("keydown", keyDown);
            }
            else if (!funcOnEnter && onEnter) {
                input.addEventListener("keydown", keyDown);
            }
            funcOnEnter = onEnter;
        }

        this.setOnChange = function (onChange) {
            if (funcOnChange && !onChange) {
                input.removeEventListener("change", changed);
            }
            else if (!funcOnChange && onChange) {
                input.addEventListener("change", changed);
            }
            funcOnChange = onChange;
        }

        this.checked = function () {
            return input.checked;
        }

        this.check = function (checked) {
            input.checked = checked;
        }

        this.setType = function (type) {
            input.type = type;
        }

        this.getType = function () {
            return input.type;
        }

        this.hasChanged = function () {
            if (input.type == "checkbox") return input.checked != originalValue;
            else return input.value != originalValue;
        }

        this.setWidth(defaultWidth);    // set a default width

        this.setTitle = function (title) {
            input.title = title;
        }

        this.enable = function () {
            input.disabled = false;
        }

        this.disable = function () {
            input.disabled = true;
        }

        this.isDisabled = function () {
            return input.isDisabled;
        }

        this.getFiles = function () {
            var files = [];
            if (type == "file") {
                for (var idx = 0; idx < input.files.length; idx++) {
                    files[idx] = input.files[idx];
                }
            }
            return files;
        }

        this.setMin = function(min) {
            input.min = min;
        }

        this.setMax = function (max) {
            input.max = max;
        }

        this.setColor = function (color) {
            input.style.color = color;
        }

    } return Input;
}());

innovaphone.ui.InputText = innovaphone.ui.InputText || function (container, value, top, left) {
    return new innovaphone.ui.Input(container, "text", value, top, left);
};

innovaphone.ui.InputCheckbox = innovaphone.ui.InputCheckbox || function (container, checked, top, left, parent) {
    var input = new innovaphone.ui.Input(container, "checkbox", checked, left, top, parent);
    if (checked != undefined) input.check(checked);
    input.setWidth(20);
    return input;
};

innovaphone.ui.InputPassword = innovaphone.ui.InputPassword || function (container, value, top, left) {
    var input = new innovaphone.ui.Input(container, "password", value),
        visible = false;

    input.togglePassword = function () {
        if (visible) input.setType("password");
        else input.setType("");
        visible = !visible;
    }

    return input;
};

innovaphone.ui.InputNumber = innovaphone.ui.InputNumber || function (container, value, top, left, parent, min, max) {
    var input = new innovaphone.ui.Input(container, "number", value, left, top, parent);
    if (max != undefined && max != null) {
        input.setMax(max);
    }
    if (min != undefined && min != null) {
        input.setMin(min);
    }
    return input;
};

innovaphone.ui.InputUrl = innovaphone.ui.InputUrl || function (container, value, top, left, parent) {
    return new innovaphone.ui.Input(container, "url", value, left, top, parent);
};

innovaphone.ui.InputFile = innovaphone.ui.InputFile || function (container, value, top, left, parent) {
    var input = new innovaphone.ui.Input(container, "file", value, left, top, parent);
    input.setWidth(400);
    return input;
};

innovaphone.ui.InputDate = innovaphone.ui.InputDate || function (container, value, top, left, parent) {
    var input = new innovaphone.ui.Input(container, "date", value, left, top, parent);
    return input;
};

