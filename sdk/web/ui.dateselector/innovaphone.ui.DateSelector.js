
/// <reference path="~/sdk/web/lib/innovaphone.lib.js" />
/// <reference path="~/calendar/app/innovaphone.ui.Calendar.js" />
/// <reference path="~/calendar/app/innovaphone.ui.BubbleContainer.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.DateSelectorResources = innovaphone.ui.DateSelectorResources || function (onload) {
    innovaphone.lib.loadObjectScripts(
        ["web/lib/innovaphone.lib",
         "web/ui.bubblecontainer/innovaphone.ui.BubbleContainer",
         "web/ui.calendar/innovaphone.ui.Calendar",
        ], function () {
            innovaphone.ui.DateSelectorResourcesLoaded = true;
            onload();
        });
};

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.DateSelector = innovaphone.ui.DateSelector || (function () {
    function DateSelector(left, top, parent, weekNumType, sundayIsFirstDay, strings) {
        var instance = this,
            container = null,
            fieldDayName = null,
            fieldDay = null,
            fieldMonth = null,
            fieldYear = null,
            curSelectedField = null,
            calendarContainer = null,
            calendar = null,
            isMouseOverCalendar = false,
            calHasFocus = false,

            isFocused = false,
            isTabDown = false,
            isShiftDown = false,
            diCount = 0,
            miCount = 0,
            yiCount = 0,
            inputTimer = null,
            needValidate = false,

            selectedDate = null,
            onDateChanged = null,
            onDateChangedObj = null;


        CAL_WIDTH = 180;
        CAL_HEIGHT = 150;
        shortMonthNames = [strings.monthJanuaryShort, strings.monthFebruaryShort, strings.monthMarchShort, strings.monthAprilShort,
                           strings.monthMayShort, strings.monthJuneShort, strings.monthJulyShort, strings.monthAugustShort,
                           strings.monthSeptemberShort, strings.monthOctoberShort, strings.monthNovemberShort, strings.monthDecemberShort];

        shortDayNames = [strings.daySundayShort, strings.dayMondayShort, strings.dayTuesdayShort, strings.dayWednesdayShort,
                         strings.dayThursdayShort, strings.dayFridayShort, strings.daySaturdayShort];


        theWidth = 120;
        dropDownButtonWidth = 15;

        container = document.createElement("div");
        container.tabIndex = "0";
        container.style.color = "black";
        container.style.position = "absolute";
        container.style.left = left + "px";
        container.style.top = top + "px";
        container.style.width = theWidth + "px";
        container.style.height = "22px";
        container.style.borderWidth = "1px";
        container.style.borderStyle = "solid";
        container.style.fontSize = "14px";
        container.style.boxSizing = "border-box";
        container.className = "ijs-dropdown-activator";
        container.onfocus = onFocus;
        container.onkeydown = onKeyDown;
        container.onkeypress = onKeyPress;
        container.onblur = onLostFocus;
        container.onmouseover = onMouseOver;
        container.onmouseout = onMouseOut;
        container.onmousedown = onMouseDown;
        innovaphone.lib.setNoSelect(container);

        curFieldPos = 2;
        fieldDayName = document.createElement("span");
        fieldDayName.style.position = "absolute";
        fieldDayName.style.left = curFieldPos + "px";
        fieldDayName.style.top = "0px";
        fieldDayName.style.width = "29px";
        fieldDayName.style.height = "18px";
        fieldDayName.style.fontSize = "14px";
        fieldDayName.innerHTML = "";
        container.appendChild(fieldDayName);

        curFieldPos += 29;
        createDayField(curFieldPos);

        curFieldPos += 17;
        createSeperator(curFieldPos);

        curFieldPos += 6;
        createMonthField(curFieldPos);

        curFieldPos += 17;
        createSeperator(curFieldPos);

        curFieldPos += 6;
        createYearField(curFieldPos);


        document.addEventListener("keydown", onDocumentKeyDown);
        document.addEventListener("keyup", onDocumentKeyUp);

        setDate(new Date());

        if (parent)
            parent.appendChild(container);

        // Functions
        function createDayField(leftPos)
        {
            tmp = document.createElement("div");
            tmp.style.position = "absolute";
            tmp.style.left = leftPos + "px";
            tmp.style.top = "1px";
            tmp.style.width = "17px";
            tmp.style.height = "18px";
            container.appendChild(tmp);

            fieldDay = document.createElement("div");
            fieldDay.style.position = "absolute";
            fieldDay.style.left = "-1px";
            fieldDay.style.top = "-1px";
            fieldDay.style.width = "18px";
            fieldDay.style.height = "18px";
            fieldDay.style.fontSize = "14px";
            fieldDay.style.textAlign = "right";
            fieldDay.style.paddingRight = "15px";
            tmp.appendChild(fieldDay);
        }

        function createMonthField(leftPos)
        {
            tmp = document.createElement("div");
            tmp.style.position = "absolute";
            tmp.style.left = leftPos + "px";
            tmp.style.top = "1px";
            tmp.style.width = "16px";
            tmp.style.height = "18px";
            container.appendChild(tmp);

            fieldMonth = document.createElement("div");
            fieldMonth.style.position = "absolute";
            fieldMonth.style.left = "0px";
            fieldMonth.style.top = "-1px";
            fieldMonth.style.width = "16px";
            fieldMonth.style.height = "18px";
            fieldMonth.style.fontSize = "14px";
            fieldMonth.style.textAlign = "right";
            fieldMonth.style.paddingRight = "2px";
            tmp.appendChild(fieldMonth);
        }

        function createYearField(leftPos)
        {
            tmp = document.createElement("div");
            tmp.style.position = "absolute";
            tmp.style.left = leftPos + "px";
            tmp.style.top = "1px";
            tmp.style.width = "32px";
            tmp.style.height = "18px";
            container.appendChild(tmp);

            fieldYear = document.createElement("div");
            fieldYear.style.position = "absolute";
            fieldYear.style.left = "0px";
            fieldYear.style.top = "-1px";
            fieldYear.style.width = "32px";
            fieldYear.style.height = "18px";
            fieldYear.style.fontSize = "14px";
            fieldYear.style.textAlign = "right";
            fieldYear.style.paddingRight = "2px";
            tmp.appendChild(fieldYear);
        }

        function createSeperator(leftPos)
        {
            tmp = document.createElement("div");
            tmp.style.position = "absolute";
            tmp.style.left = leftPos + "px";
            tmp.style.top = "0px";
            tmp.style.width = "6px";
            tmp.style.height = "18px";
            tmp.style.fontSize = "14px";
            tmp.style.textAlign = "center";
            tmp.innerHTML = "/";
            container.appendChild(tmp);
        }

        function showCalendar()
        {
            if (!calendarContainer) {
                bcLeft = left + (theWidth / 2 - CAL_WIDTH / 2);
                calendarContainer = new innovaphone.ui.BubbleContainer(bcLeft, top + 23, CAL_WIDTH, CAL_HEIGHT + 16, parent);
                calendarContainer.setArrow(15, 50, "top");
                calendarContainer.setOnMouseEnter(onCalAreaMouseEnter);
                calendarContainer.setOnMouseLeave(onCalAreaMouseLeave);

                calendar = new innovaphone.ui.Calendar(0, 1, strings, true, weekNumType, sundayIsFirstDay);
                calendar.setOnSelectedDayChanged(onCalendarSelctedDayChanged);
                calendarContainer.container.appendChild(calendar.container);
            }
            else {
                // calendar.setDate()
                calendarContainer.show();
            }
        }

        function hideCalendar()
        {
            calHasFocus = false;
            document.removeEventListener("mousedown", onDocumentMouseDown);
            calendarContainer.hide();
        }

        function onCalAreaMouseEnter(obj)
        {
            isMouseOverCalendar = true;
            if (calHasFocus)
                document.removeEventListener("mousedown", onDocumentMouseDown);
        }

        function onCalAreaMouseLeave(obj)
        {
            isMouseOverCalendar = false;
            if (calHasFocus)
                document.addEventListener("mousedown", onDocumentMouseDown);
        }


        function setDate(theDate)
        {
            delete selectedDate;
            selectedDate = new Date(theDate);
            selectedDate.setHours(0, 0, 0, 0);

            fieldDayName.innerHTML = shortDayNames[selectedDate.getDay()] + ",";
            tmp = selectedDate.getDate();
            fieldDay.innerHTML = tmp < 10 ? "0" + tmp : tmp;
            tmp = selectedDate.getMonth() + 1;
            fieldMonth.innerHTML = tmp < 10 ? "0" + tmp : tmp;
            fieldYear.innerHTML = selectedDate.getFullYear();

            needValidate = false;
        }

        function doFocusControl()
        {
            isFocused = true;
            innovaphone.lib.addClass(curSelectedField.parentElement, "ijs-date-time-focus");
            innovaphone.lib.addClass(container, "ijs-hover");
            showCalendar();
            container.focus();
        }

        function deFocusControl()
        {
            isFocused = false;
            hideCalendar();
            innovaphone.lib.removeClass(curSelectedField.parentElement, "ijs-date-time-focus");
            innovaphone.lib.removeClass(container, "ijs-hover");
            curSelectedField = null;
            hideCalendar();
            if (needValidate)
                validateFields();
        }

        function switchField(keyCode, shiftIsDown)
        {
            // NOTE: keyCode 37 = cursor left, keyCode 39 = cursor right
            oldField = curSelectedField;
            if (curSelectedField == fieldDay) {
                if ((keyCode == 9 && shiftIsDown) || keyCode == 37)
                    oldField = null; // We will leave the control
                else
                    curSelectedField = fieldMonth;
            }
            else if (curSelectedField == fieldMonth) {
                if (!shiftIsDown && keyCode != 37)
                    curSelectedField = fieldYear;
                else if (keyCode == 9 || keyCode == 37)
                    curSelectedField = fieldDay;
                else
                    oldField = null;
            }
            else { // Year
                if (keyCode == 37)
                    curSelectedField = fieldMonth;
                else if (keyCode == 9) {
                    if (shiftIsDown)
                        curSelectedField = fieldMonth;
                    else
                        oldField = null;
                }
            }

            if (oldField) {
                innovaphone.lib.removeClass(oldField.parentElement, "ijs-date-time-focus");
                innovaphone.lib.addClass(curSelectedField.parentElement, "ijs-date-time-focus");
                if (needValidate)
                    validateFields();
                return true;
            }
            else
                return false;
        }

        function onDocumentKeyDown(event)
        {
            if (event.keyCode == 9) {
                isTabDown = true;
                isShiftDown = event.shiftKey;

                if (calHasFocus) {
                    curSelectedField = isShiftDown ? fieldDay : fieldYear;
                    hideCalendar();
                    container.focus();
                }
            }
            if (calHasFocus && (event.keyCode == 32 || event.keyCode == 27)) {
                hideCalendar();
                innovaphone.lib.addClass(curSelectedField.parentElement, "ijs-date-time-focus");
                container.focus();
            }
        }

        function onDocumentKeyUp(event) {
            if (event.keyCode == 9) {
                isTabDown = false;
                isShiftDown = false;
            }
        }

        function onDocumentMouseDown() {
            deFocusControl();
        }

        function onFocus(event) {
            if (!isFocused && isTabDown) {
                curSelectedField = isShiftDown ? fieldYear : fieldDay;
                doFocusControl();
            }
        }

        function onLostFocus(event) {
            if (isFocused) {
                if (isMouseOverCalendar && !isTabDown) {
                    calHasFocus = true;
                    innovaphone.lib.removeClass(curSelectedField.parentElement, "ijs-date-time-focus");
                }
                else
                    deFocusControl();
            }
        }

        function onKeyDown(event) 
        {
            switch (event.keyCode)
            {
                case 9:
                    if (switchField(event.keyCode, event.shiftKey))
                        event.preventDefault();
                    break;

                case 27: // ESC
                    hideCalendar();
                    break;

                case 32: // Space
                    if (calendarContainer.isVisible())
                        hideCalendar();
                    else
                        showCalendar();
                    break;

                case 40: // Cursor down
                    showCalendar();
                    break;

                case 37:  // Cursor left
                case 39:  // Cursor right
                case 55:  // '/'
                case 110: // ',' on number block
                case 111: // '/' on number block
                case 188: // ','
                case 190: // '.'
                    switchField(event.keyCode, false);
                    break;
            }
        }

        function onMouseOver() {
            if (calHasFocus)
                document.removeEventListener("mousedown", onDocumentMouseDown);
        }

        function onMouseOut() {
            if (calHasFocus)
                document.addEventListener("mousedown", onDocumentMouseDown);
        }

        function onMouseDown(event) {
            theX = event.pageX;
            tmpField = null;
            if (theX >= fieldYear.getBoundingClientRect().left)
                tmpField = fieldYear;
            else if (theX >= fieldMonth.getBoundingClientRect().left)
                tmpField = fieldMonth;
            else
                tmpField = fieldDay;

            if (!isFocused) {
                curSelectedField = tmpField;
                doFocusControl();
            }
            else {
                innovaphone.lib.removeClass(curSelectedField.parentElement, "ijs-date-time-focus");
                curSelectedField = tmpField;
                innovaphone.lib.addClass(curSelectedField.parentElement, "ijs-date-time-focus")
                if (needValidate)
                    validateFields();
            }
        }
        
        function onKeyPress(event)
        {
            theNum = parseInt(event.key);
            if (theNum >= 0 && theNum <= 9) {
                if (inputTimer) {
                    clearTimeout(inputTimer);
                    inputTimer = null;
                }
                needValidate = true;
                switch (curSelectedField) {
                    case fieldDay:
                        if (diCount == 0) {
                            if (theNum > 3) {
                                fieldDay.innerHTML = "0" + theNum;
                                validateFields();
                            }
                            else {
                                fieldDay.innerHTML = theNum;
                                diCount = 1;
                                inputTimer = setTimeout(onInputTimeOut, 900);
                            }
                        }
                        else {
                            fieldDay.innerHTML = fieldDay.innerHTML[0] + theNum;
                            validateFields();
                        }
                        break;

                    case fieldMonth:
                        if (miCount == 0) {
                            if (theNum > 1) {
                                fieldMonth.innerHTML = "0" + theNum;
                                validateFields();
                            }
                            else {
                                fieldMonth.innerHTML = theNum;
                                miCount = 1;
                                inputTimer = setTimeout(onInputTimeOut, 900);
                            }
                        }
                        else {
                            if (fieldMonth.innerHTML[0] == "1" && theNum > 2)
                                fieldMonth.innerHTML = "12";
                            else
                                fieldMonth.innerHTML = fieldMonth.innerHTML[0] + theNum;
                            validateFields();
                        }
                        break;

                    default: // fieldYear
                        if (yiCount == 0) {
                            fieldYear.innerHTML = theNum;
                            yiCount++;
                        }
                        else {
                            fieldYear.innerHTML += theNum;
                            yiCount++;
                            inputTimer = setTimeout(onInputTimeOut, 900);
                        }

                        if (yiCount == 4)
                            validateFields();
                        break;
                }

                if (curSelectedField == fieldDay) {
                }
            }

        }

        function onInputTimeOut()
        {
            validateFields();
        }

        function validateFields()
        {
            needValidate = false;
            diCount = 0;
            miCount = 0;
            yiCount = 0;

            if (inputTimer) {
                clearTimeout(inputTimer);
                inputTimer = null;
            }

            theYear = parseInt(fieldYear.innerHTML);
            if (theYear < 1000) {
                theYear += theYear < 32 ? 2000 : 1900;
                fieldYear.innerHTML = theYear;
            }

            theMonth = parseInt(fieldMonth.innerHTML);
            if (theMonth < 10)
                fieldMonth.innerHTML = "0" + theMonth;

            theDayMax = (new Date(theYear, theMonth, 0)).getDate();
            theDay = parseInt(fieldDay.innerHTML);
            if (theDay > theDayMax) {
                fieldDay.innerHTML = (theDayMax);
                theDay = theDayMax;
            }
            else if (theDay < 10)
                fieldDay.innerHTML = "0" + theDay;
            
            delete selectedDate;
            selectedDate = new Date(theYear, theMonth - 1, theDay, 0, 0, 0, 0);
            theDayIdx = selectedDate.getDay();
            fieldDayName.innerHTML = shortDayNames[theDayIdx] + ",";
            if (calendarContainer.isVisible())
                calendar.setDate(selectedDate);

            if (onDateChanged)
                onDateChanged(selectedDate, onDateChangedObj);
        }

        function onCalendarSelctedDayChanged(newDate) {
            day = newDate.getDate();
            month = newDate.getMonth() + 1;
            year = newDate.getFullYear();

            fieldDay.innerHTML = day < 10 ? "0" + day : day;
            fieldMonth.innerHTML = month < 10 ? "0" + month : month;
            fieldYear.innerHTML = year;

            delete selectedDate;
            selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);
            theDayIdx = selectedDate.getDay();
            fieldDayName.innerHTML = shortDayNames[theDayIdx] + ",";

            if (onDateChanged)
                onDateChanged(selectedDate, onDateChangedObj);
        }

        // Public interface
        this.container = container;
        this.setDate = setDate;

        this.getDate = function (theDate) {
            return selectedDate;
        }

        this.setOnDateChanged = function (theDateChangedFnc, obj) {
            onDateChanged = theDateChangedFnc;
            onDateChangedObj = obj;
        }
    }

    return DateSelector;
}());
