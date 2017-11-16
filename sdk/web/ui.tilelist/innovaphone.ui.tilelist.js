
/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Tilelist = innovaphone.ui.Tilelist || (function () {
    function Tilelist(container, tileWidth, defaultBkColor, defaultTextColor, width, height) {
        if (!container) {
            container = document.createElement("div");



        }

        if (width != null) {
            container.style.width = width + "px";
        }
        if (height != null) {
            container.style.height = height + "px";
        }


        var ul = document.createElement('ul');
        container.appendChild(ul);
        ul.style.listStyle = "none";
        ul.style.textAlign = "center";
        var self = this;
        function selectTile(parent, element) {
            if (parent.onClick != null) {
                parent.onClick(element);
            }
        }

        function AddNewItem(text) {
            var foundElement = FindElement(text);
            if (foundElement == null) {
                var li = document.createElement('li');
                li.style.width = tileWidth + "px";
                li.style.display = "inline-block";
                li.style.float = "left";
                li.style.background = defaultBkColor;
                li.style.color = defaultTextColor;
                li.style.verticalAlign = "top";
                li.style.padding = "5px";
                li.style.margin = "5px";
                li.style.cursor = "pointer";
                li.innerHTML = text;
                li.id = text;
                li.addEventListener("click", function (e) { selectTile(self, li); });
                ul.appendChild(li);

                foundElement = li;
            }

            return foundElement;

        }
        function FindElement(text) {
            var element = null;
            var list = ul.getElementsByTagName("li");
            for (var i = 0; i < list.length; i++) {
                if (text === list[i].id) {

                    element = list[i];
                    break;

                }

            }

            return element;
        }




        var source;

        //public interface



        this.onClick = null;
        this.container = container;
        this.AddItem = function (text) {
           return AddNewItem(text);
        }
        this.ChangeElementColors = function(elementText, bkColor, textColor) {
            var foundElement = FindElement(elementText);
            if (foundElement != null) {
                var currentBkColor = defaultBkColor;
                var currentTextColor = defaultTextColor;
                if (bkColor != null) {
                    currentBkColor = bkColor;
                }

                if (textColor != null) {
                    currentTextColor = textColor;
                }

                foundElement.style.background = currentBkColor;
                foundElement.style.color = currentTextColor;
            }
        }
        this.ChangeColorsToElement = function (element, bkColor, textColor) {
            if (element != null) {
                var currentBkColor = defaultBkColor;
                var currentTextColor = defaultTextColor;
                if (bkColor != null) {
                    currentBkColor = bkColor;
                }

                if (textColor != null) {
                    currentTextColor = textColor;
                }

                element.style.background = currentBkColor;
                element.style.color = currentTextColor;
            }
        }
        this.RemoveAllElements = function () {
            

            var list = ul.getElementsByTagName("li");
            while (list.length > 0) {
                list[0].parentNode.removeChild(list[0]);
            }

        }

        this.RemoveElement =function(text) {
            var foundElement = FindElement(text);
            if (foundElement != null) {
                foundElement.parentNode.removeChild(foundElement);
            }
        }

        this.GetElements = function () {
            var list = ul.getElementsByTagName("li");
            var finalArray = [];
            for (var i = 0; i < list.length; i++) {
                var cElement = list[i].id;
                
                finalArray.push(cElement);
            }

            return finalArray;
        }


        this.AddSubtextToItem = function(itemText, subText) {
            var element = FindElement(itemText);
            if (element != null) {
                if (subText == null) {
                    element.innerHTML = element.id;
                }
                else {
                    element.innerHTML = element.id + "<br>" + subText;
                }
            }
        }

        this.AddSubtextToElement = function (element, subText) {
            if (element != null) {
                if (subText == null) {
                    element.innerHTML = element.id;
                }
                else {
                    element.innerHTML = element.id + "<br>" + subText;
                }
            }
        }

    } return Tilelist;
}());

