
/// <reference path="../lib1/innovaphone.lib1.js" />
/// <reference path="../ui1.lib/innovaphone.ui1.lib.js" />
/// <reference path="../ui1.scrolling/innovaphone.ui1.scrolling.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui1.ListViewResources = innovaphone.ui1.ListViewResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui1.scrolling/innovaphone.ui1.scrolling"], function () {
        innovaphone.ui1.ListViewResourcesLoaded = true;
        onload();
    });
};

innovaphone.ui1.Editor = innovaphone.ui1.Editor || function (style, cl, bg, icons, onCtrlEnter, onEsc) {
    this.createNode("div", style, null, cl);
    var container = this.container;
    if (!bg) bg = "#e0e0e0";
    if (!icons) icons = "web/ui1.editor/ui1.editor.png";

    var buttons = 0;
    var header = this.add(new innovaphone.ui1.Div("position:absolute; left:0px; right:0px; top:0px; height:20px; background-color:" + bg));

    var bold = new button(0, function (e) { onSelection(e, bold) }, "B");
    var italics = new button(-20, function (e) { onSelection(e, italics) }, "I");
    var underline = new button(-40, function (e) { onSelection(e, underline) }, "U");
    new button(-100, function (e) { onL(e, 'UL') });
    new button(-120, function (e) { onL(e, 'OL') });
    new button(-140, function (e) { onDL(e) });
    new button(-60, function (e) { onIndent(e) });
    new button(-80, function (e) { onUnIndent(e) });

    var scrolling = this.add(new innovaphone.ui1.Scrolling("position:absolute; left:0px; right:0px; top:20px; bottom:0px", -1));
    var content = scrolling.content;

    content.container.contentEditable = true;
    content.container.style.outlineStyle = "none";
    content.addHTML("<p><br/><p/>");

    content.addEvent('keydown', onKeyDown);
    content.addEvent('keyup', onKeyUp);
    content.addEvent('mouseup', onMouseUp);

    var ctrl = false;
    var shift = false;
    var alt = false;

    function onKeyDown(e) {
        selection = window.getSelection();
        var focus = selection.focusNode;
        var ofs = selection.focusOffset;

        if (!content.firstChild()) {
            content.addHTML("<p><br/><p/>");
            selection.collapse(content.firstChild(), 0);
        }
        switch (e.keyCode) {
            case 13:
                if (ctrl) {
                    if (onCtrlEnter) {
                        e.preventDefault();
                        onCtrlEnter();
                        return;
                    }
                }
                var el = focus.tagName ? focus : focus.parentNode;
                var parent = el.parentNode;

                var p = document.createElement("P");
                if (focus.textContent.length > ofs) {
                    p.appendChild(document.createTextNode(focus.textContent.slice(ofs)));
                    if (ofs) focus.textContent = focus.textContent.slice(0, ofs);
                    else el.innerHTML = "<br/>";
                }
                else {
                    p.innerHTML = "<br/>";
                }
                console.log("Enter " + el.tagName + " Parent " + el.parentNode + " focus.textlen=" + focus.textContent.length + " ofs=" + selection.focusOffset);
                switch (parent.tagName) {
                    case "DIV":
                        parent.insertBefore(p, el.nextSibling);

                        selection.collapse(p, 0);
                        break;

                    case "LI":
                    case "DD":
                        if (ctrl) {
                            parent.insertBefore(p, el.nextSibling);
                        }
                        else {
                            if (!focus.textContent.length) {
                                parent.removeChild(el);
                                if (parent.parentNode.parentNode.tagName == "LI") {
                                    i = document.createElement("LI");
                                    i.appendChild(p);
                                    parent.parentNode.parentNode.parentNode.insertBefore(i, parent.parentNode.parentNode.nextSibling);
                                }
                                else {
                                    parent.parentNode.parentNode.insertBefore(p, parent.parentNode.nextSibling);
                                }
                                if (!parent.firstChild) parent.parentNode.removeChild(parent);
                            }
                            else {
                                var li = document.createElement(el.parentNode.tagName);
                                el.parentNode.parentNode.insertBefore(li, el.parentNode.nextSibling);
                                li.appendChild(p);
                            }
                        }

                        selection.collapse(p, 0);
                        //scrollbar.scrollIntoView(p);
                        break;
                }
                e.preventDefault();
                break;
            case 16:
                shift = true;
                break;
            case 17:
                ctrl = true;
                break;
            case 18:
                alt = true;
                break;
            case 27:
                if (onEsc) {
                    onEsc();
                    return;
                }
                break
        }
    }

    function onKeyUp(e) {
        switch (e.keyCode) {
            case 16:
                shift = false;
                break;
            case 17:
                ctrl = false;
                break;
            case 18:
                alt = false;
                break;
        }
    }

    function onMouseUp(e) {
        console.log("onMouseUp");
    }

    function onSelection(e, tag) {
        var selection = window.getSelection();
        console.log("onSelection(" + tag.name + ")=" + tag.on + " " + selection);

        for (var i = 0; i < selection.rangeCount; i++) {
            var range = selection.getRangeAt(i);

            var end = false;
            for (var node = rangeStart(range.startContainer) ; node && !end; node = rangeNext(node)) {
                if (node == range.endContainer) end = true;

                if (!tag.on) node = setSelection(tag.name, node, range.startContainer == node ? range.startOffset : 0, range.endContainer == node ? range.endOffset : undefined);
                else node = unSetSelection(tag.name, node, range.startContainer == node ? range.startOffset : 0, range.endContainer == node ? range.endOffset : undefined);
            }
        }
        selection.collapse(selection.focusNode, 0);
        e.stopPropagation();
        tag.set(tag.on ? false : true);
    }

    function rangeStart(node) {
        while (node.firstChild) node = node.firstChild;
        return node;
    }

    function rangeNext(node) {
        if (node.nextSibling) {
            return rangeStart(node.nextSibling);
        }
        return node.parentNode;
    }

    function unSetSelection(tag, node, start, end) {
        if (node.nodeType == 3) {
            var r;
            for (r = node.parentNode; (r.tagName != tag) && (r.tagName == 'B' || r.tagName == 'I' || r.tagName == 'U') ; r = r.parentNode);
            if (r.tagName == tag) {
                var b, s, a;
                if (start) b = document.createTextNode(node.textContent.slice(0, start));
                s = document.createTextNode(node.textContent.slice(start, end));
                if (end) a = document.createTextNode(node.textContent.slice(end));
                var next = end ? a : s;
                for (var n = node.parentNode; n != r.parentNode; n = n.parentNode) {
                    var x;
                    var c = n.firstChild;
                    for (x = document.createElement(n.tagName) ; c && !c.contains(node) ; c = c.nextSibling) {
                        x.appendChild(c.cloneNode(true));
                    }
                    if (b) x.appendChild(b);
                    if (x.firstChild) b = x;

                    if (n != r) {
                        x = document.createElement(n.tagName);
                        x.appendChild(s);
                        s = x;
                    }
                    if (c) c = c.nextSibling;

                    x = document.createElement(n.tagName);
                    if (a) x.appendChild(a);
                    for (; c ; c = c.nextSibling) {
                        x.appendChild(c.cloneNode(true));
                    }
                    if (x.firstChild) a = x;
                }
                if (b) r.parentNode.insertBefore(b, r);
                if (s) r.parentNode.insertBefore(s, r);
                if (a) r.parentNode.insertBefore(a, r);
                r.parentNode.removeChild(r);
                return next;
            }
        }
        return node;
    }

    function setSelection(tag, node, start, end) {
        if (node.nodeType == 3) {
            for (r = node.parentNode; (r.tagName != tag) && (r.tagName == 'B' || r.tagName == 'I' || r.tagName == 'U') ; r = r.parentNode);
            if (r.tagName != tag) {
                if (start) {
                    node.parentNode.insertBefore(document.createTextNode(node.textContent.slice(0, start)), node);
                }
                var t = document.createElement(tag);
                t.appendChild(document.createTextNode(node.textContent.slice(start, end)));
                node.parentNode.insertBefore(t, node);
                if (end) {
                    node.parentNode.insertBefore(document.createTextNode(node.textContent.slice(end)), node);
                }
                var next = node.previousSibling;
                node.parentNode.removeChild(node);
                return next;
            }
        }
        return node;
    }

    function onL(e, tag) {
        var selection = window.getSelection();
        var focus = selection.focusNode;
        var ofs = selection.focusOffset;
        var el = focus.tagName ? focus : focus.parentNode;
        console.log("onL " + el + " parent=" + el.parentNode + " Focus=" + selection.focusNode + " Offset=" + selection.focusOffset);
        if (el.parentNode.tagName == "LI") {
            var l = document.createElement(tag);
            var o = el.parentNode.parentNode;
            while (o.firstChild) l.appendChild(o.firstChild);
            o.parentNode.replaceChild(l, o);
        }
        else {
            var parent = el.parentNode;
            var l = document.createElement(tag);
            parent.insertBefore(l, el);
            parent.removeChild(el);
            var li = document.createElement("LI");
            l.appendChild(li);
            li.appendChild(el);
        }
        selection.collapse(focus, ofs);
        e.stopPropagation();
    }

    function onDL(e) {
        var selection = window.getSelection();
        var focus = selection.focusNode;
        var ofs = selection.focusOffset;
        var el = focus.tagName ? focus : focus.parentNode;
        console.log("onDL " + el + " parent=" + el.parentNode + " Focus=" + selection.focusNode + " Offset=" + selection.focusOffset);
        if (el.parentNode.tagName != "DD") {
            var parent = el.parentNode;
            var dl = document.createElement("DL");
            parent.insertBefore(dl, el);
            parent.removeChild(el);
            var dt = document.createElement("DT");
            dl.appendChild(dt);
            dt.appendChild(el);
            var dd = document.createElement("DD");
            dl.appendChild(dd);
            var p = document.createElement("P");
            p.innerHTML = "<br/>";
            dd.appendChild(p);
            selection.collapse(p, 0);
        }
        e.stopPropagation();
    }

    function onIndent(e) {
        var selection = window.getSelection();
        var focus = selection.focusNode;
        var ofs = selection.focusOffset;
        var el = focus.tagName ? focus : focus.parentNode;
        var parent = el.parentNode;
        console.log("onIndent " + el + "ofs=" + ofs);
        if (parent.tagName == "LI") {
            if (parent.previousSibling) {
                var l = document.createElement(el.parentNode.parentNode.tagName);
                parent.previousSibling.appendChild(l);
                var li = document.createElement("LI");
                l.appendChild(li);
                li.appendChild(el);
                selection.collapse(focus, ofs);
                parent.parentNode.removeChild(parent);
            }
        }
        else {
            var dl = document.createElement("DL");
            parent.insertBefore(dl, el);
            parent.removeChild(el);
            var dt = document.createElement("DT");
            dl.appendChild(dt);
            dt.appendChild(el);
            var dd = document.createElement("DD");
            dl.appendChild(dd);
            var p = document.createElement("P");
            p.innerHTML = "<br/>";
            dd.appendChild(p);
            selection.collapse(p, 0);
        }
        e.stopPropagation();
    }

    function onUnIndent(e) {
        var selection = window.getSelection();
        var focus = selection.focusNode;
        var ofs = selection.focusOffset;
        var el = focus.tagName ? focus : focus.parentNode;
        var parent = el.parentNode;
        console.log("onUnIndent " + el + "parent=" + parent + " ofs=" + ofs);
        if (parent.tagName == "LI") {
            if (parent.nextElementSibling) {
                var l = document.createElement(parent.parentNode.tagName);
                parent.parentNode.parentNode.parentNode.insertBefore(l, parent.parentNode.parentNode.nextSibling);
                while (parent.nextSibling) l.appendChild(parent.nextSibling);
            }
            if (parent.parentNode.parentNode.tagName == "LI") {
                parent.parentNode.parentNode.parentNode.insertBefore(parent, parent.parentNode.parentNode.nextSibling);
            }
        }
        e.stopPropagation();
    }

    function button(t, on, name) {
        var b = new innovaphone.ui1.Div("position:absolute; top:3px; cursor:pointer; width:14px; height:14px; overflow:hidden; background-image:url('" + icons + "'); left:" + 18 * buttons++ + "px", null, "icon20px");
        b.container.style.backgroundPosition = "0px " + t + "px";
        header.add(b);
        b.addEvent('click', on);
        b.addEvent('mousedown', function (e) { e.preventDefault() });
        this.name = name;
        this.on = false;
        this.set = function (on) {
            this.on = on;
            b.container.style.backgroundPosition = (on? "-40px " : "0px ") + t + "px";
        }
    }

    this.text = function () { return content.container.innerHTML; }
    this.setText = function (html) { content.addHTML(html); }
    this.focus = function () { content.container.focus(); }
};

innovaphone.ui1.Editor.prototype = innovaphone.ui1.nodePrototype;