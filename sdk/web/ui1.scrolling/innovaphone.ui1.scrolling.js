
/// <reference path="../ui.lib1/innovaphone.ui1.lib.js" />

innovaphone = innovaphone || {};
innovaphone.ui1 = innovaphone.ui1 || {};
innovaphone.ui1.Scrolling = innovaphone.ui1.Scrolling || function (style, mx, my, showAlways) {
    var sizing = false;
    var init = true;
    this.createNode("div", style);
    var that = this;
    var bars = this.container;
    bars.setAttribute("style", style);

    var vb = document.createElement("div");
    vb.setAttribute("style", "position:absolute; top:0px; bottom:8px; right:2px; width:4px; overflow:hidden");
    bars.appendChild(vb);
    var v = document.createElement("div");
    v.setAttribute("style", "position:absolute; width:100%; background-color:red");
    vb.appendChild(v);

    var hb = document.createElement("div");
    hb.setAttribute("style", "position:absolute; left:0px; right:8px; bottom:2px; height:4px; overflow:hidden");
    bars.appendChild(hb);
    var h = document.createElement("div");
    h.setAttribute("style", "position:absolute; height:100%; background-color:red");
    hb.appendChild(h);

    var outer = document.createElement("div");
    outer.setAttribute("style", "position:absolute; left:0px; right:8px; top:0px; bottom:8px; overflow:hidden");
    bars.appendChild(outer);

    var inner = document.createElement("div");
    inner.setAttribute("style", "position:absolute; overflow:scroll; left:0px; right:-20px; top:0px; bottom:-20px");
    outer.appendChild(inner);

    var sizer = document.createElement("div");
    sizer.setAttribute("style", "position:absolute; display:inline-block;" + (mx == -1 ? "left:0px; right:0px;" : "") + (my == -1 ? "top:0px; bottom:0px;" : ""));
    inner.appendChild(sizer);
    
    var obj = document.createElement('object');
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    obj.onload = objLoaded;
    obj.type = 'text/html';
    obj.data = 'about:blank';
    sizer.appendChild(obj);

    var div = new innovaphone.ui1.Node("div");
    sizer.appendChild(div.container);

    inner.addEventListener("scroll", onScroll);

    this.content = div;
    this.add = function (node, before) {
        return div.add(node, before);
    }
    this.rem = function (node) {
        div.rem(node);
    }
    
    this.onScroll = null;
    this.setScrollTop = function (top) { inner.scrollTop = top; }
    this.getScrollTop = function () { return inner.scrollTop; }
    this.scrollToBottom = function () {
        if (sizer.offsetHeight > outer.offsetHeight) inner.scrollTop = sizer.offsetHeight - outer.offsetHeight;
    }
    this.isScrollBottom = function () {
        return (inner.scrollTop == (sizer.offsetHeight - outer.offsetHeight));
    }
    this.isScrollTop = function () {
        return (inner.scrollTop == 0);
    }

    function objLoaded(e) {
        //console.log("object loaded");
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
        resize();
        resize();
    }

    function onScroll() {
        //console.log("onScroll");
        resize();
        if (that.onScroll) that.onScroll();
    }

    function resizeListener() {
        //console.log("resizeListener");
        resize();
    }

    function resize() {
        //console.log("innerScroll=" + inner.scrollWidth + "x" + inner.scrollHeight + " inner=" + inner.offsetWidth + "x" + inner.offsetHeight + " outer=" + outer.offsetWidth + "x" + outer.offsetHeight + " div=" + div.container.offsetWidth + "x" + div.container.offsetHeight + " inner.Client=" + inner.clientWidth + "x" + inner.clientHeight + " bars=" + bars.offsetWidth + "x" + bars.offsetHeight);
        var x = inner.scrollWidth;
        var y = inner.scrollHeight;
        if (div.container.offsetWidth && div.container.offsetWidth > x) x = div.container.offsetWidth;
        if (div.container.offsetHeight && div.container.offsetHeight > y) y = div.container.offsetHeight;
        if (!bars.offsetHeight && inner.scrollHeight) sizing = true;
        if (sizing) {
            bars.style.height = Math.min(y + (x > mx ? 8 : 0), my)  + "px";
            bars.style.width = Math.min(x + (y > my ? 8 : 0), mx) + "px";
        }
        if (init) {
            init = false;
            //console.log("adjust2=" + (inner.clientWidth - bars.clientWidth + 8));
            inner.style.right = inner.clientWidth - bars.clientWidth + 8 - 20 + "px";
            inner.style.bottom = inner.clientHeight - bars.clientHeight + 8 - 20 + "px";
        }
        //console.log("sizing: innerScroll=" + inner.scrollWidth + "x" + inner.scrollHeight + " inner=" + inner.offsetWidth + "x" + inner.offsetHeight + " outer=" + outer.offsetWidth + "x" + outer.offsetHeight + " div=" + div.container.offsetWidth + "x" + div.container.offsetHeight + " inner.Client=" + inner.clientWidth + "x" + inner.clientHeight + " bars=" + bars.offsetWidth + "x" + bars.offsetHeight);
        var sy = x > bars.offsetWidth ? bars.offsetHeight - 8 : bars.offsetHeight;
        var sx = y > bars.offsetHeight ? bars.offsetWidth - 8 : bars.offsetWidth;
        //console.log("space=" + sx + "x" + sy);

        var vs = sy / y * 100;
        //console.log(sy + "/" + y + "=" + vs);
        var hs = sx / x * 100;
        //console.log(sx + "/" + x + "=" + hs + " scrollLeft=" + inner.scrollLeft);
        var vo = inner.scrollTop / y * 100;
        var ho = inner.scrollLeft / x * 100;

        if (showAlways) {
            outer.style.right = "8px";
            hb.style.right = "8px";
            v.style.height = vs + "%";
            v.style.top = vo + "%";
            outer.style.bottom = "8px";
            vb.style.bottom = "8px";
            h.style.width = hs + "%";
            h.style.left = ho + "%";
            div.container.style.minHeight = inner.clientHeight - 8 + "px";
            div.container.style.minWidth = inner.clientWidth - 8 + "px";
        }
        else {
            if (vs >= 100) {
                vs = 0;
                outer.style.right = "0px";
                hb.style.right = "0px";
                div.container.style.minHeight = inner.clientHeight + "px";
                v.style.height = vs + "%";
                v.style.top = vo + "%";
            }
            else {
                if (div.container.style.minHeight == div.container.scrollHeight + "px") {
                    //console.log("adjust minHeight");
                    div.container.style.minHeight = inner.clientHeight + "px";
                }
                else {
                    outer.style.right = "8px";
                    hb.style.right = "8px";
                    div.container.style.minHeight = inner.clientHeight - 8 + "px";
                    v.style.height = vs + "%";
                    v.style.top = vo + "%";
                }
            }

            if (hs >= 100) {
                hs = 0;
                outer.style.bottom = "0px";
                vb.style.bottom = "0px";
                div.container.style.minWidth = inner.clientWidth + "px";
                h.style.width = hs + "%";
                h.style.left = ho + "%";
            }
            else {
                if (div.container.style.minWidth == div.container.scrollWidth + "px") {
                    //console.log("adjust minWidth");
                    div.container.style.minWidth = inner.clientWidth + "px";
                }
                else {
                    outer.style.bottom = "8px";
                    vb.style.bottom = "8px";
                    div.container.style.minWidth = inner.clientWidth - 8 + "px";
                    h.style.width = hs + "%";
                    h.style.left = ho + "%";
                }
            }
        }

        //console.log("sizing: innerScroll=" + inner.scrollWidth + "x" + inner.scrollHeight + " inner=" + inner.offsetWidth + "x" + inner.offsetHeight + " outer=" + outer.offsetWidth + "x" + outer.offsetHeight + " div=" + div.container.offsetWidth + "x" + div.container.offsetHeight + " inner.Client=" + inner.clientWidth + "x" + inner.clientHeight + " bars=" + bars.offsetWidth + "x" + bars.offsetHeight);
    }
}

innovaphone.ui1.Scrolling.prototype = innovaphone.ui1.nodePrototype;