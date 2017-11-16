/*---------------------------------------------------------------------------*/
/* innovaphone.mypbx.ui.apps.js                                              */
/* copyright (c) innovaphone 2016                                            */
/* User interface library for apps in myPBX                                  */
/*---------------------------------------------------------------------------*/

var innovaphone = innovaphone || {};
innovaphone.mypbx = innovaphone.mypbx || {};
innovaphone.mypbx.ui = innovaphone.mypbx.ui || {};
innovaphone.mypbx.ui.apps = innovaphone.mypbx.ui.apps || (function () {

    function AppGrid() {
        var element = document.createElement("span"),
            fillers = null,
            apps = [],
            draggedApp = null;

        element.style.display = "flex";
        element.style.flexWrap = "wrap";
        element.style.justifyContent = "center";

        for (var i = 0; i < 32; i++) {
            var filler = document.createElement("span");
            filler.style.display = "block";
            filler.style.width = "76px";
            filler.style.height = "0px";
            element.appendChild(filler);
            if (!fillers) fillers = filler;
        }

        function getAppsString() {
            var result = "";
            for (var i = 0; i < apps.length; i++) {
                if (result) result += ",";
                result += apps[i].id;
            }
            return result;
        }

        this.content = function () { return element; };
        this.dispose = function () {
            while (apps.length) {
                apps[0].dispose();
                apps.splice(0, 1);
            }
            if (element.parentNode) element.parentNode.removeChild(element);
            element = null;
        }

        this.add = function (id, name, description, uri) {
            var app = new App(this, id, name, description, uri);
            apps.push(app);
            element.insertBefore(app.content(), fillers);
        };

        this.removeAll = function () {
            while (apps.length) {
                apps[0].dispose();
                apps.splice(0, 1);
            }
        };

        this.setDragged = function (app) { dragged = app; };
        this.isDragging = function () { return dragged != null; };
        this.dropBefore = function (ref) {
            if (dragged && ref && dragged != ref) {
                var oldAppsString = getAppsString();
                element.removeChild(dragged.content());
                element.insertBefore(dragged.content(), ref.content());
                for (var i = 0; i < apps.length; i++) {
                    if (apps[i] == dragged) {
                        apps.splice(i, 1);
                        break;
                    }
                }
                for (var i = 0; i < apps.length; i++) {
                    if (apps[i] == ref) {
                        apps.splice(i, 0, dragged);
                        break;
                    }
                }
                var newAppsString = getAppsString();
                if (newAppsString != oldAppsString) this.appsChanged(newAppsString);
            }
        };
        this.dropAfter = function (ref) {
            if (dragged && ref && dragged != ref) {
                var oldAppsString = getAppsString();
                element.removeChild(dragged.content());
                element.insertBefore(dragged.content(), ref.content().nextSibling);
                for (var i = 0; i < apps.length; i++) {
                    if (apps[i] == dragged) {
                        apps.splice(i, 1);
                        break;
                    }
                }
                for (var i = 0; i < apps.length; i++) {
                    if (apps[i] == ref) {
                        apps.splice(i + 1, 0, dragged);
                    }
                }
                var newAppsString = getAppsString();
                if (newAppsString != oldAppsString) this.appsChanged(newAppsString);
            }
        };
        this.getAppsString = function () {
            var text = "";
            for (var i = 0; i < apps.length; i++) {
                if (text) text += ",";
                text += apps[i].id;
            }
            return text;
        };

        // event listeners to be overwritten by user
        this.appsChanged = function (appString) { };
        this.openApp = function (id) { };
    };

    function App(grid, id, name, description, uri) {
        var element = document.createElement("span"),
            elementIcon = document.createElement("span"),
            elementText = document.createElement("span"),
            elementDropBefore = document.createElement("span"),
            elementDropAfter = document.createElement("span"),
            iconUri = uri,
            that = this;

        if (iconUri.lastIndexOf('.') > iconUri.lastIndexOf('/')) iconUri = iconUri.slice(0, iconUri.lastIndexOf('.'));
        iconUri += ".png";

        element.style.display = "block";
        element.style.position = "relative";
        element.style.width = "76px";
        element.style.height = "77px";
        element.style.marginLeft = "0px";
        element.style.marginRight = "0px";
        element.style.marginTop = "13px";
        element.style.marginBottom = "13px";
        element.style.cursor = "pointer";
        element.title = name + "\n" + description;
        element.draggable = "true";
        
        elementIcon.style.display = "block";
        elementIcon.style.position = "absolute";
        elementIcon.style.width = "50px";
        elementIcon.style.height = "50px";
        elementIcon.style.top = "0px";
        elementIcon.style.left = "13px";
        elementIcon.style.backgroundImage = "url('" + iconUri + "'), url('mypbx_app_loading.png')";

        elementText.style.display = "block";
        elementText.style.position = "absolute";
        elementText.style.height = "20px";
        elementText.style.bottom = "0px";
        elementText.style.left = "6px";
        elementText.style.right = "6px";
        elementText.style.overflow = "hidden";
        elementText.style.whiteSpace = "nowrap";
        elementText.style.textAlign = "center";
        elementText.style.textOverflow = "ellipsis";
        elementText.style.color = "white";
        elementText.style.fontFamily = "titillium,sans-serif";
        elementText.style.fontSize = "14px";
        elementText.innerText = name;

        elementDropBefore.style.display = "block";
        elementDropBefore.style.position = "absolute";
        elementDropBefore.style.top = "0px";
        elementDropBefore.style.bottom = "0px";
        elementDropBefore.style.width = "38px";
        elementDropBefore.style.left = "0px";

        elementDropAfter.style.display = "block";
        elementDropAfter.style.position = "absolute";
        elementDropAfter.style.top = "0px";
        elementDropAfter.style.bottom = "0px";
        elementDropAfter.style.width = "38px";
        elementDropAfter.style.right = "0px";

        element.appendChild(elementIcon);
        element.appendChild(elementText);
        element.appendChild(elementDropBefore);
        element.appendChild(elementDropAfter);

        element.addEventListener("dragstart", dragStart);
        element.addEventListener("dragend", dragEnd);
        element.addEventListener("dragover", dragOver);
        element.addEventListener("click", click);
        elementDropBefore.addEventListener("drop", dropBefore);
        elementDropAfter.addEventListener("drop", dropAfter);

        function dragStart(ev) {
            grid.setDragged(that);
            element.style.opacity = 0.4;
            element.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
            ev.dataTransfer.effectAllowed = "move";
            ev.dataTransfer.setData("text", JSON.stringify({ type: "AppMove", id: id }));
        }

        function dragEnd(ev) {
            grid.setDragged(null);
            element.style.opacity = 1;
            element.style.filter = "";
        }

        function dragOver(ev) {
            if (grid.isDragging()) ev.preventDefault();
        }

        function dropBefore(ev) {
            grid.dropBefore(that);
            ev.preventDefault();
        }

        function dropAfter(ev) {
            grid.dropAfter(that);
            ev.preventDefault();
        }

        function click(ev) {
            grid.openApp(id);
            ev.preventDefault();
        }

        this.id = id;
        this.content = function () { return element; };
        this.dispose = function () {
            element.removeEventListener("dragstart", dragStart);
            element.removeEventListener("dragend", dragEnd);
            element.removeEventListener("dragover", dragOver);
            element.removeEventListener("click", click);
            elementDropBefore.removeEventListener("drop", dropBefore);
            elementDropAfter.removeEventListener("drop", dropAfter);
            if (element.parentNode) element.parentNode.removeChild(element);
            element = null;
        }
    }

    return {
        AppGrid: AppGrid
    };

})();