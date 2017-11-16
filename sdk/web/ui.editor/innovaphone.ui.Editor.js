/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.scrollbar/innovaphone.ui.ScrollBar.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.ListViewResources = innovaphone.ui.ListViewResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.scrollbar/innovaphone.ui.ScrollBar"], function () {
        innovaphone.ui.ListViewResourcesLoaded = true;
        onload();
    });
};

innovaphone.ui.Editor = innovaphone.ui.Editor || (function () {
    function Editor(left, top, width, height, parent) {
        var buttons = 0;
        var container = document.createElement("div");
        if (parent) parent.appendChild(container);
        if (left == undefined && top == undefined) {
            container.style.position = "relative";
        }
        else {
            container.style.position = "absolute";
            if (left != undefined) container.style.left = left + "px";
            if (top != undefined) container.style.top = top + "px";
        }
        if (width) {
            if (width == -1) container.style.width = "100%";
            else container.style.width = width + "px";
        }
        if (height) {
            if (height == -1) container.style.height = "100%";
            else container.style.height = height + "px";
        }

        var header = document.createElement("div");
        header.style.backgroundColor = "#e0e0e0";
        header.style.position = "absolute";
        header.style.top = "0px";
        header.style.left = "0px";
        header.style.right = "0px";
        header.style.height = "20px";
        container.appendChild(header);

        addButton("B", function (e) { onSelection(e, 'B') });
        addButton("I", function (e) { onSelection(e, 'I') });
        addButton("U", function (e) { onSelection(e, 'U') });
        addButton("b", function (e) { onUnSelection(e, 'B') });
        addButton("i", function (e) { onUnSelection(e, 'I') });
        addButton("u", function (e) { onUnSelection(e, 'U') });
        addButton("L", function (e) { onL(e, 'UL') });
        addButton("N", function (e) { onL(e, 'OL') });
        addButton("D", function (e) { onDL(e) });
        addButton(">", function (e) { onIndent(e) });
        addButton("<", function (e) { onUnIndent(e) });

        var body = document.createElement("div");
        body.style.backgroundColor = "white";
        body.style.position = "absolute";
        body.style.top = "20px";
        body.style.bottom = "0px";
        body.style.left = "0px";
        body.style.right = "0px";
        container.appendChild(body);

        var scrollbar = new innovaphone.ui.ScrollBar(body);
        content = scrollbar.getContent();
        content.contentEditable = true;
        content.style.outlineStyle = "none";
        content.focus();

        {
            var p = document.createElement("P");
            content.appendChild(p);
            p.innerHTML = "<br/>";
            window.getSelection().collapse(p, 0);
        }

        scrollbar.resize();

        content.addEventListener('keydown', onKeyDown);
        content.addEventListener('keyup', onKeyUp);
        content.addEventListener('mouseup', onMouseUp);

        var ctrl = false;
        var shift = false;
        var alt = false;

        function onKeyDown(e) {
            selection = window.getSelection();
            var focus = selection.focusNode;
            var ofs = selection.focusOffset;

            if (!content.firstChild) {
                var p = document.createElement("P");
                content.appendChild(p);
                p.innerHTML = "<br/>";
                selection.collapse(p, 0);
            }
            switch (e.keyCode) {
                case 13:
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
                            scrollbar.scrollIntoView(p);
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

        function onSelection(e,tag) {
            var selection = window.getSelection();
            console.log("onSelection " + selection);

            for (var i = 0; i < selection.rangeCount; i++) {
                var range = selection.getRangeAt(i);

                var end = false;
                for (var node = rangeStart(range.startContainer); node && !end; node = rangeNext(node)) {
                    if (node == range.endContainer) end = true;

                    node = setSelection(tag, node, range.startContainer == node ? range.startOffset : 0, range.endContainer == node ? range.endOffset : undefined);
                }
            }
            selection.collapse(selection.focusNode, 0);
            e.stopPropagation();
        }

        function onUnSelection(e,tag) {
            var selection = window.getSelection();
            console.log("onUnSelection " + selection);

            for (var i = 0; i < selection.rangeCount; i++) {
                var range = selection.getRangeAt(i);

                var end = false;
                for (var node = rangeStart(range.startContainer) ; node && !end; node = rangeNext(node)) {
                    if (node == range.endContainer) end = true;

                    node = unSetSelection(tag, node, range.startContainer == node ? range.startOffset : 0, range.endContainer == node ? range.endOffset : undefined);
                }
            }
            content.normalize();
            selection.collapse(selection.focusNode, 0);
            e.stopPropagation();
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
                        for ( ; c ; c = c.nextSibling) {
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

        function addButton(t, on) {
            var b = document.createElement("div");
            b.style.backgroundColor = "#808080";
            b.style.color = "white";
            b.style.position = "absolute";
            b.style.top = "0px";
            b.style.left = 2 + 20 * buttons++ + "px";
            b.style.width = "19px";
            b.style.height = "19px";
            b.style.textAlign = "center";
            b.innerHTML = t;
            header.appendChild(b);
            b.addEventListener('click', on);
            b.addEventListener('mousedown', function (e) { e.preventDefault() });
        }

        this.text = function () { return content.innerHTML }
        this.setText = function (html) { content.innerHTML = html }

    } return Editor;
}());
