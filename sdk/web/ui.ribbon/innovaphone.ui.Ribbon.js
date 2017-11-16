/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.icon/innovaphone.ui.Icon.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.RibbonResources = innovaphone.ui.RibbonResources || function (onload) {
    innovaphone.lib.loadObjectScripts([
            "web/ui.icon/innovaphone.ui.Icon"
    ], function () {
        innovaphone.ui.RibbonResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.Ribbon = innovaphone.ui.Ribbon || (function () {
    function Ribbon(container) {
        var groups = [],
            right = [],
            ribbon = document.createElement("div"),
            ribbonSep = document.createElement("div"),
            content = document.createElement("div");

        ribbon.style.position = "absolute";
        ribbon.style.height = "87px";
        ribbon.style.width = "100%";
        innovaphone.lib.addClass(ribbon, "ijs-menu-bar");
        container.appendChild(ribbon);

        ribbonSep.style.position = "absolute";
        ribbonSep.style.top = "87px";
        ribbonSep.style.height = "4px";
        ribbonSep.style.width = "100%";
        ribbonSep.style.borderStyle = "solid";
        ribbonSep.style.borderTopWidth = "1px";
        ribbonSep.style.borderRightWidth = "0px";
        ribbonSep.style.borderBottomWidth = "1px";
        ribbonSep.style.borderLeftWidth = "0px";

        innovaphone.lib.addClass(ribbonSep, "ijs-menu-separator");
        ribbonSep.innerHTML = "&nbsp;";
        container.appendChild(ribbonSep);

        content.style.position = "absolute";
        content.style.top = "93px";
        content.style.left = "0px";
        content.style.right = "0px";
        content.style.bottom = "0px";
        innovaphone.lib.addClass(content, "ijs-content");
        container.appendChild(content);

        function Group(text) {
            var container = document.createElement("div"),
                footer = document.createElement("div"),
                buttons = [];

            container.style.position = "relative";
            container.style.display = "inline-block";
            container.style.height = "87px";
            container.style.verticalAlign = "top";
            container.style.borderStyle = "solid";
            container.style.borderTopWidth = "0px";
            container.style.borderRightWidth = "1px";
            container.style.borderBottomWidth = "0px";
            container.style.borderLeftWidth = "0px";
            innovaphone.lib.addClass(container, "ijs-menu-group");
            ribbon.appendChild(container);

            footer.style.position = "absolute";
            footer.style.display = "block";
            footer.style.top = "70px";
            footer.style.height = "17px";
            footer.style.width = "100%";
            footer.style.fontSize = "11px";
            footer.style.lineHeight = "17px";
            footer.style.textAlign = "center";
            footer.style.verticalAlign = "center";
            footer.style.fontSize = "11px";
            footer.innerHTML = text;
            innovaphone.lib.addClass(footer, "ijs-menu-group-footer");
            container.appendChild(footer);

            function Button(text, iconUrl, iconPosX, iconPosY, funcOnClick) {
                var iconDiv = document.createElement("div"),
                    iconWidth = 25,
                    iconHeight = 25;
                var outerButton = new OuterButton(text);

                if (iconUrl) {
                    var icon = new innovaphone.ui.Icon(null, iconUrl, iconPosX, iconPosY, iconWidth, iconHeight);
                    icon.addSpriteClass("ijs-sprite-25px");
                    outerButton.addElement(icon.container);
                }

                // public interface
                this.setOnClick = outerButton.setOnClick;
                this.disable = outerButton.disable;
                this.enable = outerButton.enable;

                this.setOnClick(funcOnClick);
            }


            function ElementButton(element, text) {
                var outerButton = new OuterButton(text);
                var elementDiv = document.createElement("div");

                elementDiv.appendChild(element.container);
                outerButton.addElement(elementDiv);

                // public interface
                this.setOnClick = outerButton.setOnClick;
                this.disable = outerButton.disable;
                this.enable = outerButton.enable;
            }


            function OuterButton(text) {
                var buttonOuter = document.createElement("div"),
                    buttonTextOuter = document.createElement("div"),
                    buttonText = document.createElement("p"),
                    disableCover = null;

                buttonOuter.style.position = "relative";
                buttonOuter.style.display = "inline-block";
                buttonOuter.style.minWidth = "54px";
                buttonOuter.style.height = "56px";
                buttonOuter.style.marginTop = "3px";
                buttonOuter.style.marginRight = "5px";
                buttonOuter.style.marginBottom = "2px";
                buttonOuter.style.marginLeft = "5px";
                buttonOuter.style.paddingTop = "4px";
                buttonOuter.style.paddingRight = "5px";
                buttonOuter.style.paddingBottom = "3px";
                buttonOuter.style.paddingLeft = "5px";
                buttonOuter.style.cursor = "normal";
                buttonOuter.style.borderWidth = "1px";
                buttonOuter.style.borderStyle = "solid";
                buttonOuter.style.borderRadius = "4px";
                innovaphone.lib.addClass(buttonOuter, "ijs-menu-button");

                buttonTextOuter.style.display = "table";
                buttonTextOuter.style.height = "24px";
                buttonTextOuter.style.margin = "auto";

                buttonText.style.display = "table-cell";
                buttonText.style.fontSize = "12px";
                buttonText.style.lineHeight = 1;
                buttonText.style.maxWidth = "120px";
                buttonText.style.textAlign = "center";
                buttonText.style.verticalAlign = "middle";
                buttonText.style.wordWrap = "break-word";
                buttonText.innerHTML = text;
                innovaphone.lib.makeUnselectable(buttonOuter);

                innovaphone.lib.addClass(buttonText, "ijs-menu-button-text");
                buttonTextOuter.appendChild(buttonText);
                buttonOuter.appendChild(buttonTextOuter);
                container.removeChild(footer);
                container.appendChild(buttonOuter);
                container.appendChild(footer);

                // public interface
                this.setOnClick = function (funcOnClick) {
                    buttonOuter.onclick = funcOnClick;
                    buttonOuter.style.cursor = "pointer";
                }

                this.addElement = function (element) {
                    buttonOuter.insertBefore(element, buttonTextOuter);
                }

                this.getButtonOuter = function () {
                    return buttonOuter;
                }

                this.disable = function () {
                    if (disableCover) return;
                    disableCover = document.createElement("div");
                    disableCover.style.position = "absolute";
                    disableCover.style.left = 0;
                    disableCover.style.top = 0;
                    disableCover.style.bottom = 0;
                    disableCover.style.right = 0;
                    disableCover.style.display = "block";
                    disableCover.style.opacity = "0.7";
                    disableCover.style.zIndex = 1;
                    disableCover.style.cursor = "default";
                    buttonOuter.style.pointerEvents = "none";
                    innovaphone.lib.addClass(disableCover, "ijs-menu-button-disabled");
                    buttonOuter.appendChild(disableCover);
                }

                this.enable = function () {
                    if (!disableCover) return;
                    buttonOuter.removeChild(disableCover);
                    buttonOuter.style.pointerEvents = "";
                    disableCover = null;
                }
            }

            // public interface
            this.container = container;

            this.addButton = function (text, iconUrl, iconPosX, iconPosY, funcOnClick) {
                var button = new Button(text, iconUrl, iconPosX, iconPosY, funcOnClick);
                buttons.push(button);
                return button;
            }

            this.addElementButton = function (element, text) {
                var elementButton = new ElementButton(element, text);
                buttons.push(elementButton);
                return elementButton;
            }

            this.disable = function () {
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].disable();
                }
            }

            this.enable = function () {
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].enable();
                }
            }
        }

        function Right(element) {
            var container = document.createElement("div");

            container.style.position = "relative";
            container.style.cssFloat = "right";
            container.appendChild(element);
            ribbon.appendChild(container);
        }

        // public interface
        this.addGroup = function (text) {
            var g = new Group(text);
            groups.push(g);
            ribbon.appendChild(g.container);
            return g;
        }

        this.clearGroups = function () {
            for (var i = 0; i < groups.length; i++) {
                ribbon.removeChild(groups[i].container);
            }
            groups = [];
        }

        this.addRight = function (element) {
            var r = new Right(element);
            right.push(r);
        }

        this.getContent = function () {
            return content;
        }
    }
    return Ribbon;
}());