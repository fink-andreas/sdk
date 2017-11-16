
var innovaphone = innovaphone || {};
innovaphone.ui1 = innovaphone.ui1 || {};


innovaphone.ui1.DragList = innovaphone.ui1.DragList || function (style, cl) {

    this.createNode("ul", style, "", cl);

    var _this = this;
    var i, j;

    var items = [];
  
    var itemHeight = 20;
    var finalItemHeight = itemHeight + "px";
    var eventRemovedElement = new CustomEvent('removeListElement', { detail: { object: this } });
    _this.reorderItems = function () {
        var list = this.container.getElementsByTagName("li");
        var tmpItems = items;
        items = [];
        var listLen = list.length;
        for (i = 0; i < listLen; i++) {
            var found = null;
            for (j = 0; j < tmpItems.length; j++) {
                if (list[i] === tmpItems[j].container) {
                    items.push(tmpItems[j]);
                    tmpItems.splice(j, 1);
                    break;
                }
            }
        }

        _this.items = items;
    }

    function DragListItem(text) {
        var _thisItem = this;
        this.createNode("li", "", text);
        
        this.container.setAttribute('draggable', 'true');

        this.container.ondragenter = function (e) {
            if (e.target.className == "ijs-dragList") {

                e.target.style.background = "#fdb901";
                if (isBefore(source, e.target)) {
                    e.target.parentNode.insertBefore(source, e.target);
                    slideInDiv(source);

                }
                else {
                    e.target.parentNode.insertBefore(source, e.target.nextSibling);
                    slideInDiv(source);
                }
            }
        };

        function slideInDiv(element) {
            if (element == null) {
                return;
            }
            element.style.height = "0px";
            setTimeout(function () {
                element.style.height = finalItemHeight;
            }, 0);

        }

        this.container.ondragleave = function (e) {
            e.target.style.background = "";
        };


        this.container.ondragstart = function (e) {
            if (e.target.className == "ijs-dragList") {
                source = e.target;
                e.dataTransfer.effectAllowed = 'move';
                source.style.visibility = "hidden";
            } else {
                e.preventDefault();
            }
        };
        this.container.ondragend = function (e) {
            source.style.visibility = "visible";
            _this.reorderItems();
        }

        this.container.style.transition = "all 0.2s linear";
        this.container.style.listStyleType = "none";

        this.addClass("ijs-dragList");
      
        var closeSpan = document.createElement('span');
        closeSpan.innerHTML = "✖";
        closeSpan.onclick = function () {
            var index = -1;
            for (i = 0; i < _this.items.length; i++) {
                if (_this.items[i] === _thisItem) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                _this.rem(_thisItem);
                _this.items.splice(index, 1);
                dispatchEvent(eventRemovedElement);
            }
            
            return false;
        }
       
        this.container.appendChild(closeSpan);
    }

    DragListItem.prototype = innovaphone.ui1.nodePrototype;

    var source;

    function isBefore(a, b) {
        if (a.parentNode == b.parentNode) {
            for (var cur = a; cur; cur = cur.previousSibling) {
                if (cur === b) {
                    return true;
                }
            }
        }
        return false;
    }

    //public interface
    this.items = items;
    this.addItem = function (text) {
        var element = this.add(new DragListItem(text));
        items.push(element);

        return element;
    }

    this.getElements = function () {
        var finalArray = [];
        for (i = 0; i < items.length; i++) {
            var cElement = items[i].container.innerText;
            cElement = cElement.substring(0, cElement.length - 1);
            finalArray.push(cElement);
        }

        return finalArray;
    }

    this.getElementsObjects = function () {
        return items;

    }

    this.setOnRemoveElement = function (onRemoveElement) {
        addEventListener("removeListElement", function(e) {
            if (e.detail.object === _this) {
                onRemoveElement();
            }
        });
    }
   
}


innovaphone.ui1.DragList.prototype = innovaphone.ui1.nodePrototype;
