/// <reference path="../lib1/innovaphone.lib1.js" />
/// <reference path="../ui.lib1/innovaphone.ui1.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.ui1 = innovaphone.ui1 || {};

innovaphone.ui1.File = innovaphone.ui1.File || function (style, content, cl, update, multiple) {
    this.createNode("div", style, content, cl);

    var inp = document.createElement('input');
    inp.type = 'file';
    inp.setAttribute('style', "position:absolute; top:0; left:0; opacity:0; box-sizing:border-box; width:100%; height:100%; cursor:pointer");
    if (multiple) inp.setAttribute('multiple', 'true');
    this.container.appendChild(inp);
    inp.addEventListener('change', selection, false);

    function selection(ev) {
        update(ev.target.files);
    }
}

innovaphone.ui1.File.prototype = innovaphone.ui1.nodePrototype;