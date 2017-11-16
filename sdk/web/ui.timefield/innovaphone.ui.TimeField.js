
/// <reference path="~/web/js/innovaphone.lib.js" />
/// <reference path="~/web/js/innovaphone.ui.Icon.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.TimeFieldResources = innovaphone.ui.TimeFieldResources || function (onload) {
    innovaphone.lib.loadObjectScripts(
        ["web/lib/innovaphone.lib",
         "web/ui.listview/innovaphone.ui.ListView"], function () {
            innovaphone.ui.TimeFieldResourcesLoaded = true;
            onload();
        });
};

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.TimeField = innovaphone.ui.TimeField || (function () {
    function TimeField(left, top, parent) {
        var FIELD_NONE = 0,
            FIELD_HOURES = 1,
            FIELD_MINUTES = 2,
            instance = this,
            container = null,
            hourField = null,
            hourFieldBack = null,
            minuteField = null,
            minuteFieldBack = null,
            dropdownArrowArea = null,
            dropdownArrow = null,
            dropdownField = null,
            dropdownTimeList = null,
            activeField = FIELD_NONE,
            lastActiveField = FIELD_NONE,
            isFocused = false,
            isEnabled = true,
            isDropDownVisible = false,
            isMouseOverDropDown = false,
            hourKeyPressCount = 0,
            minuteKeyPressCount = 0,
            isTabDown = false,
            isShiftDown = false,
            lastTimeSelId = null,
            onTimeChangedFnc = null,
            onTimeChangedFncObj = null,
            inputTimer = 0;

        TIME_FIELD_WIDTH = 54;
        TIME_FIELD_HEIGHT = 20;

        container = document.createElement("div");
        container.tabIndex = "0";
        container.style.position = "absolute";
        container.style.left = left + "px";
        container.style.top = top + "px";
        container.style.width = TIME_FIELD_WIDTH + "px";
        container.style.height = TIME_FIELD_HEIGHT + "px";
        container.style.borderWidth = "1px";
        container.style.borderStyle = "solid";
        container.style.color = "black";
        container.style.fontSize = "14px";
        container.className = "ijs-dropdown-activator";

        hourFieldBack = document.createElement("div");
        hourFieldBack.style.position = "absolute";
        hourFieldBack.style.left = "1px";
        hourFieldBack.style.top = "1px";
        hourFieldBack.style.width = "16px";
        hourFieldBack.style.height = "18px";
        container.appendChild(hourFieldBack);

        hourField = document.createElement("div");
        hourField.style.position = "absolute";
        hourField.style.left = "0px";
        hourField.style.top = "-1px";
        hourField.style.width = "16px";
        hourField.style.height = "18px";
        hourField.innerHTML = "00";
        hourFieldBack.appendChild(hourField);

        colonField = document.createElement("div");
        colonField.style.position = "absolute";
        colonField.style.top = "0px";
        colonField.style.left = "17px";
        colonField.style.height = "18px";
        colonField.style.width = "3px";
        colonField.style.marginTop = "-1px";
        colonField.innerHTML = ":";
        container.appendChild(colonField);

        minuteFieldBack = document.createElement("div");
        minuteFieldBack.style.position = "absolute";
        minuteFieldBack.style.left = "20px";
        minuteFieldBack.style.top = "1px";
        minuteFieldBack.style.width = "16px";
        minuteFieldBack.style.height = "18px";
        container.appendChild(minuteFieldBack);

        minuteField = document.createElement("div");
        minuteField.style.position = "absolute";
        minuteField.style.left = "0px";
        minuteField.style.top = "-1px";
        minuteField.style.width = "17px";
        minuteField.style.height = "18px";
        minuteField.innerHTML = "00";
        minuteFieldBack.appendChild(minuteField);

        dropdownArrowArea = document.createElement("div");
        dropdownArrowArea.style.position = "absolute";
        dropdownArrowArea.style.right = "0px";
        dropdownArrowArea.style.top = "0px";
        dropdownArrowArea.style.width = "15px";
        dropdownArrowArea.style.height = "20px";
        dropdownArrowArea.style.borderLeftStyle = "solid";
        dropdownArrowArea.style.borderLeftWidth = "1px";
        dropdownArrowArea.className = "ijs-dropdown-activator-icon-outer";
        container.appendChild(dropdownArrowArea);

        dropdownArrow = document.createElement("div");
        dropdownArrow.style.position = "absolute";
        dropdownArrow.style.top = "7px";
        dropdownArrow.style.right = "4px";
        dropdownArrow.style.height = "7px";
        dropdownArrow.style.width = "7px";
        dropdownArrow.className = "ijs-dropdown-activator-icon";
        dropdownArrowArea.appendChild(dropdownArrow);

        container.onfocus = onFocus;
        container.onblur = onLostFocus;
        container.onkeydown = onKeyDown;
        container.onkeypress = onKeyPress;
        container.onmousedown = onMouseDown;
        container.onmouseenter = onMouseEnter;

        document.addEventListener("keydown", onDocumentKeyDown);
        document.addEventListener("keyup", onDocumentKeyUp);

        if (parent)
            parent.appendChild(container);

        // Function start
        function doFocusControl()
        {
            isFocused = true;
            if (activeField == FIELD_HOURES) {
                innovaphone.lib.addClass(hourFieldBack, "ijs-date-time-focus");
                lastActiveField = activeField;
            }
            else if (activeField == FIELD_MINUTES) {
                innovaphone.lib.addClass(minuteFieldBack, "ijs-date-time-focus");
                lastActiveField = activeField;
            }
            else
                lastActiveField = FIELD_NONE;

            isFocused = true;
            innovaphone.lib.addClass(container, "ijs-hover");
            container.focus();
        }

        function deFocusControl()
        {
            isFocused = false;
            lastActiveField = activeField = FIELD_NONE;
            innovaphone.lib.removeClass(hourFieldBack, "ijs-date-time-focus");
            innovaphone.lib.removeClass(minuteFieldBack, "ijs-date-time-focus");
            innovaphone.lib.removeClass(container, "ijs-hover");
            hideDropDownField();

            if (hourKeyPressCount != 0 || minuteKeyPressCount != 0)
                resetInputCounters();
        }

        function onDocumentKeyDown(event) {
            if (event.keyCode == 9) {
                isTabDown = true;
                isShiftDown = event.shiftKey;
            }
        }

        function onDocumentKeyUp(event) {
            if (event.keyCode == 9) {
                isTabDown = false;
                isShiftDown = false;
            }
        }

        function onDocumentMouseDown(event)
        {
            hideDropDownField();
        }

        function onMouseEnter()
        {
            if (isDropDownVisible)
                document.removeEventListener("mousedown", onDocumentMouseDown);
        }

        function onMouseDown(event)
        {
            if (event.pageX >= dropdownArrowArea.getBoundingClientRect().left) {
                if (isDropDownVisible) {
                    hideDropDownField();
                }
                else {
                    if (!isFocused)
                        doFocusControl();
                    showDropDownField();
                }
            }
            else {
                hideDropDownField(true);
                clickedFieldNum = (event.pageX >= minuteFieldBack.getBoundingClientRect().left ? FIELD_MINUTES : FIELD_HOURES);
                if (!isFocused) {
                    activeField = clickedFieldNum;
                    doFocusControl();
                }
                else {
                    if (activeField != clickedFieldNum)
                        setActiveField(clickedFieldNum);
                }
            }
        }

        function onFocus(event)
        {
            if (!isFocused && isTabDown) {
                hourKeyPressCount = minuteKeyPressCount = 0;
                activeField = isShiftDown ? FIELD_MINUTES : FIELD_HOURES;
                doFocusControl();
            }
        }

        function onLostFocus(event)
        {
            if (isMouseOverDropDown)
                setActiveField(FIELD_NONE);
            else if (isFocused)
                deFocusControl();
        }

        function onKeyDown(event)
        {
            switch (event.keyCode)
            {
                case 9:
                    if (event.shiftKey && activeField == FIELD_MINUTES) {
                        setActiveField(FIELD_HOURES);
                        event.preventDefault();
                    }
                    else if (!event.shiftKey && activeField == FIELD_HOURES) {
                        setActiveField(FIELD_MINUTES);
                        event.preventDefault();
                    }
                    else {
                        // Make sure that the drop down will be hidden...
                        isMouseOverDropDown = false;
                    }
                    resetInputCounters();
                    break;

                case 27: //ESC key
                    hideDropDownField();
                    break;

                case 37: // left arrow key
                    //if (event.currentTarget.dataset.activeField != FIELD_HOURES) {
                    if (activeField != FIELD_HOURES)
                        setActiveField(FIELD_HOURES);
                    return false;

                case 39: // right arrow key
                    if (activeField != FIELD_MINUTES)
                        setActiveField(FIELD_MINUTES);
                    return false;

                case 40: // down arrow key
                    showDropDownField();
                    break;
            }

            return true;
        }

        function onKeyPress(event) {
            theNumPressed = parseInt(event.key);
            if (activeField == FIELD_HOURES && (event.key == '.' || event.key == ':')) {
                resetInputCounters();
                innovaphone.lib.removeClass(hourFieldBack, "ijs-date-time-focus");
                innovaphone.lib.addClass(minuteFieldBack, "ijs-date-time-focus");
                activeField = FIELD_MINUTES;
            }
            else {
                if (theNumPressed >= 0 && theNumPressed < 10) {
                    if (activeField == FIELD_HOURES) {
                        if (hourKeyPressCount == 0) {
                            inputTimer = setTimeout(onInputTimeOut, 900);
                            hourField.innerHTML = "0" + theNumPressed;
                            hourKeyPressCount++;
                        }
                        else {
                            tmp = parseInt(hourField.innerHTML) * 10 + theNumPressed;
                            if (tmp > 23)
                                hourField.innerHTML = "23";
                            else
                                hourField.innerHTML = (tmp < 10 ? "0" + tmp : tmp);
                            resetInputCounters();
                        }
                    }
                    else { // activeField == FIELD_MINUTES
                        if (minuteKeyPressCount == 0) {
                            inputTimer = setTimeout(onInputTimeOut, 900);
                            minuteField.innerHTML = "0" + theNumPressed;
                            minuteKeyPressCount++;
                        }
                        else {
                            tmp = parseInt(minuteField.innerHTML) * 10 + theNumPressed;
                            if (tmp > 59)
                                minuteField.innerHTML = "59";
                            else
                                minuteField.innerHTML = (tmp < 10 ? "0" + tmp : tmp);
                            resetInputCounters();
                        }
                    }
                }
            }
        }

        function onTimeListChanged(id)
        {
            minutes = 0;

            selId = dropdownTimeList.selectedId();
            if (!selId) {
                selId = lastTimeSelId;
                dropdownTimeList.selectId(lastTimeSelId);
            }
            else
                lastTimeSelId = selId;

            if (selId > 23) {
                minuteField.innerHTML = "30";
                selId = selId - 24;
                minutes = 30;
            }
            else
                minuteField.innerHTML = "00";

            hourField.innerHTML = (selId < 10 ? "0" : "") + selId;
            hideDropDownField(true);
            doFocusControl();

            if (onTimeChangedFnc) {
                tmpDate = new Date();
                tmpDate.setHours(selId);
                tmpDate.setMinutes(minutes);
                tmpDate.setSeconds(0);
                tmpDate.setMilliseconds(0);
                onTimeChangedFnc(tmpDate, onTimeChangedFncObj);
            }
        }

        function onDropDownFieldMouseEnter()
        {
            isMouseOverDropDown = true;
            document.removeEventListener("mousedown", onDocumentMouseDown);
        }

        function onInputTimeOut()
        {
            resetInputCounters();
        }

        function onDropDownFieldMouseLeave() {
            if (isDropDownVisible) {
                isMouseOverDropDown = false;
                document.addEventListener("mousedown", onDocumentMouseDown);
            }
        }

        function resetInputCounters()
        {
            hourKeyPressCount = 0;
            minuteKeyPressCount = 0;
            clearTimeout(inputTimer);

            if (onTimeChangedFnc) {
                tmpDate = new Date();
                tmpDate.setHours(hourField.innerHTML);
                tmpDate.setMinutes(minuteField.innerHTML);
                tmpDate.setSeconds(0);
                tmpDate.setMilliseconds(0);
                onTimeChangedFnc(tmpDate, onTimeChangedFncObj);
            }
        }

        function setActiveField(newField) {
            switch (newField)
            {
                case FIELD_MINUTES:
                    innovaphone.lib.removeClass(hourFieldBack, "ijs-date-time-focus");
                    innovaphone.lib.addClass(minuteFieldBack, "ijs-date-time-focus");
                    break;

                case FIELD_HOURES:
                    innovaphone.lib.removeClass(minuteFieldBack, "ijs-date-time-focus");
                    innovaphone.lib.addClass(hourFieldBack, "ijs-date-time-focus");
                    break;

                default: // FIELD_NONE
                    innovaphone.lib.removeClass(hourFieldBack, "ijs-date-time-focus");
                    innovaphone.lib.removeClass(minuteFieldBack, "ijs-date-time-focus");
            }

            activeField = newField;
        }
        
        function hideDropDownField(noSelectField)
        {
            if (isDropDownVisible) {
                document.removeEventListener("mousedown", onDocumentMouseDown);
                isDropDownVisible = false;
                isMouseOverDropDown = false;
                dropdownField.style.display = "none";
                if (noSelectField)
                    activeField = lastActiveField;
                else
                    setActiveField(lastActiveField);
            }
        }

        function showDropDownField()
        {
            if (!dropdownField)
                createDropDownField();
            else {
                dropdownField.style.display = "block";
            }
            lastActiveField = activeField;
            setActiveField(FIELD_NONE);

            isDropDownVisible = true;

            lastTimeSelId = parseInt(hourField.innerHTML);
            if (parseInt(minuteField.innerHTML) >= 15)
                lastTimeSelId += 24;

            dropdownTimeList.selectId(lastTimeSelId);
        }

        function createDropDownField()
        {
            dropdownField = document.createElement("div");
            dropdownField.style.position = "absolute";
            dropdownField.style.top = (top + 21) + "px";
            dropdownField.style.left = left + "px";
            dropdownField.style.width = TIME_FIELD_WIDTH + "px";
            dropdownField.style.height = "100px";
            dropdownField.style.border = "1px solid black";
            dropdownField.style.backgroundColor = "white";
            dropdownField.onmouseenter = onDropDownFieldMouseEnter;
            dropdownField.onmouseleave = onDropDownFieldMouseLeave;
            parent.appendChild(dropdownField);

            dropdownTimeList = new innovaphone.ui.ListView(dropdownField, null, onTimeListChanged, false, true);
            dropdownTimeList.addColumn("Time", TIME_FIELD_WIDTH - 5);
            for (i = 0; i < 24; i++) {
                if (i < 10) {
                    dropdownTimeList.addRow(["0" + i + ":00"], i);
                    dropdownTimeList.addRow(["0" + i + ":30"], i + 24);
                }
                else {
                    dropdownTimeList.addRow([i + ":00"], i);
                    dropdownTimeList.addRow([i + ":30"], i + 24);
                }
            }
            dropdownTimeList.resize();
        }


        // Public interface
        this.container = container;

        this.setTime = function (theTime) {
            hr = theTime.getHours();
            mm = theTime.getMinutes();
            hourField.innerHTML = hr < 10 ? "0" + hr : hr;
            minuteField.innerHTML = mm < 10 ? "0" + mm : mm;
        }

        this.getTime = function () {
            tmpDate = new Date();
            tmpDate.setHours(hourField.innerHTML);
            tmpDate.setMinutes(minuteField.innerHTML);
            tmpDate.setSeconds(0);
            tmpDate.setMilliseconds(0);
            return tmpDate;
        }

        this.setOnTimeChanged = function (fnc, obj) {
            onTimeChangedFnc = fnc;
            onTimeChangedFncObj = obj;
        }

        this.isEnabled = function () {
            return isEnabled;
        }

        this.setEnabled = function (newIsEnabled) {
            if (newIsEnabled != isEnabled) {
                isEnabled = newIsEnabled;

                if (isEnabled) {
                    innovaphone.lib.removeClass(container, "ijs-timefield-disabled");
                    container.tabIndex = 0;
//                    container.style.outline = "";
                    container.onblur = onLostFocus;
                    container.onkeydown = onKeyDown;
                    container.onkeypress = onKeyPress;
                }
                else {
                    innovaphone.lib.addClass(container, "ijs-timefield-disabled");
                    container.tabIndex = -1;
                    //container.style.outline = "none";
                    container.onblur = null;
                    container.onkeydown = null;
                    container.onkeypress = null;
                }
            }
        }
    }

    return TimeField;
}());
