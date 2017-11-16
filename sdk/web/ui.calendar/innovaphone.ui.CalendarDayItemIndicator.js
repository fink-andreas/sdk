
var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.CalendarDayItemIndicator = innovaphone.ui.CalendarDayItemIndicator || (function () {
    function CalendarDayItemIndicator(parent) {
        var instance = this,
            container = null,
            items = new Array(3),
            itemSize = 6,
            middlePos = parseInt(parent.style.width) / 2,
            itemSeperator = 2,
            itemPosDelta = itemSize + itemSeperator;

        // Public flags for busy types...
        this.BT_FREE = 1;
        this.BT_BUSY = 2;
        this.BT_AWAY = 3;
        this.BT_DND = 4;
        this.BT_DINNER = 5;
        this.BT_HOLIDAY = 6;

        container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "25px";
        container.style.left = "0px";
        container.style.width = ((parent.style.width) - 2) + "px";
        container.style.height = itemSize + "px";
        container.style.boder = "none";
        container.style.backgroundColor = "transparent";

        for (var i = 0; i < 3; i++) {
            var item = document.createElement("div");
            item.style.position = "absolute";
            item.style.top = "0px";
            item.style.left = (middlePos - itemSize / 2) + "px";
            item.style.width = itemSize + "px";
            item.style.height = itemSize + "px";
            item.style.boderStyle = "solid";
            item.style.boderSize = "1px";
            item.style.borderRadius = "50%";
            item.style.backgroundColor = "black";
            item.style.display = "none";
            container.appendChild(item);
            items[i] = item;
        }

        parent.appendChild(container);

        this.showPoints = function (numOfPoints, types) {
            for (var i = 0; i < 3; i++) {
                items[i].style.display = "none";
                items[i].className = "";
            }

            if (numOfPoints == 0)
                return;

            if (numOfPoints > 3)
                return;

            var curItemPos = 0;
            if (numOfPoints == 1)
                curItemPos = middlePos - itemSize / 2;
            else if (numOfPoints == 2)
                curItemPos = middlePos - itemPosDelta + itemSeperator / 2;
            else // (numOfPoints == 3)
                curItemPos = middlePos - itemSize / 2 - itemPosDelta;

            for (var i = 0; i < numOfPoints; i++) {
                var curItem = items[i];
                curItem.style.left = curItemPos + "px";

                switch (types[i]) {
                    case instance.BT_FREE:
                        curItem.className = "ijs-cal-dot-green";
                        break;

                    case instance.BT_AWAY:
                    case instance.BT_DINNER:
                    case instance.BT_HOLIDAY:
                        curItem.className = "ijs-cal-dot-yellow";
                        break;

                    case instance.BT_BUSY:
                    case instance.BT_DND:
                        curItem.className = "ijs-cal-dot-red";
                        break;
                }

                curItem.style.display = "block";
            }
        }

    } return CalendarDayItemIndicator;
}());
