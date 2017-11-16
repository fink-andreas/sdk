
var innovaphone = innovaphone || {};
innovaphone.ui1 = innovaphone.ui1 || {};

innovaphone.ui1.nodePrototype = {
    addText: function (text) {
        this.container.innerText = text || "";
    },

    addHTML: function (html) {
        this.container.innerHTML = html;
    },

    add: function (node, before) {
        this.container.insertBefore(node.container, before ? before.container || before : null);
        return node;
    },

    rem: function (node) {
        if (this.container == node.container.parentNode) {
            this.container.removeChild(node.container);
        }
    },

    clear: function () {
        this.container.innerHTML = "";
    },

    firstChild: function () {
        return this.container.firstChild;
    },
    
    Listener: function (c, type, handler, obj) {
        c.addEventListener(type, on);

        function on(e) {
            handler(e, obj);
        }

        this.rem = function () {
            c.removeEventListener(type, on);    
        }

        this.type = type;
        this.handler = handler;
    },

    addEvent: function (type, handler, obj) {
        this.events = this.events || [];
        var l = new this.Listener(this.container, type, handler, obj);
        this.events.push(l);
        return l;
    },

    remEvent: function (type, handler) {
        if (this.events) {
            var index = this.events.findIndex(function (v) { return v.type == type && (handler ? v.handler == handler : true); });
            if (index > -1) {
                this.events[index].rem();
                this.events.splice(index, 1);
            }
        }
    },

    setClass: function (className) {
        this.container.className = className;
    },

    addClass: function (className) {
        this.container.classList.add(className);
    },

    remClass: function (className) {
        this.container.classList.remove(className);
    },

    addTranslation: function (languages, id, property, args) {
        languages.create(this, property, id, args);
        return this;
    },

    createTranslation: function (languages, id, property, args) {
        return languages.create(this, property, id, args);
    },
    
    setNoSelect: function () {
        this.container.style.webkitTouchCallout = "none";
        this.container.style.webkitUserSelect = "none";
        this.container.style.khtmlUserSelect = "none";
        this.container.style.MozUserSelect = "none";
        this.container.style.msUserSelect = "none";
        this.container.style.userSelect = "none";
        this.container.style.draggable = false;
        this.container.onselectstart = function () { return false; }
        this.container.ondragstart = function () { return false; }
    },
    
    makeUnselectable: function () {
        this.container.style.MozUserSelect = "none";
        this.container.style.webkitUserSelect = "none";
        this.container.style.webkitTouchCallout = "none";
        this.container.setAttribute("unselectable", "on");
    },

    createNode: function (type, style, content, cl) {
        if (type == "body") this.container = document.body;
        else this.container = document.createElement(type);
        if (style) this.container.setAttribute("style", style);
        if (content) {
            if (content.container) this.container.appendChild(content.container);
            else this.container.innerText = content;
        }
        if (cl) this.container.setAttribute("class", cl);
    }
}

innovaphone.ui1.Node = innovaphone.ui1.Node || function (type, style, content, cl) {
    this.createNode(type, style, content, cl);
}

innovaphone.ui1.Node.prototype = innovaphone.ui1.nodePrototype;

innovaphone.ui1.Div = innovaphone.ui1.Div || function (style, content, cl) {
    this.createNode("div", style, content, cl);
}

innovaphone.ui1.Div.prototype = innovaphone.ui1.nodePrototype;

innovaphone.ui1.Input = innovaphone.ui1.Input || function (style, value, placeHolder, maxLength, type, cl) {
    var that = this;

    this.createNode("input", style, null, cl);
    if (value) this.container.value = value;
    if (placeHolder) this.container.placeholder = placeHolder;
    if (maxLength) this.container.maxLength = maxLength;
    if (type) {
        this.container.setAttribute("type", type);
    }

    function changed() {
        return that.container.value != value;
    }

    function setValue(value) {
        that.container.value = value;
    }

    function getValue() {
        return that.container.value;
    }

    this.changed = changed;
    this.setValue = setValue;
    this.getValue = getValue;
}
innovaphone.ui1.Input.prototype = innovaphone.ui1.nodePrototype;

innovaphone.ui1.CssVariables = innovaphone.ui1.CssVariables || function (sets, current, element) {
    this.sets = sets;
    this.current = current;
    this.element = element || document.body;
    this.activate(current);
};

innovaphone.ui1.CssVariables.prototype = {
    activate: function (id) {
        this.current = this.sets[id] ? id : Object.keys(this.sets)[0];
        for (var variable in this.sets[this.current]) this.element.style.setProperty(variable, this.sets[this.current][variable]);
    },
    toggle: function () {
        var ids = Object.keys(this.sets),
            index = ids.indexOf(this.current);
        this.activate(ids[index > -1 ? (index + 1) % ids.length : 0]);
    }
};

innovaphone.ui1.lib = innovaphone.ui1.lib || (function () {

    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

    var keyCodes = {
        arrowDown: 40,
        arrowUp: 38,
        escape: 27,
        enter: 13,
        tab: 9
    };

    return {
        isTouch: isTouch,
        keyCodes: keyCodes
    }
})();
