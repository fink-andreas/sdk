/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ElementsContainer = innovaphone.ui.ElementsContainer || (function () {
    function ElementsContainer(container, columnCount, verticalAlignment) {
        if (!container) container = document.createElement("div");

        var rows = [],
            elementsInRow = columnCount,
            columnMargin = 10,  // pixels between columns
            rowMargin = 5;      // pixels between rows

        verticalAlignment = verticalAlignment ? verticalAlignment : "top";

        function Row() {
            var elements = [],
                rowContainer = document.createElement("div");

            rowContainer.style.position = "relative";
            container.appendChild(rowContainer);

            function Element(elementContainer, fillLine) {
                var elementOuter = document.createElement("div");

                elementOuter.style.display = "inline-block";
                elementOuter.style.verticalAlign = verticalAlignment;

                elementOuter.appendChild(elementContainer);
                rowContainer.appendChild(elementOuter);

                // public interface
                this.fillLine = fillLine;

                this.getWidth = function () {
                    return elementContainer.offsetWidth;
                }

                this.setWidth = function (width) {
                    elementOuter.style.width = width + "px";
                }

                this.setLeftMargin = function (margin) {
                    elementOuter.style.marginLeft = margin + "px";
                }
            }

            //public interface
            this.addElement = function (elementContainer, fillLine) {
                var element = new Element(elementContainer, fillLine);
                elements.push(element);
                return element;
            }

            this.getElement = function (index) {
                if ((elements.length - 1) >= index) {
                    return elements[index];
                }
                return null;
            }

            this.setTopMargin = function (margin) {
                rowContainer.style.marginTop = margin + "px";
            }
        }

        // public interfaCe
        this.container = container;

        // element is the container element (DOM)
        this.addElement = function (element, fillLine) {
            if (element.style.position == "absolute") {
                container.appendChild(element);
            }
            else {
                if (elementsInRow == columnCount) { // create new row
                    var row = new Row();
                    rows.push(row);
                    elementsInRow = 0;
                    if (rows.length > 1) {
                        row.setTopMargin(rowMargin);
                    }
                }
                var row = rows[rows.length - 1];    // get last row with free elementContainer columns
                var e = row.addElement(element, fillLine);
                if (elementsInRow > 0) {
                    e.setLeftMargin(columnMargin);
                }
                if (fillLine) {
                    elementsInRow = columnCount;    // elementContainer uses space over multiple columns
                }
                else {
                    elementsInRow++;
                }
            }
        }

        // call this function if the container is already inside the DOM tree, otherwise the maxWidth calculation will fail
        this.adjustColumnWidth = function (column) {
            var maxWidth = 0;
            var elements = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var element = row.getElement(column - 1);
                if (element != null && !element.fillLine) {
                    maxWidth = Math.max(maxWidth, element.getWidth());
                    elements.push(element);
                }
            }
            if (maxWidth > 0) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].setWidth(maxWidth);
                }
            }
        }

        this.setColumnMargin = function (margin) {
            columnMargin = margin;
            for (var i = 0; i < rows.length; i++) {
                for (var j = 1; j < columnCount; j++) {
                    var element = rows[i].getElement(j);
                    if (element != null) {
                        element.setLeftMargin(margin);
                    }
                }
            }
        }

        this.setRowMargin = function (margin) {
            rowMargin = margin;
            for (var i = 1; i < rows.length; i++) {
                rows[i].setTopMargin(margin);
            }
        }

        this.setBorder = function (borderWidth) {
            if (!borderWidth) borderWidth = 1;
            this.container.style.border = "solid";
            this.container.style.borderWidth = borderWidth + "px";
            innovaphone.lib.addClass(this.container, "ijs-element-container-border");
        }

        this.setWidth = function (width) {
            this.container.style.width = width + "px";
        }

        this.setHeight = function (height) {
            this.container.style.height = height + "px";
        }

        this.setMinHeight = function (height) {
            this.container.style.minHeight = height + "px";
            this.container.style.height = "auto";
        }
    } return ElementsContainer;
}());