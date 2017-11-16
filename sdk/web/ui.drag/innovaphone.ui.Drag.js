/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.Drag = innovaphone.ui.Drag || (function () {
    function Drag() {
        var dragEventStart = (innovaphone.lib.isTouch ? "touchstart" : "mousedown"),
            dragEventMove = (innovaphone.lib.isTouch ? "touchmove" : "mousemove"),
            dragEventStop = (innovaphone.lib.isTouch ? "touchend" : "mouseup"),
            dragObject = null,
            dragX = 0,  // start position of the moving object
            dragY = 0,
            posX = 0,   // mouse position
            posY = 0;

        function dragStart(element, event) {
            document.addEventListener(dragEventMove, drag);
            document.addEventListener(dragEventStop, dragStop);
            drag(event);
            dragObject = element;
            if (innovaphone.lib.isTouch) {
                var e = event || window.event;
                dragX = e.touches[0].pageX - dragObject.offsetLeft;
                dragY = e.touches[0].pageY - dragObject.offsetTop;
            }
            else {
                dragX = posX - dragObject.offsetLeft;
                dragY = posY - dragObject.offsetTop;
            }
        }

        function dragStop() {
            dragObject = null;
            document.removeEventListener(dragEventMove, drag);
            document.removeEventListener(dragEventStop, dragStop);
        }

        // is called if the mouse is moving and moves the object.
        function drag(event) {
            var e = null;
            if (innovaphone.lib.isTouch) {
                e = event.touches[0];
            }
            else {
                e = event || window.event;
            }
            posX = e.pageX;
            posY = e.pageY;
            if (dragObject != null) {
                dragObject.style.left = (posX - dragX) + "px";
                dragObject.style.top = (posY - dragY) + "px";
            }
        }

        // public interface

        // element is the whole object which is dragged, grabber the element which is used to drag the object
        this.makeDraggable = function (element, grabber) {
            innovaphone.lib.makeUnselectable(grabber);
            grabber.style.cursor = "pointer";
            grabber.addEventListener(dragEventStart, function (event) { dragStart(element, event); });
        }
    } return new Drag();
}());