
/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui1 = innovaphone.ui1 || {};
innovaphone.ui1.TileList = innovaphone.ui1.TileList || function (style, cl, tileWidth, defaultBkColor, defaultTextColor) {
 
    this.createNode("ul", style, "", cl);

    var container = this.container;
    var tiles = [];
    var i;
    
    container.style.listStyle = "none";
    container.style.textAlign = "center";
    var self = this;

    function selectTile(parent, element) {
        if (parent.onClick != null) {
            parent.onClick(element);
        }
    }

    function TileElement(text) {
        var foundElement = findElement(text);
        this.id = text;
        if (foundElement == null) {
            this.createNode("li");
            this.container.style.width = tileWidth + "px";
            this.container.style.display = "inline-block";
            this.container.style.float = "left";
            this.container.style.background = defaultBkColor;
            this.container.style.color = defaultTextColor;
            this.container.style.verticalAlign = "top";
            this.container.style.padding = "5px";
            this.container.style.margin = "5px";
            this.container.style.cursor = "pointer";
            this.container.innerHTML = text;
            this.addEvent("click", function (e) { selectTile(self, this.container); });

        } else {
            return foundElement;
        }
    }
    TileElement.prototype = innovaphone.ui1.nodePrototype;


    function findElement(text) {
        var element = null;
        for (i = 0; i < tiles.length; i++) {
            if (text === tiles[i].id) {
                element = tiles[i];
                break;
            }
        }

        return element;
    }



    //public interface



    this.onClick = null;
    this.container = container;
    this.addItem = function (text) {
        var element = new TileElement(text);
        this.add(element);
        tiles.push(element);
        return element;
    }
    this.changeElementColors = function (elementText, bkColor, textColor) {
        var foundElement = findElement(elementText);
        if (foundElement != null) {
            var currentBkColor = defaultBkColor;
            var currentTextColor = defaultTextColor;
            if (bkColor != null) {
                currentBkColor = bkColor;
            }

            if (textColor != null) {
                currentTextColor = textColor;
            }

            foundElement.container.style.background = currentBkColor;
            foundElement.container.style.color = currentTextColor;
        }
    }
    this.changeColorsToElement = function (element, bkColor, textColor) {
        if (element != null) {
            var currentBkColor = defaultBkColor;
            var currentTextColor = defaultTextColor;
            if (bkColor != null) {
                currentBkColor = bkColor;
            }

            if (textColor != null) {
                currentTextColor = textColor;
            }

            element.container.style.background = currentBkColor;
            element.container.style.color = currentTextColor;
        }
    }
    this.removeAllElements = function () {
        for (i = 0; i < tiles.length; i++) {
            this.rem(tiles[i]);
        }

        tiles.clear();
    }

    this.removeElement = function (text) {
        var index = -1;
        var element = null;
        for (i = 0; i < tiles.length; i++) {
            if (text === tiles[i].id) {
                element = tiles[i];
                break;
            }
        }
        if (element != null) {
            this.rem(element);
            tiles.splice(index, 1);
        }
    }

    this.getElements = function () {

        return tiles;
    }


    this.addSubtextToItem = function (itemText, subText) {
        var element = findElement(itemText);
        if (element != null) {
            if (subText == null) {
                element.container.innerHTML = element.id;
            }
            else {
                element.container.innerHTML = element.id + "<br>" + subText;
            }
        }
    }

    this.addSubtextToElement = function (element, subText) {
        if (element != null) {
            if (subText == null) {
                element.container.innerHTML = element.id;
            }
            else {
                element.container.innerHTML = element.id + "<br>" + subText;
            }
        }
    }
}
innovaphone.ui1.TileList.prototype = innovaphone.ui1.nodePrototype;
