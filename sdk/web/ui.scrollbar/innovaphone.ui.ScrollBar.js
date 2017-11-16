/// <reference path="../lib/innovaphone.lib.js" />

innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ScrollBar = innovaphone.ui.ScrollBar || (function () {
    function ScrollBar(container, sizing) {
        var instance = this,
            sizer = document.createElement("div"),
            outer = document.createElement("div"),
            content = document.createElement("div"),
            inner = document.createElement("div"),
            bar = document.createElement("span"),
            slider = document.createElement("span"),
            sliderGrabber = document.createElement("span"),
            sliderUp = document.createElement("span"),
            sliderDown = document.createElement("span"),
            mouseY = 0,
            scrollOffset = 0,
            saveScroll = 0,
            scrolling = null,
            maxHeight = 0;

        sizer.style.height = "100%";
        container.appendChild(sizer);

        outer.style.display = "block";
        outer.style.position = "relative";
        outer.style.overflow = "hidden";
        sizer.appendChild(outer);

        content.style.display = "block";
        content.style.position = "relative";
        content.style.overflowY = "scroll";
        content.style.overflowX = "hidden";
        content.style.marginRight = "-17px";
        content.style.paddingRight = "17px";
        content.style.height = "auto";
        outer.appendChild(content);

        inner.setAttribute("style", "position:absolute; left: 0px; right:8px; overflow-x:hidden");
        content.appendChild(inner);

        bar.style.display = "block";
        bar.style.backgroundColor = "transparent";
        bar.style.position = "absolute";
        bar.style.top = 0;
        bar.style.right = 0;
        bar.style.bottom = 0;
        bar.style.width = "8px";
        innovaphone.lib.makeUnselectable(bar);

        slider.style.marginLeft = "2px";
        slider.style.boxSizing = "border-box";
        slider.style.display = "block";
        slider.style.position = "absolute";
        slider.style.top = 0;
        slider.style.left = 0;
        slider.style.height = "100%";
        slider.style.width = "4px";
        slider.style.cursor = "pointer";
        slider.style.borderTopStyle = "solid";
        slider.style.borderTopWidth = "1px";
        slider.style.borderBottomStyle = "solid";
        slider.style.borderBottomWidth = "1px";
        innovaphone.lib.addClass(slider, "ijs-control-highlight");

        sliderGrabber.style.boxSizing = "border-box";   // mozBoxSizing?
        sliderGrabber.style.display = "block";
        sliderGrabber.style.position = "absolute";
        sliderGrabber.style.top = 0;
        sliderGrabber.style.left = "-8px";
        sliderGrabber.style.height = "100%";
        sliderGrabber.style.width = "16px";
        sliderGrabber.style.backgroundColor = "transparent";
        sliderGrabber.style.cursor = "pointer";

        sliderUp.style.marginLeft = "2px";
        sliderUp.style.display = "block";
        sliderUp.style.position = "absolute";
        sliderUp.style.top = 0;
        sliderUp.style.left = 0;
        sliderUp.style.height = "0%";
        sliderUp.style.width = "4px";
        innovaphone.lib.addClass(sliderUp, "ijs-control-background");

        sliderDown.style.marginLeft = "2px";
        sliderDown.style.display = "block";
        sliderDown.style.position = "absolute";
        sliderDown.style.top = 0;
        sliderDown.style.left = 0;
        sliderDown.style.height = "0%";
        sliderDown.style.width = "4px";
        innovaphone.lib.addClass(sliderDown, "ijs-control-background");

        bar.onselectstart = function () { return false; }

        bar.appendChild(sliderUp);
        bar.appendChild(slider);
        bar.appendChild(sliderGrabber);
        bar.appendChild(sliderDown);
        outer.appendChild(bar);
        recalculate();

        function disableSelection(event) {
            event.preventDefault();
            event.returnValue = false;
            return false;
        }

        function convertScrollToContent(y) {
            return content.offsetHeight ? (y * content.scrollHeight / content.offsetHeight) : 0;
        }

        function convertContentToScroll(y) {
            return content.scrollHeight ? (y * content.offsetHeight / content.scrollHeight) : 0;
        }

        function bounds(value, min, max) {
            if (max < min) max = min;
            return value < min ? min : value > max ? max : value;
        }

        function scrollTo(y) {
            y = (y * content.scrollHeight) / content.offsetHeight;
            if (y <= 0) {
                content.scrollTop = 0;
            }
            else if (y > (content.scrollHeight - content.offsetHeight)) {
                content.scrollTop = content.scrollHeight - content.offsetHeight;
            }
            else {
                content.scrollTop = y;
            }
        }

        function scrollBy(y) {
            if ((content.scrollTop + y) <= 0) {
                content.scrollTop = 0;
            }
            else if ((content.scrollTop + y) > (content.scrollHeight - content.offsetHeight)) {
                content.scrollTop = content.scrollHeight - content.offsetHeight;
            }
            else {
                content.scrollTop += y;
            }
        }

        function resize() {
            content.scrollTop = saveScroll;
            if (outer.offsetHeight == 0 && outer.offsetWidth == 0) return; // currently not visible
            var size = sizer.offsetHeight;
            if (maxHeight && size < inner.offsetHeight) size = inner.offsetHeight;
            if (maxHeight && size > maxHeight) size = maxHeight;
            outer.style.height = size + "px";
            content.style.height = size + "px";
            if (sizing == undefined && inner.scrollHeight) sizing = (inner.offsetHeight == 0);
            if (sizing) inner.style.height = inner.scrollHeight + "px";
            recalculate();
        }

        function recalculate() {
            var contentHeight = content.scrollHeight;
            var displayHeight = content.offsetHeight;
            var displayStart = content.scrollTop;
            var sliderTop = contentHeight ? bounds(Math.round(displayStart * 100 / contentHeight), 0, 100) : 0;
            var sliderHeight = contentHeight ? bounds(Math.round(displayHeight * 100 / contentHeight), 0, 100 - sliderTop) : 100;
            if (sliderHeight == 0) {
                sliderHeight = 1;
                sliderTop -= 1;
            }
            slider.style.top = sliderGrabber.style.top = sliderTop + "%";
            slider.style.height = sliderGrabber.style.height = sliderHeight + "%";
            sliderUp.style.top = "0%";
            sliderUp.style.height = sliderTop + "%";
            sliderDown.style.top = (sliderTop + sliderHeight) + "%";
            sliderDown.style.height = (100 - sliderTop - sliderHeight) + "%";
            if (innovaphone.lib.isTouch) {
                bar.style.visibility = "hidden";
            }
            else {
                bar.style.visibility = (sliderHeight == 100 || displayHeight == 0) ? "collapse" : "visible";
            }
        }

        function scrollUpClicked() {
            if (instance) scrollBy(-100);
        }

        function scrollDownClicked() {
            if (instance) scrollBy(100);
        }

        function onScroll(event) {
            saveScroll = content.scrollTop;
            recalculate();
            if (scrolling) scrolling(saveScroll, inner.offsetHeight, content.offsetHeight);
        }

        function scrollStart(event) {
            if (event && event.screenY) {
                document.body.addEventListener("selectstart", disableSelection, false);
                sliderGrabber.removeEventListener("mousedown", scrollStart, false);
                document.addEventListener("mouseup", scrollStop, false);
                document.addEventListener("mousemove", scrollStep, false);
                mouseY = event.screenY;
                scrollOffset = convertContentToScroll(content.scrollTop);
            }
        }

        function scrollStop(event) {
            document.removeEventListener("mouseup", scrollStop, false);
            document.removeEventListener("mousemove", scrollStep, false);
            document.body.removeEventListener("selectstart", disableSelection, false);
            sliderGrabber.addEventListener("mousedown", scrollStart, false);
            if (event && event.screenY) {
                var diff = mouseY - event.screenY;
                scrollTo(scrollOffset - diff);
            }
        }

        function scrollStep(event) {
            if (event && event.screenY) {
                var diff = mouseY - event.screenY;
                scrollTo(scrollOffset - diff);
            }
        }

        window.addEventListener("resize", resize, false);
        sliderGrabber.addEventListener("mousedown", scrollStart, false);
        sliderUp.addEventListener("click", scrollUpClicked, false);
        sliderDown.addEventListener("click", scrollDownClicked, false);
        content.addEventListener("scroll", onScroll, false);

        // public interface
        this.getContent = function () {
            return inner;
        }

        this.clearContent = function () {
            while (inner.lastChild) inner.removeChild(inner.lastChild);
        }

        this.appendContent = function (element) {
            inner.appendChild(element);
        }

        this.removeContent = function (element) {
            inner.removeChild(element);
        }

        this.insertContentBefore = function (element, refelement) {
            inner.insertBefore(element, refelement);
        }

        this.setMaxHeight = function (height) {
            //inner.style.maxHeight = height + "px";
            maxHeight = height;
        }

        this.resize = resize;

        this.setWidth = function width(width) {
            inner.style.width = width + "px";
        }

        this.scrollToTop = function () { content.scrollTop = 0; }

        this.scrollToBottom = function () {
            if (inner.offsetHeight > content.offsetHeight) content.scrollTop = inner.offsetHeight - content.offsetHeight;
        }

        this.setScrollTop = function (top) { content.scrollTop = top; }

        this.getScrollTop = function () { return content.scrollTop; }

        this.scrollIntoView = function (element) {
            //element.scrollIntoView(true);
            if (content.style.position == "relative") {
                content.scrollTop = element.offsetTop;
            }
            else {
                content.scrollTop = element.offsetTop - content.offsetTop;
            }
        }
        this.setOnScroll = function (f) { scrolling = f; }
    } return ScrollBar;
}());