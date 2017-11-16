
var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.FlatButtonResources = innovaphone.ui.FlatButtonResources || function (onload) {
    innovaphone.lib.loadObjectScripts(
        ["web/ui.container/innovaphone.ui.Container"
        ], function () {
            innovaphone.ui.FlatButtonResourcesLoaded = true;
            onload();
        });
};


var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.FlatButton = innovaphone.ui.FlatButton || (function () {
    function FlatButton(container, text, left, top, width, heigth, obj) {
        var onClickCallback = null,
            mouseCaptured = false,
            docMouseUpSet = false,
            isEnabled = true,
            className = "ijs-button-flat",
            classNameBackup = "";

        var button = document.createElement("div"),
            buttonCaption = null;

        if (left != undefined || top != undefined) {
            button.style.position = "absolute";
            if (left != undefined) button.style.left = left + "px";
            if (top != undefined) button.style.top = top + "px";
        }

        innovaphone.lib.setNoSelect(button);
        //button.innerHTML = text;
        button.style.height = (heigth - 1) + "px";
        button.style.width = (width - 1) + "px";
        button.style.border = "1px solid transparent"; //"none";
        button.style.fontSize = "14px";
        button.style.fontWeight = "bold";
        //button.style.textAlign = "center";
        //button.style.paddingTop = "7px";
        //button.style.verticalAlign = "middle";
        //button.style.lineHeight = heigth + "px";
        button.style.cursor = "default";
        button.style.outline = "none";
        button.tabIndex = "0";

        buttonCaption = document.createElement("div");
        buttonCaption.style.position = "absolute";
        buttonCaption.style.top = "-1px";
        buttonCaption.style.left = "1px";
        buttonCaption.style.width = (width - 3) + "px";
        buttonCaption.style.height = (heigth - 3) + "px";
        buttonCaption.style.textAlign = "center";
        buttonCaption.style.verticalAlign = "middle";
        buttonCaption.style.lineHeight = heigth + "px";
        buttonCaption.innerHTML = text;
        button.appendChild(buttonCaption);

        innovaphone.lib.addClass(button, className);

        button.addEventListener("mousedown", onMouseDown);
        button.addEventListener("mouseup", onMouseUp);
        button.addEventListener("mouseenter", onMouseEnter);
        button.addEventListener("mouseleave", onMouseLeave);
        button.addEventListener("click", onClick);

        if (container)
            container.appendChild(button);

        // Start of internal functions
        function setButtonState(stateDown) {
            if (stateDown) {
                button.style.borderBottomWidth = "0px";
                button.style.top = (top + 1) + "px";
                innovaphone.lib.removeClass(button, className);
                innovaphone.lib.addClass(button, className + "-down");
            } else {
                button.style.borderBottomWidth = "1px";
                button.style.top = top + "px";
                innovaphone.lib.removeClass(button, className + "-down");
                innovaphone.lib.addClass(button, className);
            }
        }

        function onDocMouseUp() {
            document.removeEventListener("mouseup", onDocMouseUp);
            mouseCaptured = false;
        }

        function onMouseDown(e) {
            if (e.buttons == 1) {
                mouseCaptured = true;
                setButtonState(true);
            }
        }

        function onMouseUp() {
            if (mouseCaptured) {
                mouseCaptured = false;
                setButtonState(false);
            }
        }

        function onMouseEnter(e) {
            if (e.buttons == 1 && mouseCaptured) {
                setButtonState(true);
                document.removeEventListener("mouseup", onDocMouseUp);
            }
            else if (e.buttons != 1 && mouseCaptured)
                mouseCaptured = false;
        }

        function onMouseLeave(e) {
            if (mouseCaptured) {
                setButtonState(false);
                document.addEventListener("mouseup", onDocMouseUp);
            }
        }

        function onClick() {
            if (onClickCallback)
                onClickCallback(obj);
        }


        // Public interface
        this.button = button;
        this.obj = obj;

        this.click = function () {
            button.click();
        }

        this.setOnClick = function (onClickFnc) {
            onClickCallback = onClickFnc;
        }

        this.setText = function (text) {
            buttonCaption.innerHTML = text;
        }

        this.getText = function () {
            return buttonCaption.innerHTML;
        }

        this.setFontBold = function(fontBold) {
            buttonCaption.style.fontWeight = (fontBold ? "bold" : "normal");
        }

        this.setFontSize = function (fontSize) {
            buttonCaption.style.fontSize = fontSize + "px";
        }

        this.setClass = function (theClassName) {
            innovaphone.lib.removeClass(button, className);
            className = theClassName;
            innovaphone.lib.addClass(button, className);
        }

        this.setEnabled = function (enabled) {
            if (enabled) {
                if (!isEnabled) {
                    this.setClass(classNameBackup);
                    classNameBackup = "";
                    button.addEventListener("mousedown", onMouseDown);
                    button.addEventListener("mouseup", onMouseUp);
                    button.addEventListener("mouseenter", onMouseEnter);
                    button.addEventListener("mouseleave", onMouseLeave);
                    button.addEventListener("click", onClick);
                    isEnabled = true;
                }
            }
            else {
                if (isEnabled) {
                    classNameBackup = className;
                    this.setClass("ijs-button-flat-disabled");
                    button.removeEventListener("mousedown", onMouseDown);
                    button.removeEventListener("mouseup", onMouseUp);
                    button.removeEventListener("mouseenter", onMouseEnter);
                    button.removeEventListener("mouseleave", onMouseLeave);
                    button.removeEventListener("click", onClick);
                    isEnabled = false;
                }
            }
        }

    } return FlatButton;
}());
