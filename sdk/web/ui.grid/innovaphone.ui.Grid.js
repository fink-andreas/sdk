var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.GridResources = innovaphone.ui.GridResources || function (onload) {
    innovaphone.lib.loadObjectScripts(
        ["web/ui.container/innovaphone.ui.Container"
        ], function () {
            innovaphone.ui.GridResourcesloaded = true;
            onload();
        });
};

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Grid = innovaphone.ui.Grid || (function () {
    function Grid(left, top, cellWidth, cellHeight, rows, columns, parent) {
        this.instance = this;

        var cellCount = rows * columns,
            cells = new Array(cellCount),
            cellEnabled = new Array(cellCount),

            onClickCallback = null,
			onClickCallbackObj = null,
            onMouseEnterCallback = null,
			onMouseEnterCallbackObj = null,
            onMouseLeaveCallback = null,
			onMouseLeaveCallbackObj = null,

            gridWidth = cellWidth * columns + (columns - 1), // Add space for grid lines
            gridHeight = cellHeight * rows + (rows - 1),
            container = null;

        container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = top + "px";
        container.style.left = left + "px";
        container.style.width = gridWidth + "px";
        container.style.height = gridHeight + "px";

        container.style.borderStyle = "solid";
        container.style.borderWidth = "1px";
        innovaphone.lib.addClass(container, "ijs-cal");
        innovaphone.lib.addClass(container, "ijs-cal-grid");

        if (parent)
            parent.appendChild(container);

        var curCol = 0;
        var curRow = 0;
        var hideRightBorder = 1;
        var hideButtomBorder = 1;

        for (var i = 0; i < cellCount; i++) {
            var theCell = new innovaphone.ui.Container(curCol * cellWidth + curCol, curRow * cellHeight + curRow, cellWidth, cellHeight, container);
            theCell.container.style.borderStyle = "solid";
            theCell.container.style.borderWidth = "1px";
            innovaphone.lib.addClass(theCell.container, ".ijs-grid-cells-border");

            if (curCol == columns - 1)
                hideRightBorder = 0;

            if (curRow == rows - 1)
                hideButtomBorder = 0;

            theCell.setBorderWidth(0, 0, hideRightBorder, hideButtomBorder);

            curCol++;
            if (curCol == columns) {
                curCol = 0;
                curRow++;
                hideRightBorder = false;
            }

            theCell.setOnClick(onClick, i);
            theCell.container.style.cursor = "default";
            theCell.setOnMouseEnter(onMouseEnter, i);
            theCell.setOnMouseLeave(onMouseLeave, i);

            cells[i] = theCell;
            cellEnabled[i] = true;
        }

        function onClick(idx) {
            if (onClickCallback && cellEnabled[idx])
                onClickCallback(idx, onClickCallbackObj);
        }

        function onMouseEnter(idx) {
            if (onMouseEnterCallback && cellEnabled[idx])
                onMouseEnterCallback(idx, onMouseEnterCallbackObj);
        }

        function onMouseLeave(idx) {
            if (onMouseLeaveCallback && cellEnabled[idx])
                onMouseLeaveCallback(idx, onMouseLeaveCallbackObj);
        }

        // public interface            
        this.rows = rows;
        this.columns = columns;
        this.container = container;
        this.cells = cells;

        this.setCellEnabled = function (idx, enabled) {
            var theCell = this.cells[idx];
            innovaphone.lib.removeClass(theCell.container, "ijs-grid-cell-disabled");
            cellEnabled[idx] = enabled;
            if (!enabled)
                innovaphone.lib.addClass(theCell.container, "ijs-grid-cell-disabled");
        }

        this.setOnClick = function (onClick, obj) {
            onClickCallback = onClick;
			onClickCallbackObj = obj;
        }

        this.setOnMouseEnter = function (onMouseEnter) {
            onMouseEnterCallback = onMouseEnter;
        }

        this.setOnMouseLeave = function (onMouseLeave) {
            onMouseLeaveCallback = onMouseLeave;
        }

        this.disableCellBoder = function () {
            this.container.style.border = "none";
            for (i = 0; i < rows * columns; i++) {
                theCell = this.cells[i];
                theCell.container.style.border = "none";
                //innovaphone.lib.removeClass(theCell.container, "ijs-grid-cells-border");
                //innovaphone.lib.removeClass(theCell.container, "ijs-grid-cells-no-border");
                //innovaphone.lib.addClass(theCell.container, enabled ? "ijs-grid-cells-border" : "ijs-grid-cells-no-border");
            }
        }

    } return Grid;
}());
