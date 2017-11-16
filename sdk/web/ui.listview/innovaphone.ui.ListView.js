/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.scrollbar/innovaphone.ui.ScrollBar.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ListViewResources = innovaphone.ui.ListViewResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.scrollbar/innovaphone.ui.ScrollBar"], function () {
        innovaphone.ui.ListViewResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.ListView = innovaphone.ui.ListView || (function () {
    function ListView(container, storageId, funcItemSelectionChanged, multiSelect, noHeader) {
        var head = noHeader ? null : document.createElement("div"),
            bodyScroll = document.createElement("div"),
            scrollBar = new innovaphone.ui.ScrollBar(bodyScroll),
            columns = [],
            rows = [],
            sortArrow = document.createElement("div"),  // just one sortArrow over the whole tree
            resizeEventStart = (innovaphone.lib.isTouch ? "touchstart" : "mousedown"),
            resizeEventMove = (innovaphone.lib.isTouch ? "touchmove" : "mousemove"),
            resizeEventStop = (innovaphone.lib.isTouch ? "touchend" : "mouseup"),
            storageWidths = null,
            currentXPos = 0,    // start position of the column
            minWidth = 10,      // a column can't be smaller than 10px
            currentMouseOver = false,
            lastSelectedRow = 0,
            selectedRow = null,
            selectedRows = [],
            borderWidth = 0,
            paddingLeft = 2,
            headHeight = 20,
            sortedColumn = null,
            sortedDescending = null;

        if (!container) container = document.createElement("span");
        if (storageId) {
            if (localStorage[storageId]) {
                storageWidths = JSON.parse(localStorage[storageId]);
                if (!Array.isArray(storageWidths)) {
                    storageWidths = [];
                }
            }
            else {
                storageWidths = [];
            }
        }

        sortArrow.style.position = "absolute";
        sortArrow.style.top = "5px";
        sortArrow.style.right = "8px";
        sortArrow.style.width = "7px";
        sortArrow.style.height = "6px";
        sortArrow.style.backgroundPosition = "-7px -1px";
        innovaphone.lib.addClass(sortArrow, "ijs-listview-arrow");

        if (!noHeader) {
            head.style.position = "absolute";
            head.style.top = 0;
            head.style.left = 0;
            head.style.height = headHeight + "px";
            head.style.display = "inline-block";
            head.style.whiteSpace = "nowrap";
            container.appendChild(head);
        }
        else {
            bodyScroll.style.right = 0;
        }
        bodyScroll.style.position = "absolute";
        bodyScroll.style.top = (noHeader ? 0 : headHeight) + borderWidth + "px";
        bodyScroll.style.left = 0;
        bodyScroll.style.bottom = 0;
        bodyScroll.style.width = "100%";
        bodyScroll.style.display = "inline-block";
        bodyScroll.style.whiteSpace = "nowrap";

        container.appendChild(bodyScroll);

        function sortColumns(sortMapping, columnIndex, sortDescending) {
            sortedColumn = columnIndex;
            sortedDescending = sortDescending;
            var length = columns.length;
            for (var i = 0; i < length; i++) {
                columns[i].sort(sortMapping);
            }

            length = sortMapping.length;
            var tempRows = [];
            while (rows.length > 0) {
                tempRows.push(rows.shift());
            }
            var selectedRowSet = false;
            var selectedRowsTemp = [];
            for (var i = 0; i < length; i++) {
                var row = tempRows[sortMapping[i].index];
                if (multiSelect) {
                    for (var j = 0; j < selectedRows.length; j++) {
                        if (selectedRows[j] == sortMapping[i].index) {
                            selectedRowsTemp.push(i);
                            selectedRows.splice(j, 1);
                            break;
                        }
                    }
                }
                else if (!selectedRowSet && sortMapping[i].index == selectedRow) {  // change selectedRow value on sorting
                    selectedRow = i;
                    selectedRowSet = true;
                }
                row.setRowIndex(i);
                rows.push(row);
            }
            selectedRows = selectedRowsTemp;
        }

        function getWidth() {
            var width = 0;
            for (var i = 0; i < columns.length; i++) {
                width += columns[i].getWidth();
            }
            return width;
        }

        function deselectRow(index) {
            if (index == null) return;
            for (var i = 0; i < columns.length; i++) {
                var rowItem = columns[i].getRowItem(index);
                innovaphone.lib.removeClass(rowItem, "ijs-listview-row-selected");
            }
            if (multiSelect) {
                if (selectedRows.indexOf(index) >= 0) {
                    selectedRows.splice(selectedRows.indexOf(index), 1);
                }
            }
            else {
                selectedRow = null;
            }
        }

        function selectRow(index) {
            for (var i = 0; i < columns.length; i++) {
                var rowItem = columns[i].getRowItem(index);
                innovaphone.lib.addClass(rowItem, "ijs-listview-row-selected");
            }
            if (multiSelect) {
                if (selectedRows.indexOf(index) < 0) {
                    selectedRows.push(index);
                }
            }
            else {
                selectedRow = index;
            }
        }

        function deselectAllRows() {
            while(selectedRows.length) {
                deselectRow(selectedRows[0]);
            }
        }

        function Column(columnNumber, text, width, headTextAlign, columnTextAlign, sortFunction) {
            var colHead = noHeader ? null: document.createElement("div"),
                sizer = noHeader ? null: document.createElement("div"),
                body = document.createElement("div"),
                sortAscending = false,
                textNode = noHeader ? null: document.createTextNode(text),
                specialSortFunction = (sortFunction) ? sortFunction : false;

            if (width == undefined) {
                width = 100;
            }

            if (storageWidths) {
                if (storageWidths.length >= (columnNumber + 1)) {
                    width = storageWidths[columnNumber];
                }
                else {
                    storageWidths.push(width);
                }
            }
            if (!noHeader) {
                colHead.style.position = "relative";
                colHead.style.display = "inline-block";
                colHead.style.overflow = "hidden";
                colHead.style.cursor = "pointer";
                colHead.style.paddingLeft = paddingLeft + "px";
                colHead.style.borderTopStyle = "solid";
                colHead.style.borderTopWidth = borderWidth + "px";
                if (columnNumber == 0) {                        // left column has a left border
                    colHead.style.borderLeftWidth = borderWidth + "px";
                    colHead.style.borderLeftStyle = "solid";
                }
                if (headTextAlign) {
                    colHead.style.textAlign = headTextAlign;
                }
                colHead.addEventListener("click", sort);
                innovaphone.lib.addClass(colHead, "ijs-listview-head");
                innovaphone.lib.addClass(colHead, "ijs-listview-outer-border");
                innovaphone.lib.makeUnselectable(colHead);

                colHead.appendChild(textNode);
                head.appendChild(colHead);

                sizer.style.position = "absolute";
                sizer.style.top = 0;
                sizer.style.right = "2px";
                sizer.style.width = "5px";
                sizer.style.cursor = "col-resize";
                sizer.style.display = "inline-block";
                sizer.style.overflow = "hidden";
                sizer.style.borderRightStyle = "solid";
                sizer.style.borderRightWidth = "1px";
                innovaphone.lib.addClass(sizer, "ijs-listview-column-sizer");
                colHead.appendChild(sizer);

                sizer.addEventListener(resizeEventStart, function (event) { resizeStart(event, columnNumber); });
                sizer.innerHTML = "&nbsp;";
            }

            body.style.position = "relative";
            body.style.display = "inline-block";
            scrollBar.appendContent(body);
            setWidth();

            function sort(event) {
                if (event && event.target == sizer) return;  // do not sort if column is resized
                sortAscending = !sortAscending;
                if (colHead) {
                    if (sortAscending) {
                        sortArrow.style.transform = "rotate(180deg)";
                        sortArrow.style.webkitTransform = "rotate(180deg)";
                    }
                    else {
                        sortArrow.style.transform = "";
                        sortArrow.style.webkitTransform = "";
                    }
                    colHead.appendChild(sortArrow);
                }
                var arrayToSort = [];
                var length = body.childNodes.length;
                var sortByNumber = true;
                for (var i = 0; i < length; i++) {
                    var value = body.childNodes[i].textContent;
                    if (isNaN(value)) {
                        sortByNumber = false;
                    }
                    arrayToSort.push({ index: i, value: value });
                }
                if (sortByNumber) { // convert values to real numbers
                    for (i = 0; i < length; i++) {
                        var value = arrayToSort[i].value;
                        if (value == "") {
                            value = 0;
                        }
                        else if (innovaphone.lib.isFloat(value)) {       // there are floats
                            value = parseFloat(value);
                        }
                        else {                                      // and integers, nothing more
                            value = parseInt(value);
                        }
                        arrayToSort[i].value = value;
                    }
                }
                var sortFunc = null;
                if (sortByNumber) {
                    sortFunc = function (a, b) {
                        var ret = 0;
                        if (a.value > b.value) ret = (sortAscending ? 1 : -1);
                        else if (a.value < b.value) ret = (sortAscending ? -1 : 1);
                        return ret;
                    };
                }
                else {
                    if (!specialSortFunction) {
                        sortFunc = function (a, b) {
                            var ret = a.value.localeCompare(b.value);                           // use a localised string compare method which also support äöü etc.
                            if (!sortAscending) ret = (-1) * ret;
                            return ret;
                        }
                    } else {
                        sortFunc = function (a, b) {
                            return specialSortFunction(a, b, sortAscending);
                        }
                    }
                }
                arrayToSort.sort(sortFunc);
                sortColumns(arrayToSort, columnNumber, !sortAscending);
            }

            function setWidth() {
                if(colHead) colHead.style.width = width + "px";
                var bodyWidth = width + paddingLeft;
                if (columnNumber == 0) {
                    bodyWidth += borderWidth;
                }
                body.style.width = bodyWidth + "px";
                scrollBar.setWidth(getWidth());
            }

            function getMousePosition(event) {
                var e = event || window.event;
                if (innovaphone.lib.isTouch) {
                    return e.touches[0].pageX;
                }
                else {
                    return e.pageX;
                }
            }

            function resizeStart(event, columnNumber) {
                currentXPos = getMousePosition(event);
                window.addEventListener(resizeEventMove, resizeMove);
                window.addEventListener(resizeEventStop, resizeStop);
            }

            function resizeMove(event) {
                var newXPos = getMousePosition(event);
                if (newXPos > (document.body.clientWidth - minWidth)) { // mouse nearly outside window
                    return;
                }
                width += (newXPos - currentXPos);
                if (width < minWidth) {
                    width = minWidth;
                }
                if (storageId) {
                    storageWidths[columnNumber] = width;
                    localStorage[storageId] = JSON.stringify(storageWidths);
                }
                setWidth();
                if (width != minWidth) {
                    currentXPos = newXPos;
                }
            }

            function resizeStop() {
                window.removeEventListener(resizeEventMove, resizeMove);
                window.removeEventListener(resizeEventStop, resizeStop);
            }

            // public interface
            this.textAlign = columnTextAlign;

            this.sort = function (sortMapping) {
                var length = sortMapping.length;
                var nodes = [];
                while (body.firstChild) {
                    nodes.push(body.removeChild(body.firstChild));
                }
                for (var i = 0; i < length; i++) {
                    body.appendChild(nodes[sortMapping[i].index]);
                }
            }

            this.appendRowElement = function (element) {
                body.appendChild(element);
            }

            this.getRowCount = function () {
                return body.childElementCount;
            }

            this.getRowItem = function (index) {
                return body.childNodes[index];
            }

            this.removeRowItem = function (index) {
                body.removeChild(this.getRowItem(index));
            }

            this.clear = function () {
                body.innerHTML = "";
            }

            this.getRowIndex = function (item) {
                var rowIndex = -1;
                for (var i = 0; i < body.childElementCount; i++) {
                    if (body.childNodes[i] == item) {
                        rowIndex = i;
                        break;
                    }
                }
                return rowIndex;
            }

            this.sortByColumn = function (sortDescending) {
                sortAscending = (sortDescending) ? sortDescending : false;
                sort(null);
            }

            this.setRightBorder = function (unset) {
                if (!colHead) return;
                if(unset) {
                    colHead.style.borderRightStyle = "none";
                }
                else {
                    colHead.style.borderRightStyle = "solid";
                    colHead.style.borderRightWidth = borderWidth + "px";
                }
            }

            this.getWidth = function () {
                return body.offsetWidth;
            }
        }


        function Row(elements, id) {
            var rowIndex = columns[0].getRowCount();

            for (var i = 0; i < columns.length; i++) {
                var rowContainer = document.createElement("div");
                rowContainer.style.position = "relative";
                rowContainer.style.height = "20px";
                rowContainer.style.width = "100%";
                rowContainer.style.overflow = "hidden";
                rowContainer.style.whiteSpace = "nowrap";
                rowContainer.style.paddingLeft = paddingLeft + "px";
                if (columns[i].textAlign) {
                    rowContainer.style.textAlign = columns[i].textAlign;
                }
                if (elements[i] == undefined) elements[i] = "";
                if (innovaphone.lib.isPrimitiveType(elements[i])) {
                    rowContainer.innerHTML = elements[i];
                }
                else {
                    rowContainer.appendChild(elements[i]);
                }
                columns[i].appendRowElement(rowContainer);

                if (!innovaphone.lib.isTouch) {
                    rowContainer.addEventListener("mouseover", mouseOver);
                }
            }

            if (funcItemSelectionChanged || multiSelect) {
                for (var i = 0; i < columns.length; i++) {
                    var rowItem = columns[i].getRowItem(rowIndex);
                    rowItem.addEventListener("click", select);
                    rowItem.style.cursor = "pointer";
                }
            }

            function handleMultiSelect(event) {
                if (event.shiftKey) {       // select a range of rows with SHIFT
                    if (!event.ctrlKey) {   // we have to deselect all rows first, if CTRL is not pressed
                        deselectAllRows();
                    }
                    var lower = Math.min(rowIndex, lastSelectedRow);
                    var upper = Math.max(rowIndex, lastSelectedRow);
                    while (lower <= upper) {
                        selectRow(lower);
                        lower++;
                    }
                    return;
                }
                lastSelectedRow = rowIndex;
                if (event.ctrlKey) {   // CTRL pressed while clicking on a row
                    for (var i = 0; i < selectedRows.length; i++) {
                        if (selectedRows[i] == rowIndex) {
                            deselectRow(rowIndex);
                            return;
                        }
                    }
                    selectRow(rowIndex);
                }
                else {                      // just left click without CTRL or SHIFT
                    deselectAllRows();
                    selectRow(rowIndex);
                }
            }

            function handleSingleSelect(event) {
                if (selectedRow == rowIndex) {  // same row clicked
                    deselectRow(rowIndex);
                }
                else {
                    if (selectedRow != null) deselectRow(selectedRow);
                    selectRow(rowIndex);
                }
            }

            function select(event) {
                if (multiSelect) {
                    handleMultiSelect(event);
                }
                else {
                    handleSingleSelect(event);
                }
                if (funcItemSelectionChanged) {
                    funcItemSelectionChanged();
                }
            }

            function setDblClick(func) {
                for (var i = 0; i < columns.length; i++) {
                    var rowItem = columns[i].getRowItem(rowIndex);
                    rowItem.addEventListener("dblclick", func);
                    rowItem.style.cursor = "pointer";
                }
            }

            function setOnClick(func) {
                for (var i = 0; i < columns.length; i++) {
                    var rowItem = columns[i].getRowItem(rowIndex);
                    rowItem.addEventListener("click", func);
                    rowItem.style.cursor = "default";
                }
            }

            function mouseOut() {
                currentMouseOver = false;
                for (var i = 0; i < columns.length; i++) {
                    var rowItem = columns[i].getRowItem(rowIndex);
                    rowItem.removeEventListener("mouseout", mouseOut);
                    innovaphone.lib.removeClass(rowItem, "ijs-listview-row-hover");
                }
            }

            function mouseOver() {
                if (!currentMouseOver) {
                    if (columns.length > 0) {
                        currentMouseOver = true;
                        for (var i = 0; i < columns.length; i++) {
                            var rowItem = columns[i].getRowItem(rowIndex);
                            rowItem.addEventListener("mouseout", mouseOut);
                            innovaphone.lib.addClass(rowItem, "ijs-listview-row-hover");
                        }
                    }
                }
            }

            function setFontBold() {
                for (var i = 0; i < columns.length; i++) {
                    var rowItem = columns[i].getRowItem(rowIndex);
                    rowItem.style.fontWeight = "bold";
                }
            }

            function setFontNormal() {
                for (var i = 0; i < columns.length; i++) {
                    var rowItem = columns[i].getRowItem(rowIndex);
                    rowItem.style.fontWeight = "normal";
                }
            }

            function setRowIndex(value) {
                rowIndex = value;
            }

            function setColumnBackgroundColor(colIndex, backgroundColor) {
                var rowItem = columns[colIndex].getRowItem(rowIndex);
                rowItem.style.backgroundColor = backgroundColor;
            }

            function setTitle(colIndex, text) {
                var rowItem = columns[colIndex].getRowItem(rowIndex);
                rowItem.title = text;
            }

            function scrollTo() {
                var rowItem = columns[0].getRowItem(rowIndex);
                scrollBar.scrollIntoView(rowItem);
            }

            // public interface
            this.setFontBold = setFontBold;
            this.setFontNormal = setFontNormal;
            this.setDblClick = setDblClick;
            this.setOnClick = setOnClick;
            this.setRowIndex = setRowIndex;
            this.getRowIndex = function () {
                return rowIndex;
            }
            this.getRowElement = function(colIndex) {
                return columns[colIndex].getRowItem(rowIndex);
            }
            this.setColumnBackgroundColor = setColumnBackgroundColor;
            this.setTitle = setTitle;
            this.id = id;
            this.scrollTo = scrollTo;
        }

        function scrollTo(index) {
            rows[index].scrollTo();
        }

        // public interface
        this.container = container;

        this.selectedId = function () {
            if (selectedRow != null) {
                return rows[selectedRow].id;
            }
            return null;
        }

        this.selectedIds = function () {
            var ids = [];
            for (var i = 0; i < selectedRows.length; i++) {
                ids.push(rows[selectedRows[i]].id);
            }
            return ids;
        }

        this.selectId = function (id) {
            deselectRow(selectedRow);
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].id == id) {
                    selectRow(rows[i].getRowIndex());
                    scrollTo(rows[i].getRowIndex());
                    break;
                }
            }
        }

        this.selectIds = function (ids) {
            deselectAllRows();
            var validIds = [];
            for (var i = 0; i < ids.length; i++) {
                for (var j = 0; j < rows.length; j++) {
                    if (rows[j].id == ids[i]) {
                        selectRow(rows[j].getRowIndex());
                        validIds.push(rows[j].getRowIndex());
                        break;
                    }
                }
            }
            if (validIds.length) {
                scrollTo(Math.min.apply(Math, validIds));
            }
        }

        this.addColumn = function (text, width, headTextAlign, textAlign, sortFunction) {
            var columnNumber = columns.length;
            var column = new Column(columnNumber, text, width, headTextAlign, textAlign, sortFunction);
            column.setRightBorder();    // set right border for the last added column
            if (columnNumber > 0) {
                columns[columnNumber - 1].setRightBorder(true); // unset for the previous column
            }
            columns.push(column);
            // do not resize here, as this takes too much CPU! Call resize after having built the whole listview
        }

        this.addRow = function (elements, id) {
            var row = new Row(elements, id);
            rows.push(row);
            // do not resize here, as this takes too much CPU! Call resize after having built the whole listview
            return row;
        }

        this.removeRow = function (id) {
            var rowIndex = null;
            var indexToRemove = 0;
            for (i = 0; i < rows.length; i++) {
                if (rows[i].id == id) {
                    //if (i == selectedRow)
                    //    selectedRow = null;
                    indexToRemove = i;
                    rowIndex = rows[i].getRowIndex();
                    break;
                }
            }
            if (rowIndex != null) {
                if (selectedRow != null) {
                    if (selectedRow == rowIndex) {
                        deselectRow(selectedRow);
                    }
                    else if (selectedRow > rowIndex) {
                        selectedRow--;
                    }
                }
                else {
                    for (i = 0; i < selectedRows.length; i++) {
                        if (selectedRows[i] == rowIndex) {
                            deselectRow(rowIndex);
                        }
                        else if (selectedRows[i] > rowIndex) {
                            selectedRows[i]--;
                        }
                    }
                }
                rows.splice(indexToRemove, 1);
                for (var j = 0; j < columns.length; j++) {
                    columns[j].removeRowItem(rowIndex);
                }
                for (i = 0; i < rows.length; i++) {
                    var tempIndex = rows[i].getRowIndex();
                    if (tempIndex > rowIndex) {
                        rows[i].setRowIndex(tempIndex - 1);
                    }
                }
            }
        }

        this.resize = function () {
            scrollBar.resize();
            scrollBar.setWidth(getWidth());
            // scroll to selected row
            var scrollToIndex = null;
            if (selectedRow != null) {
                scrollToIndex = selectedRow;
            }
            else if (selectedRows.length) {
                scrollToIndex = Math.min.apply(Math, selectedRows);
            }
            if (scrollToIndex != null) {
                scrollTo(scrollToIndex);
            }
        }

        this.sortByColumn = function (index, descending) {
            var column = columns[index];
            var sortDescending = (descending) ? descending : false;
            column.sortByColumn(sortDescending);
        }

        this.sort = function () {
            if (sortedColumn != null && sortedDescending != null) {
                this.sortByColumn(sortedColumn, sortedDescending);
            }
        }

        this.setRowHeight = function (height) {
            for (var rowIdx = 0; rowIdx < rows.length; rowIdx++) {
                for (var i = 0; i < columns.length; i++) {
                    var rowItem = columns[i].getRowItem(rowIdx);
                    rowItem.style.height = height + "px";
                }
            }
        }
         
        this.clear = function () {
            rows = [];
            for (var j = 0; j < columns.length; j++) {
                columns[j].clear();
            }
            lastSelectedRow = 0;
            selectedRow = null;
            selectedRows = [];
            sortedColumn = null;
            this.resize();
        }

    } return ListView;
}());
