
/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.BubbleContainer = innovaphone.ui.BubbleContainer|| (function () {
    function BubbleContainer(left, top, width, height, parent) {
        var instance = this,
            containerTop = top,
            containerLeft = left,
            containerWidth = width,
            containerHeight = height,
            bubbleContainer = null,
            arrowContainer = null,
            contentContainer = null,
            onMouseEnterFnc = null,
            onMouseEnterObj = null,
            onMouseLeaveFnc = null,
            onMouseLeaveObj = null,
            isMouseInControl = false,
            isVisible = true;

        bubbleContainer = document.createElement("div");
        bubbleContainer.style.position = "absolute";
        bubbleContainer.style.left = "0px";
        bubbleContainer.style.top = "0px";
        bubbleContainer.style.width = width + "px";
        bubbleContainer.style.height = height + "px";
        bubbleContainer.style.borderWidth = "1px";
        bubbleContainer.style.borderStyle = "solid";
        bubbleContainer.style.borderRadius = "3%";
        bubbleContainer.className = "ijs-bubble-container";
        bubbleContainer.style.boxSizing = "border-box";
        innovaphone.lib.makeUnselectable(bubbleContainer);

        bubbleContainer.addEventListener("mouseover", onMouseEnter, false);
        bubbleContainer.addEventListener("mouseout", onMouseLeave, false);

        arrowContainer = document.createElement("div");
        arrowContainer.style.position = "absolute";
        arrowContainer.style.left = "2px";
        arrowContainer.style.top = "2px";
        arrowContainer.style.width = "5px";
        arrowContainer.style.height = "5px";
        arrowContainer.style.boxSizing = "border-box";
        arrowContainer.style.borderWidth = "1px";
        arrowContainer.style.borderStyle = "solid";
        arrowContainer.style.webkitTransform = "rotate(45deg)";
        arrowContainer.style.MozTransform = "rotate(45deg)";
        arrowContainer.style.msTransform = "rotate(45deg)";
        arrowContainer.style.otransform = "rotate(45deg)";
        arrowContainer.style.transform = "rotate(45deg)";
        arrowContainer.style.boxShadow = "none";
        arrowContainer.className = "ijs-bubble-container";
        innovaphone.lib.makeUnselectable(arrowContainer);
        bubbleContainer.appendChild(arrowContainer);

        //arrowContainer.onmouseenter = onMouseEnter;
        //arrowContainer.onmouseleave = onMouseLeave;

        contentContainer = document.createElement("div");
        contentContainer.style.position = "absolute";
        contentContainer.style.left = "0px";
        contentContainer.style.top = "0px";
        contentContainer.style.width = (width - 2) + "px";
        contentContainer.style.height = (height - 2) + "px";
        contentContainer.style.border = "1px solid transparent";
        contentContainer.style.boxShadow = "none";
        contentContainer.style.borderRadius = "3%";
        contentContainer.className = "ijs-bubble-container";
        contentContainer.style.boxSizing = "border-box";
        innovaphone.lib.makeUnselectable(contentContainer);
        bubbleContainer.appendChild(contentContainer);

        if (parent)
            parent.appendChild(bubbleContainer);

        // Functions
        function setArrow(arrowSize, arrowPosPercent, arrowDir) {
            arrowBoxSize = Math.round(Math.sqrt((arrowSize * arrowSize) * 2));

            if (arrowDir == "top") {
                bubbleContainer.style.top = (containerTop + arrowSize) + "px";
                bubbleContainer.style.left = containerLeft + "px";
                bubbleContainer.style.height = (containerHeight - arrowSize) + "px";
                bubbleContainer.style.width = containerWidth + "px";

                contentContainer.style.height = (containerHeight - arrowSize - 2) + "px";
                contentContainer.style.width = (containerWidth - 2) + "px";

                arrowContainer.style.width = arrowBoxSize + "px";
                arrowContainer.style.height = arrowBoxSize + "px";

                tmpArrowPos = containerWidth / 100 * arrowPosPercent - (arrowBoxSize / 2);
                if (tmpArrowPos < 0)
                    tmpArrowPos = 0;
                if (tmpArrowPos > containerWidth - arrowSize)
                    tmpArrowPos = containerWidth - arrowSize;

                arrowContainer.style.left = tmpArrowPos + "px";
                arrowContainer.style.top = (1 - arrowBoxSize / 2) + "px";
            }
            else if (arrowDir == "bottom") {
                theHeight = containerHeight - arrowSize;
                bubbleContainer.style.top = containerTop + "px";
                bubbleContainer.style.left = containerLeft + "px";
                bubbleContainer.style.height = theHeight + "px";
                bubbleContainer.style.width = containerWidth + "px";

                contentContainer.style.height = (containerHeight - arrowSize - 2) + "px";
                contentContainer.style.width = (containerWidth - 2) + "px";

                arrowContainer.style.width = arrowBoxSize + "px";
                arrowContainer.style.height = arrowBoxSize + "px";

                tmpArrowPos = containerWidth / 100 * arrowPosPercent - (arrowBoxSize / 2);
                if (tmpArrowPos < 0)
                    tmpArrowPos = 0;
                if (tmpArrowPos > containerWidth - arrowSize)
                    tmpArrowPos = containerWidth - arrowSize;

                arrowContainer.style.left = tmpArrowPos + "px";
                arrowContainer.style.top = (theHeight - 2 - arrowBoxSize / 2 )  + "px";
            }
            else if (arrowDir == "right") {
                theWidth = containerWidth - arrowSize;
                bubbleContainer.style.top = containerTop + "px";
                bubbleContainer.style.left = containerLeft + "px";
                bubbleContainer.style.height = containerHeight + "px";
                bubbleContainer.style.width = theWidth + "px";

                contentContainer.style.height = (containerHeight - 2) + "px";
                contentContainer.style.width = (theWidth - 2) + "px";

                arrowContainer.style.width = arrowBoxSize + "px";
                arrowContainer.style.height = arrowBoxSize + "px";

                tmpArrowPos = containerHeight / 100 * arrowPosPercent - (arrowBoxSize / 2);
                if (tmpArrowPos < 0)
                    tmpArrowPos = 0;
                if (tmpArrowPos > containerHeight - arrowSize)
                    tmpArrowPos = containerHeight - arrowSize;

                arrowContainer.style.left = (theWidth - 2 - arrowBoxSize / 2) + "px";
                arrowContainer.style.top = tmpArrowPos + "px";
            }
            else { // left
                theWidth = containerWidth - arrowSize;
                bubbleContainer.style.top = containerTop + "px";
                bubbleContainer.style.left = (containerLeft + arrowSize) + "px";
                bubbleContainer.style.height = containerHeight + "px";
                bubbleContainer.style.width = theWidth + "px";

                contentContainer.style.height = (containerHeight - 2) + "px";
                contentContainer.style.width = (theWidth - 2) + "px";

                arrowContainer.style.width = arrowBoxSize + "px";
                arrowContainer.style.height = arrowBoxSize + "px";

                tmpArrowPos = containerHeight / 100 * arrowPosPercent - (arrowBoxSize / 2);
                if (tmpArrowPos < 0)
                    tmpArrowPos = 0;
                if (tmpArrowPos > containerHeight - arrowSize)
                    tmpArrowPos = containerHeight - arrowSize;

                arrowContainer.style.left = (1 - arrowBoxSize / 2) + "px";
                arrowContainer.style.top = tmpArrowPos + "px";
            }
        }

        function onMouseEnter(event)
        {
            if (!isMouseInControl) {
                isMouseInControl = true;
                if (onMouseEnterFnc)
                    onMouseEnterFnc(onMouseEnterObj);

                if (event.target == bubbleContainer)
                    event.preventDefault();
            }
        }

        function onMouseLeave(event)
        {
            if (isMouseInControl) {
                isMouseInControl = false;
                if (onMouseLeaveFnc)
                    onMouseLeaveFnc(onMouseLeaveObj);

                if (event.target == bubbleContainer)
                    event.preventDefault();
            }
        }

        // Public interface
        this.container = contentContainer;
        this.setArrow = setArrow;

        this.setOnMouseEnter = function(mouseEnterFnc, obj)
        {
            onMouseEnterFnc = mouseEnterFnc;
            onMouseEnterObj = obj;
        }

        this.setOnMouseLeave = function(mouseLeaveFnc, obj)
        {
            onMouseLeaveFnc = mouseLeaveFnc;
            onMouseLeaveObj = obj;
        }

        this.show = function()
        {
            if (!isVisible) {
                isVisible = true;
                bubbleContainer.style.display = "block";
            }
        }

        this.hide = function()
        {
            if (isVisible) {
                isVisible = false;
                bubbleContainer.style.display = "none";
            }
        }

        this.isVisible = function () {
            return isVisible;
        }
    }

    return BubbleContainer;
}());
