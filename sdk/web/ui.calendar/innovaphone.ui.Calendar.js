
/// <reference path="~/sdk/web/lib/innovaphone.lib.js" />
/// <reference path="~/calendar/app/innovaphone.ui.Container.js" />
/// <reference path="~/sdk/web/ui.text/innovaphone.ui.Text.js" />
/// <reference path="~/sdk/web/ui.icon/innovaphone.ui.Icon.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.CalendarResources = innovaphone.ui.CalendarResources || function (onload) {
    innovaphone.lib.loadObjectScripts(
        ["web/ui.container/innovaphone.ui.Container",
         "web/ui.text/innovaphone.ui.Text",
         "web/ui.icon/innovaphone.ui.Icon",
         "web/ui.grid/innovaphone.ui.Grid",
         "web/ui.calendar/innovaphone.ui.FlatButton"
        ], function () {
            innovaphone.ui.CalendarResourcesloaded = true;
            onload();
        });
};

innovaphone.ui.CalendarImages = {
    "icons": "data:image/png;base64,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"
};


var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.CalDateYearSelector = innovaphone.ui.CalDateYearSelector || (function () {
    function CalDateYearSelector(shortMonthNames, middleForLeft, top, parent, shortMonthNames, smallSize) {
        var instance = this,
            isShown = true,
            onSelectCallback = null,
            containerMonth = null,
            labelYear = null,
            arrowLeft = null,
            arrowRight = null,
            arrowYearDelta = 0,
            arrowMouseCapture = null,
            arrowTimer = null,
            arrowInterval = 0;

        selectorBorder = smallSize ? 4 : 6;
        monthFieldWidth = smallSize ? 29 : 39;
        monthFieldHeight = smallSize ? 17 : 27;
        monthFieldSeperator = 1;
        monthGridWidth = (monthFieldWidth + monthFieldSeperator) * 4;
        monthGridHeight = (monthFieldHeight + monthFieldSeperator) * 3;
        yearWidth = 48;
        yearHeight = smallSize ? 16 : 24;
        width = selectorBorder * 2 + monthGridWidth + 1;
        height = selectorBorder * 3 + monthGridHeight + yearHeight + 2;
        yearTop = selectorBorder + 1;
        yearLeft = width / 2 - yearWidth / 2;
        arrowButtonMargin = selectorBorder;
        arrowsTop = smallSize ? 6 : 10;
        arrowsSize = smallSize ? 15 : 20;
        headerHeight = selectorBorder + yearHeight + selectorBorder + 1;


        var calHideContainer = document.createElement("div");
        calHideContainer.style.position = "absolute";
        calHideContainer.style.top = "0px";
        calHideContainer.style.left = "0px";
        calHideContainer.style.width = parent.style.width;
        calHideContainer.style.height = parent.style.height;
        calHideContainer.style.zIndex = 1;
        calHideContainer.style.border = "none";
        calHideContainer.style.backgroundColor = "#000000";
        calHideContainer.style.opacity = "0.2";
        parent.appendChild(calHideContainer);

        var container = document.createElement("div");
        container.style.position = "absolute";
        container.style.width = width + "px";
        container.style.height = height + "px";
        container.style.top = top + "px";
        container.style.left = (middleForLeft - width / 2) + "px";
        container.style.zIndex = 1;
        container.style.borderStyle = "solid";
        container.style.borderWidth = "1px";
        container.style.borderColor = "black";
        innovaphone.lib.setNoSelect(container);
        innovaphone.lib.addClass(container, "ijs-cal");
        container.addEventListener("mouseup", onMainContainerMouseUp);

        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);

        containerMonth = document.createElement("div");
        containerMonth.style.position = "absolut";
        containerMonth.style.top = "0px";
        containerMonth.style.left = "0px";
        containerMonth.style.width = width;
        containerMonth.style.height = height;
        containerMonth.style.background = "transparent";
        innovaphone.lib.setNoSelect(containerMonth);
        container.appendChild(containerMonth);

        // Will be visible by default, so add option to hide when mouse down outside happens
        document.addEventListener("mousedown", onDocMouseDown);

        if (smallSize)
            arrowLeft = new innovaphone.ui.Icon(containerMonth, innovaphone.ui.CalendarImages.icons, 0, -2, arrowsSize, arrowsSize, arrowButtonMargin, arrowsTop);
        else
            arrowLeft = new innovaphone.ui.Icon(containerMonth, innovaphone.ui.CalendarImages.icons, 0, -40, arrowsSize, arrowsSize, arrowButtonMargin, arrowsTop);
        arrowLeft.setOnMouseDown(onArrowMouseDown, arrowLeft);
        arrowLeft.setOnMouseUp(onArrowMouseUp, arrowLeft);
        arrowLeft.setOnMouseEnter(onArrowMouseEnter, arrowLeft);
        arrowLeft.setOnMouseLeave(onArrowMouseLeave, arrowLeft);
        arrowLeft.addSpriteClass("ijs-sprite-20px");

        if (smallSize)
            arrowRight = new innovaphone.ui.Icon(containerMonth, innovaphone.ui.CalendarImages.icons, 0, -62, arrowsSize, arrowsSize, width - arrowButtonMargin - arrowsSize, arrowsTop);
        else
            arrowRight = new innovaphone.ui.Icon(containerMonth, innovaphone.ui.CalendarImages.icons, 0, -20, arrowsSize, arrowsSize, width - arrowButtonMargin - arrowsSize, arrowsTop);
        arrowRight.setOnMouseDown(onArrowMouseDown, arrowRight);
        arrowRight.setOnMouseUp(onArrowMouseUp, arrowRight);
        arrowRight.setOnMouseEnter(onArrowMouseEnter, arrowRight);
        arrowRight.setOnMouseLeave(onArrowMouseLeave, arrowRight);
        arrowRight.addSpriteClass("ijs-sprite-20px");

        if (smallSize)
            yearTop -= 2;
        labelYear = document.createElement("div");
        labelYear.style.position = "absolute";
        labelYear.style.top = yearTop + "px";
        labelYear.style.left = yearLeft + "px";
        labelYear.style.width = yearWidth + "px";
        labelYear.style.height = yearHeight + "px";
        labelYear.style.textAlign = "center";
        labelYear.style.verticalAlign = "center";
        labelYear.style.fontSize = (smallSize ? 12 : 16) + "px";
        labelYear.style.fontWeight = "bold";
        innovaphone.lib.makeUnselectable(labelYear);
        container.appendChild(labelYear);

        textTop = monthFieldHeight / 2 - (smallSize ? 8 : 10);
        var monthGrid = new innovaphone.ui.Grid(selectorBorder, headerHeight, monthFieldWidth, monthFieldHeight, 3, 4, containerMonth);
        monthGrid.container.style.opacity = "inherit";
        monthGrid.setOnMouseEnter(onMonthGridMouseEnter);
        monthGrid.setOnMouseLeave(onMonthGridMouseLeave);
        monthGrid.setOnClick(onMonthGridClick);

        for (i = 0; i < 12; i++) {
            curCell = monthGrid.cells[i];

            theText = new innovaphone.ui.Text(shortMonthNames[i], 0, textTop, curCell.container, monthFieldWidth);
            theText.container.style.opacity = "inherit";
            theText.setCenter();
            theText.setFontBold();
            if (smallSize)
                theText.container.style.fontSize = "11px";
            else
                theText.container.style.fontSize = "14px";
        }


        parent.appendChild(container);

        // Start of functions
        function onMonthGridMouseEnter(idx) {
            cell = monthGrid.cells[idx];
            innovaphone.lib.addClass(cell.container, "ijs-cal-day-cell-cur-day-hover");
        }

        function onMonthGridMouseLeave(idx) {
            cell = monthGrid.cells[idx];
            innovaphone.lib.removeClass(cell.container, "ijs-cal-day-cell-cur-day-hover");
        }

        function onMonthGridClick(idx) {
            year = labelYear.innerHTML;
            month = idx;

            instance.hide();
            if (onSelectCallback)
                onSelectCallback(month, year);
        }

        function onMainContainerMouseUp() {
            arrowMouseCapture = false;
        }

        function onDocMouseDown(e) {
            instance.hide();
        }

        function onDocMouseUp(e) {
            arrowMouseCapture = false;
        }

        function onMouseEnter() {
            document.removeEventListener("mousedown", onDocMouseDown);
            document.removeEventListener("mouseup", onDocMouseUp);
        }

        function onMouseLeave() {
            document.addEventListener("mousedown", onDocMouseDown);
            document.addEventListener("mouseup", onDocMouseUp);
        }

        function onArrowMouseDown(sender, event) {
            if (event.buttons == 1) {
                arrowMouseCapture = sender;
                arrowYearDelta = sender == arrowLeft ? -1 : 1;
                labelYear.innerHTML = parseInt(labelYear.innerHTML) + arrowYearDelta;
                arrowTimer = setTimeout(arrowDownRepeat, 500);
            }
        }

        function onArrowMouseUp() {
            arrowMouseCapture = null;
            clearTimeout(arrowTimer);
            clearInterval(arrowInterval);
        }

        function onArrowMouseEnter(sender) {
            if (sender == arrowMouseCapture) {
                labelYear.innerHTML = parseInt(labelYear.innerHTML) + arrowYearDelta;
                arrowInterval = setInterval(function () {
                    labelYear.innerHTML = parseInt(labelYear.innerHTML) + arrowYearDelta;
                }, 100);
            }
        }

        function onArrowMouseLeave(sender) {
            if (sender == arrowMouseCapture) {
                clearTimeout(arrowTimer);
                clearInterval(arrowInterval);
            }
        }

        function arrowDownRepeat() {
            labelYear.innerHTML = parseInt(labelYear.innerHTML) + arrowYearDelta;
            arrowInterval = setInterval(function () {
                labelYear.innerHTML = parseInt(labelYear.innerHTML) + arrowYearDelta;
            }, 100);
        }


        // public interface
        this.container = container;

        this.setOnSelect = function (onSelectFnc) {
            onSelectCallback = onSelectFnc;
        }

        this.show = function (month, year) {
            labelYear.innerHTML = year;

            for (var i = 0; i < 12; i++) {
                theCell = monthGrid.cells[i];
                innovaphone.lib.removeClass(theCell.container, "ijs-cal-month-sel-cur-month");
                if (i == month)
                    innovaphone.lib.addClass(theCell.container, "ijs-cal-month-sel-cur-month");
            }

            if (isShown)
                return;

            document.addEventListener("mousedown", onDocMouseDown);

            isShown = true;
            calHideContainer.style.display = "block";
            container.style.display = "block";
        }

        this.hide = function () {
            if (!isShown)
                return;

            document.removeEventListener("mousedown", onDocMouseDown);

            isShown = false;
            container.style.display = "none";
            calHideContainer.style.display = "none";
        }

    } return CalDateYearSelector;
}());


var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Calendar = innovaphone.ui.Calendar || (function () {
    function Calendar(left, top, strings, smallSize, weekNumType, sundayIsFirstDay, parent) {
        var CircleType = {
            NONE: 0,
            SELECTED: 1,
            SELECTED_CUR_DAY: 2,
            CUR_DAY: 3,
            HOVER: 4,
            HOVER_CUR_DAY: 5
        };

        var monthNames = [strings.monthJanuary, strings.monthFebruary, strings.monthMarch, strings.monthApril,
                          strings.monthMay, strings.monthJune, strings.monthJuly, strings.monthAugust,
                          strings.monthSeptember, strings.monthOctober, strings.monthNovember, strings.monthDecember],

            shortMonthNames = [strings.monthJanuaryShort, strings.monthFebruaryShort, strings.monthMarchShort, strings.monthAprilShort,
                               strings.monthMayShort, strings.monthJuneShort, strings.monthJulyShort, strings.monthAugustShort,
                               strings.monthSeptemberShort, strings.monthOctoberShort, strings.monthNovemberShort, strings.monthDecemberShort],

            firstDayDelta = 0, // (sundayIsFirstDay ? 1 : 0),
            shortDayNames,
            dayNames,
            firstDay = 0,
            numOfDays = 0,

            calHeaderHeight = smallSize ? 38 : 56,
            calFooterHeigth = smallSize ? 4 : 32,
            calFooterTextTopMargin = 6,
            calFooterTextWidth = 195,

            calDayCellWidth = smallSize ? 20 : 32,
            calDayCellHeigth = smallSize ? 16 : 32,
            calDayGridMarginRight = smallSize ? 4 : 8,
            calDayGridMarginLeft = smallSize ? 24 : 32,

            calMonthButton = null,
            calMonthButtonTop = smallSize ? 4 : 7,
            calMonthButtonWidth = smallSize ? 64 : 114,
            calMonthButtonHeight = smallSize ? 18 : 26,
            calMonthButtonMouseCapture = false,
            calMonthYearSelector = null,

            calArrowsTop = calMonthButtonTop + 4,
            calArrowsSize = smallSize ? 15 : 20,
            calArrowDelta = 0,
            calArrowLeft = null,
            calArrowRight = null,
            calArrowMargin = 8,
            calArrowMouseCapture = null,
            calArrowTimer = null,
            calArrowInterval = null,

            calHeaderDayNamesTop = calMonthButtonTop + calMonthButtonHeight + 3,

            // Add 6 pixels to the width / height because the lines between the cells and 2 additional
            // because of the border of the grid...
            calGridWidth = calDayCellWidth * 7 + 8,
            calGridHeigth = calDayCellHeigth * 6 + 7,
            calWidth = calGridWidth + calDayGridMarginLeft + calDayGridMarginRight,
            calHeigth = calHeaderHeight + calGridHeigth + calFooterHeigth,

            today = new Date(),
            curMonthDisp = today.getMonth(),
            curYearDisp = today.getFullYear(),
            curMonthSel = today.getMonth(),
            curYearSel = today.getFullYear(),
            curSelectedCell = null,

            calDaysGrid = null,
            calDayCellPresenceList = new Array(42),
            dayCellBackground = new Array(42),
            dayCellText = new Array(42),
            dayNameLabels = new Array(7),
            weekNumFields = new Array(6),
            weekFieldTopMargin = 4,
            weekFieldTopStart = smallSize ? (calHeaderHeight - 3) : (calHeaderHeight + 1),
            weekFieldLeftMargin = smallSize ? (calArrowMargin - 6) : calArrowMargin,
            weekFieldWidth = 20,
            calFooterText = null,
            
            onVisMonthChanged = null,
            onVisMonthChangedObj = null,
            onSelDayChanged = null,
            onSelDayChangedObj = null,
            noDateChangeCallback = false;

        if (sundayIsFirstDay) {
            shortDayNames = [strings.daySundayShort, strings.dayMondayShort, strings.dayTuesdayShort, strings.dayWednesdayShort,
                             strings.dayThursdayShort, strings.dayFridayShort, strings.daySaturdayShort];
            dayNames = [strings.daySunday, strings.dayMonday, strings.dayTuesday, strings.dayWednesday,
                        strings.dayThursday, strings.dayFriday, strings.daySaturday];
            firstDayDelta = 0;
        } else {
            shortDayNames = [strings.dayMondayShort, strings.dayTuesdayShort, strings.dayWednesdayShort,
                             strings.dayThursdayShort, strings.dayFridayShort, strings.daySaturdayShort, strings.daySundayShort];
            dayNames = [strings.dayMonday, strings.dayTuesday, strings.dayWednesday,
                        strings.dayThursday, strings.dayFriday, strings.daySaturday, strings.daySunday];
            firstDayDelta = 1;
        }


        // Base container
        var container = document.createElement("div");
        if (left == undefined && top == undefined) {
            this.container.style.position = "relative";
        }
        else {
            container.style.position = "absolute";
            container.style.left = left + "px";
            container.style.top = top + "px";
        }

        container.style.width = calWidth + "px";
        container.style.height = calHeigth + "px";
        container.style.border = "none";
        innovaphone.lib.addClass(container, "ijs-cal");

        if (parent)
            parent.appendChild(container);

        // Header area
        if (smallSize)
            calArrowLeft = new innovaphone.ui.Icon(container, innovaphone.ui.CalendarImages.icons, 0, 0, calArrowsSize, calArrowsSize, calArrowMargin, calArrowsTop);
        else
            calArrowLeft = new innovaphone.ui.Icon(container, innovaphone.ui.CalendarImages.icons, 0, -40, calArrowsSize, calArrowsSize, calArrowMargin - 4, calArrowsTop);
        calArrowLeft.setOnMouseDown(onArrowMouseDown, calArrowLeft);
        calArrowLeft.setOnMouseUp(onArrowMouseUp, calArrowLeft);
        calArrowLeft.setOnMouseEnter(onArrowMouseEnter, calArrowLeft);
        calArrowLeft.setOnMouseLeave(onArrowMouseLeave, calArrowLeft);
        calArrowLeft.addSpriteClass("ijs-sprite-20px");

        if (smallSize)
            calArrowRight = new innovaphone.ui.Icon(container, innovaphone.ui.CalendarImages.icons, 0, -60, calArrowsSize, calArrowsSize, calWidth - calArrowMargin - calArrowsSize, calArrowsTop);
        else
            calArrowRight = new innovaphone.ui.Icon(container, innovaphone.ui.CalendarImages.icons, 0, -20, calArrowsSize, calArrowsSize, calWidth - calArrowMargin - calArrowsSize + 4, calArrowsTop);
        calArrowRight.setOnMouseDown(onArrowMouseDown, calArrowRight);
        calArrowRight.setOnMouseUp(onArrowMouseUp, calArrowRight);
        calArrowRight.setOnMouseEnter(onArrowMouseEnter, calArrowRight);
        calArrowRight.setOnMouseLeave(onArrowMouseLeave, calArrowRight);
        calArrowRight.addSpriteClass("ijs-sprite-20px");

        calMonthButton = new innovaphone.ui.FlatButton(container, "", (calWidth / 2 - calMonthButtonWidth / 2), calMonthButtonTop, calMonthButtonWidth, calMonthButtonHeight);
        calMonthButton.setOnClick(onMonthButtonClick);
        if (smallSize)
            calMonthButton.setFontSize(11);

        for (var i = 0; i < 7; i++) {
            var tmpText = new innovaphone.ui.Text(shortDayNames[i], calDayGridMarginLeft + calDayCellWidth * i + i, calHeaderDayNamesTop, container, calDayCellWidth);
            tmpText.container.style.fontSize = smallSize ? "9px" : "12px";
            tmpText.container.style.cursor = "default";
            tmpText.setCenter();
            if ((firstDayDelta == 0 && i % 7 == 0) || (firstDayDelta == 1 && i % 7 == 6))
                innovaphone.lib.addClass(tmpText.container, "ijs-cal-font-color-sunday");
            innovaphone.lib.setNoSelect(tmpText.container);
            dayNameLabels[i] = tmpText;
        }

        for (i = 0; i < 6; i++) {
            tmpText = document.createElement("div");
            tmpText.style.position = "absolute";
            tmpText.style.left = weekFieldLeftMargin + "px";
            tmpText.style.top = (i + weekFieldTopStart + calDayCellHeigth * i) + "px";
            tmpText.style.height = calDayCellHeigth + "px";
            tmpText.style.width = weekFieldWidth + "px";
            tmpText.style.textAlign = "right";
            tmpText.style.paddingTop = weekFieldTopMargin + "px";
            tmpText.style.fontSize = smallSize ? "9px" : "12px";
            tmpText.style.cursor = "default";
            tmpText.innerHTML = "";
            innovaphone.lib.setNoSelect(tmpText);
            container.appendChild(tmpText);
            weekNumFields[i] = tmpText;
        }

        // Grid with the days
        calDaysGrid = new innovaphone.ui.Grid(calDayGridMarginLeft, calHeaderHeight, calDayCellWidth, calDayCellHeigth, 6, 7, container);
        calDaysGrid.disableCellBoder();
        for (var i = 0; i < 42; i++) {
            dayContainer = calDaysGrid.cells[i].container;

            var tmp = document.createElement("div");
            tmp.style.position = "absolute";
            tmp.style.borderStyle = "solid";
            if (smallSize) {
                tmp.style.left = "0px";
                tmp.style.top = "0px";
                tmp.style.height = calDayCellHeigth - 2 + "px";
                tmp.style.width = calDayCellWidth - 2 + "px";
                tmp.style.borderWidth = "1px"
            }
            else {
                tmp.style.left = "2px";
                tmp.style.top = "2px";
                tmp.style.height = calDayCellHeigth - 8 + "px";
                tmp.style.width = calDayCellWidth - 8 + "px";
                tmp.style.borderWidth = "2px"
                tmp.style.borderRadius = "50%";
            }

            innovaphone.lib.addClass(tmp, "ijs-cal-day-cell-none")
            dayContainer.appendChild(tmp);
            dayCellBackground[i] = tmp;

            // calDayCellPresenceList[i] = new innovaphone.ui.CalendarDayItemIndicator(dayContainer);

            tmp = new innovaphone.ui.Text("", 0, -1, dayContainer, calDayCellWidth);
            tmp.setCenter();
            tmp.container.style.fontSize = smallSize ? "12px" : "18px";
            innovaphone.lib.setNoSelect(tmp.container);
            dayCellText[i] = tmp;
        }

        calDaysGrid.setOnClick(onDayClick);
        calDaysGrid.setOnMouseEnter(onDayCellEnter);
        calDaysGrid.setOnMouseLeave(onDayCellLeave);

        // Footer area
        if (!smallSize) {
            calFooterText = new innovaphone.ui.Text("", calArrowMargin, calHeigth - calFooterHeigth + calFooterTextTopMargin, container, calFooterTextWidth);
            calFooterText.container.style.fontSize = "14px";
            calFooterText.container.style.fontWeight = "bold";
            calFooterText.setText("");
            calFooterText.setOnClick(onSelDateDisplayClick);
            innovaphone.lib.setNoSelect(calFooterText.container);
        }

        // We need to preselect curSelectDay to the grid item for the current day...
        tmpMonthStartDelta = new Date(today.getFullYear(), today.getMonth(), 1).getDay() - firstDayDelta;
        if (tmpMonthStartDelta < 0)
            tmpMonthStartDelta = 0;
        curSelectedCell = tmpMonthStartDelta + today.getDate() - 1;

        if (!smallSize)
            calFooterText.setText(dayNames[today.getDay() % 7] + ", " + today.getDate() + ". " + monthNames[curMonthSel] + " " + curYearSel);

        setUpdateForMonthInYear(curMonthSel, curYearSel);

        function setCircleType(idx, ctype) {
            var theBackGroundCell = dayCellBackground[idx];

            switch (ctype) {
                case CircleType.NONE:
                    theBackGroundCell.className = "ijs-cal-day-cell-none";
                    break;

                case CircleType.SELECTED:
                    if (smallSize)
                        theBackGroundCell.className = "ijs-cal-day-cell-selected-small";
                    else
                        theBackGroundCell.className = "ijs-cal-day-cell-selected";
                    break;

                case CircleType.HOVER:
                    if (smallSize)
                        theBackGroundCell.className = "ijs-cal-day-cell-hover-small";
                    else
                        theBackGroundCell.className = "ijs-cal-day-cell-hover";
                    break;

                case CircleType.CUR_DAY:
                    if (smallSize)
                        theBackGroundCell.className = "ijs-cal-day-cell-cur-day-small";
                    else
                        theBackGroundCell.className = "ijs-cal-day-cell-cur-day";
                    break;

                case CircleType.SELECTED_CUR_DAY:
                    if (smallSize)
                        theBackGroundCell.className = "ijs-cal-day-cell-cur-day-selected-small";
                    else
                        theBackGroundCell.className = "ijs-cal-day-cell-cur-day-selected";
                    break;

                case CircleType.HOVER_CUR_DAY:
                    if (smallSize)
                        theBackGroundCell.className = "ijs-cal-day-cell-cur-day-hover-small";
                    else
                        theBackGroundCell.className = "ijs-cal-day-cell-cur-day-hover";
                    break;
            }
        }

        function setUpdateForMonthInYear(month, year) {
            // Because of setting the day to 0, we need to add 1 to the month to get
            // Correct results.
            var firstDayDate = new Date(year, month, 1);
            numOfDays = new Date(year, month + 1, 0).getDate();
            firstDay = firstDayDate.getDay() - firstDayDelta;
            if (firstDay < 0)
                firstDay = 6;

            var weekNum = getWeekNum(firstDayDate, weekNumType, !sundayIsFirstDay);
            weekNumFields[0].innerHTML = weekNum;
            var weekNumRow = 0;
            if (firstDay == 0) {
                weekNumRow--;
                weekNum--;
            }

            var lastMonthFirstVisibleDay;
            if (month == 0) {
                lastMonthFirstVisibleDay = new Date(year - 1, 12, 0).getDate() - firstDay + 1;
            } else {
                lastMonthFirstVisibleDay = new Date(year, month, 0).getDate() - firstDay + 1;
            }

            var curCell;
            for (var i = 0; i < firstDay; i++) {
                setCircleType(i, CircleType.NONE);

                var curCell = dayCellText[i];
                innovaphone.lib.removeClass(curCell.container, "ijs-cal-font-color-disabled");
                innovaphone.lib.removeClass(curCell.container, "ijs-cal-font-color-sunday");

                curCell.setText(lastMonthFirstVisibleDay);
                lastMonthFirstVisibleDay++;
                
                if ((firstDayDelta == 0 && i % 7 == 0) || (firstDayDelta == 1 && i % 7 == 6))
                    innovaphone.lib.addClass(curCell.container, "ijs-cal-font-color-sunday");
                else
                    innovaphone.lib.addClass(curCell.container, "ijs-cal-font-color-disabled");
                
                calDaysGrid.setCellEnabled(i, false);
            }

            for (var i = firstDay; i < numOfDays + firstDay; i++) {
                var curCell = dayCellText[i];
                cellValue = i - firstDay + 1;
                curCell.setText(cellValue);
                innovaphone.lib.removeClass(curCell.container, "ijs-cal-font-color-disabled");
                innovaphone.lib.removeClass(curCell.container, "ijs-cal-font-color-sunday");

                if (curMonthSel == month && curYearSel == year && curSelectedCell == i)
                    (i - firstDay == today.getDate() - 1 ? setCircleType(i, CircleType.SELECTED_CUR_DAY) : setCircleType(i, CircleType.SELECTED));
                else if (month == today.getMonth() && year == today.getFullYear() && i - firstDay == today.getDate() - 1)
                    setCircleType(i, CircleType.CUR_DAY);
                else
                    setCircleType(i, CircleType.NONE);

                if ((firstDayDelta == 0 && i % 7 == 0) || (firstDayDelta == 1 && i % 7 == 6))
                    innovaphone.lib.addClass(curCell.container, "ijs-cal-font-color-sunday");

                if (i % 7 == 0) {
                    //weekNum = getWeekNum(new Date(year, month, cellValue), weekNumType, !sundayIsFirstDay);

                    if (weekNum == 52)
                        weekNum = getWeekNum(new Date(year, month, cellValue), weekNumType);
                    else if (weekNum == 53)
                        weekNum = 1;
                    else
                        weekNum++;
                    weekNumRow++;
                    weekNumFields[weekNumRow].innerHTML = weekNum;
                }

                calDaysGrid.setCellEnabled(i, true);
            }

            var restStart = firstDay + numOfDays;
            for (i = restStart; i < 42; i++) {
                setCircleType(i, CircleType.NONE);

                var curCell = dayCellText[i];
                cellValue = i - restStart + 1;
                curCell.setText(cellValue);
                innovaphone.lib.removeClass(curCell.container, "ijs-cal-font-color-disabled");
                innovaphone.lib.removeClass(curCell.container, "ijs-cal-font-color-sunday");

                if ((firstDayDelta == 0 && i % 7 == 0) || (firstDayDelta == 1 && i % 7 == 6))
                    innovaphone.lib.addClass(curCell.container, "ijs-cal-font-color-sunday");
                else
                    innovaphone.lib.addClass(curCell.container, "ijs-cal-font-color-disabled");

                if (i % 7 == 0) {
                    if (weekNum == 52)
                        weekNum = getWeekNum(new Date(parseInt(year) + 1, 0, cellValue), weekNumType, !sundayIsFirstDay);
                    else if (weekNum == 53)
                        weekNum = 1;
                    else
                        weekNum++;
 
                    weekNumRow++;
                    weekNumFields[weekNumRow].innerHTML = weekNum;
                }

                calDaysGrid.setCellEnabled(i, false);
            }

            //calMonthButton.innerHTML = monthNames[curMonthDisp] + " " + curYearDisp;
            //calMonthButton.value = monthNames[curMonthDisp] + " " + curYearDisp;
            curMonthDisp = month;
            curYearDisp = year;
            if (smallSize)
                calMonthButton.setText(shortMonthNames[curMonthDisp] + " " + curYearDisp);
            else
                calMonthButton.setText(monthNames[curMonthDisp] + " " + curYearDisp);

            if (onVisMonthChanged && !noDateChangeCallback) {
                onVisMonthChanged(curMonthDisp + 1, curYearDisp, onVisMonthChangedObj);
            }
        }

        function dayCellIsToday(idx) {
            if (curMonthDisp == today.getMonth() && curYearDisp == today.getFullYear() && dayCellText[idx].getText() == today.getDate())
                return true;
            else
                return false;
        }

        function onDocumentMouseUp() {
            calArrowMouseCapture = null;
            document.removeEventListener("mouseup", onDocumentMouseUp);
        }

        function stepMonth(delta) {
            curMonthDisp += delta;
            if (curMonthDisp == -1) {
                curMonthDisp = 11;
                curYearDisp--;
            }
            else if (curMonthDisp == 12) {
                curMonthDisp = 0;
                curYearDisp++;
            }

            setUpdateForMonthInYear(curMonthDisp, curYearDisp);
        }

        function onArrowMouseDown(sender, event) {
            if (event.buttons == 1) {
                calArrowMouseCapture = sender;
                calArrowDelta = sender == calArrowLeft ? - 1 : 1;

                stepMonth(calArrowDelta);
                calArrowTimer = setTimeout(calArrowDownRepeat, 500);
            }
        }

        function onArrowMouseUp(sender, event) {
            calArrowMouseCapture = null;
            clearTimeout(calArrowTimer);
            clearInterval(calArrowInterval);
        }

        function onArrowMouseEnter(sender, event) {
            if (sender == calArrowMouseCapture) {
                document.removeEventListener("mouseup", onDocumentMouseUp);
                stepMonth(calArrowDelta);
                calArrowInterval = setInterval(function () {
                    stepMonth(calArrowDelta);
                }, 100);
            }
        }

        function onArrowMouseLeave(sender, event) {
            if (sender == calArrowMouseCapture) {
                clearTimeout(calArrowTimer);
                clearInterval(calArrowInterval);
                document.addEventListener("mouseup", onDocumentMouseUp);
            }
        }

        function calArrowDownRepeat() {
            stepMonth(calArrowDelta);
            calArrowInterval = setInterval(function () {
                stepMonth(calArrowDelta);
            }, 100);
        }

        function onDayClick(idx) {
            if (curSelectedCell == idx && curMonthDisp == curMonthSel && curYearDisp == curYearSel)
                return;

            if (dayCellIsToday(curSelectedCell))
                setCircleType(curSelectedCell, CircleType.CUR_DAY);
            else
                setCircleType(curSelectedCell, CircleType.NONE);

            curSelectedCell = idx;
            if (dayCellIsToday(curSelectedCell))
                setCircleType(curSelectedCell, CircleType.SELECTED_CUR_DAY);
            else
                setCircleType(curSelectedCell, CircleType.SELECTED);

            curMonthSel = curMonthDisp;
            curYearSel = curYearDisp;
            theDay = dayCellText[idx].getText();

            if (!smallSize)
                calFooterText.setText(dayNames[idx % 7] + ", " + theDay + ". " + monthNames[curMonthSel] + " " + curYearSel);

            if (onSelDayChanged) {
                tmpDate = new Date(curYearSel, curMonthSel, theDay, 0, 0, 0, 0);
                onSelDayChanged(tmpDate, onSelDayChangedObj);
            }
        }

        function onDayCellEnter(idx) {
            if (curMonthSel == curMonthDisp && curYearSel == curYearDisp && idx == curSelectedCell)
                return;

            if (dayCellIsToday(idx))
                setCircleType(idx, CircleType.HOVER_CUR_DAY);
            else
                setCircleType(idx, CircleType.HOVER);
        }

        function onDayCellLeave(idx) {
            if (curMonthSel == curMonthDisp && curYearSel == curYearDisp && idx == curSelectedCell)
                return;

            if (dayCellIsToday(idx))
                setCircleType(idx, CircleType.CUR_DAY);
            else
                setCircleType(idx, CircleType.NONE);
        }

        function onSelDateDisplayClick() {
            if (curMonthSel != curMonthDisp || curYearSel != curYearDisp) {
                curMonthDisp = curMonthSel;
                curYearDisp = curYearSel;
                setUpdateForMonthInYear(curMonthSel, curYearSel);
            }
        }

        function setButtonState(button, stateDown) {
            if (stateDown) {
                button.style.borderBottomWidth = "0px";
                button.style.top = (parseInt(button.style.top, 10) + 1) + "px";
                innovaphone.lib.removeClass(button, "ijs-button-flat");
                innovaphone.lib.addClass(button, "ijs-button-flat-down");
            } else {
                button.style.borderBottomWidth = "1px";
                button.style.top = (parseInt(button.style.top, 10) - 1) + "px";
                innovaphone.lib.removeClass(button, "ijs-button-flat-down");
                innovaphone.lib.addClass(button, "ijs-button-flat");
            }
        }

        function onMonthButtonClick() {
            if (!calMonthYearSelector) {
                calMonthYearSelector = new innovaphone.ui.CalDateYearSelector(shortMonthNames, calWidth / 2, calMonthButtonHeight + 4, container, shortMonthNames, smallSize);
                calMonthYearSelector.setOnSelect(onMonthYearSelect);
            }
            
            calMonthYearSelector.show(curMonthDisp, curYearDisp);
        }

        function onMonthYearSelect(month, year) {
            setUpdateForMonthInYear(month, year);
        }

        function getWeekNum(theDate, calcMethod, firstDayIsMonday) {
            var dateForWeek = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate(), 0, 0, 0, 0);
            var startWeek;
            var weekNum;

            if (calcMethod == "ISO") {
                // ISO weeknumbers has the following definitions:
                //
                // - A week start's with Monday
                // - The first week in the year is the one that have the years first thursday.
                //
                // Because of this, the calculation is simple:
                // - Get the thursday in the week of the given date. The calculation will be done
                //   to the thursday of that week to the first thursday of the year.
                // - The base for the calculation is January the 4th. Because that day ALWAYS will
                //   be in the first week.
                // - Get the date of the thursday in the first week.
                // - Calculate the difference in ms between the given date (changed to the thursday of
                //   that week) to the first thursday of the year.
                // - Divide by thursday to get the number of days. Adjust the number by the day-difference to
                //   the real start of the year (1st of january) and divide the result by 7 (because of 7 days
                //   per week). Round the result to the lowest integer value (Math.floor()).
                // - Finally we only need to add one because the result of the calculation is 0 based.
                //
                // Doing this, the week number of the 1st January and of the last days of december automatically
                // will be calulated right.
                //diff = theDate.getDay() - 1;
                //dateForWeek.setDate(dateForWeek.getDate() + 3 - (diff != -1 ? diff : 6));

                // 4 - theDate.getDay() == 3 - theDAte.getDay() - 1
                //    3  --> The difference from Monday (1) to thursday (4)
                //   -1  --> Make the result of getDay() monday-based (0 = monday, 6 = sunday). For this we need
                //           to check the result if the calculation (see diff == 4 ? -3 : diff).
                //
                // The result of the calculation added to the date will give us the next thursday in that week. :-)
                diff = 4 - dateForWeek.getDay();
                dateForWeek.setDate(dateForWeek.getDate() + (diff == 4 ? -3 : diff));

                startWeek = new Date(dateForWeek.getFullYear(), 0, 4, 0, 0, 0, 0);
                diff = -4 + startWeek.getDay();
                weekNum = Math.floor((((dateForWeek - startWeek) / 86400000) + (diff == -4 ? 3 : diff)) / 7) + 1;
            }
            else if (calcMethod == "1JAN") {
                dayDelta = (firstDayIsMonday ? 1 : 0);
                if (dateForWeek.getMonth() == 11 && (dateForWeek.getDate() + dayDelta + 6 - dateForWeek.getDay()) > 31)
                    weekNum = 1;
                else {
                    startWeek = new Date(dateForWeek.getFullYear(), 0, 1, 0, 0, 0, 0);
                    yearsFirstDay = startWeek.getDay() - dayDelta;
                    weekNum = Math.floor((((dateForWeek - startWeek) / 86400000) + (yearsFirstDay == -1 ? 6 : yearsFirstDay)) / 7) + 1;
                }
            }
            else if (calcMethod == "1WEEK") {
                firstWeekDay = (firstDayIsMonday ? 1 : 0);
                startDay = dateForWeek.getDay() - firstWeekDay;
                if (startDay == -1)
                    startDay = 7;

                dateForWeek.setDate(dateForWeek.getDate() - startDay + firstWeekDay);
                startWeek = new Date(dateForWeek.getFullYear(), 0, 1, 0, 0, 0, 0);
                dayDiff = 7 - startWeek.getDay() + firstWeekDay;
                if (dayDiff > 6)
                    dayDiff -= 7;
                startWeek.setDate(startWeek.getDate() + dayDiff);
                weekNum = Math.floor(((dateForWeek - startWeek) / 86400000) / 7) + 1;
            }

            delete dateForWeek;
            delete startWeek;
            return weekNum;
        }


        // Public interface
        this.container = container;

        this.setOnVisibleMonthChanged = function (onVisMonthChangedFnc, obj) {
            onVisMonthChanged = onVisMonthChangedFnc;
            onVisMonthChangedObj = obj;
        }

        this.setOnSelectedDayChanged = function(onSelDayChangedFnc, obj) {
            onSelDayChanged = onSelDayChangedFnc;
            onSelDayChangedObj = obj;
        }

        this.setDate = function(theDate) {
            // Make sure that the date / year selector is not visible...
            if (calMonthYearSelector)
                calMonthYearSelector.hide();

            curMonthSel = theDate.getMonth();
            curYearSel = theDate.getFullYear();
           
            tmpMonthStartDelta = new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay() - firstDayDelta;
            if (tmpMonthStartDelta < 0)
                tmpMonthStartDelta = 0;
            curSelectedCell = tmpMonthStartDelta + theDate.getDate() - 1;

            noDateChangeCallback = true;
            setUpdateForMonthInYear(theDate.getMonth(), theDate.getFullYear());
            noDateChangeCallback = false;


            if (!smallSize)
                calFooterText.setText(dayNames[theDate.getDay() % 7] + ", " + theDate.getDate() + ". " + monthNames[curMonthSel] + " " + curYearSel);
        }


        this.setDisplayOptions = function(weekNumDisplayType, weekStartWithSunday)
        {
            weekNumType = weekNumDisplayType;
            if (weekNumType == "ISO")
                weekStartWithSunday = false;

            if (weekStartWithSunday != sundayIsFirstDay) {
                if (weekStartWithSunday) {
                    shortDayNames = [strings.daySundayShort, strings.dayMondayShort, strings.dayTuesdayShort, strings.dayWednesdayShort,
                                     strings.dayThursdayShort, strings.dayFridayShort, strings.daySaturdayShort];
                    dayNames = [strings.daySunday, strings.dayMonday, strings.dayTuesday, strings.dayWednesday,
                                strings.dayThursday, strings.dayFriday, strings.daySaturday];
                    sundayIsFirstDay = true;
                    firstDayDelta = 0;
                    innovaphone.lib.addClass(dayNameLabels[0].container, "ijs-cal-font-color-sunday");
                    innovaphone.lib.removeClass(dayNameLabels[6].container, "ijs-cal-font-color-sunday");
                } else {
                    shortDayNames = [strings.dayMondayShort, strings.dayTuesdayShort, strings.dayWednesdayShort,
                                     strings.dayThursdayShort, strings.dayFridayShort, strings.daySaturdayShort, strings.daySundayShort];
                    dayNames = [strings.dayMonday, strings.dayTuesday, strings.dayWednesday,
                                strings.dayThursday, strings.dayFriday, strings.daySaturday, strings.daySunday];
                    sundayIsFirstDay = false;
                    firstDayDelta = 1;
                    innovaphone.lib.addClass(dayNameLabels[6].container, "ijs-cal-font-color-sunday");
                    innovaphone.lib.removeClass(dayNameLabels[0].container, "ijs-cal-font-color-sunday");
                }

                for (i = 0; i < 7; ++i)
                    dayNameLabels[i].setText(shortDayNames[i]);
            }

            setUpdateForMonthInYear(curMonthSel, curYearSel);
        }

        this.setBorder = function(borderWidth)
        {
            if (borderWidth == 0)
                container.style.border = "none";
            else
                container.style.border = borderWidth + "px solid black";
        }

        this.dayOneCellIndex = function()
        {
            return firstDay;
        }

        this.curMonthNumOfDays = function()
        {
            return numOfDays;
        }

        this.getDayCell = function(idx)
        {
            return calDaysGrid.cells[idx].container;
        }

    } return Calendar;
}());
