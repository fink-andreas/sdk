/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.scrollbar/innovaphone.ui.ScrollBar.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};
innovaphone.ui.TreeViewResources = innovaphone.ui.TreeViewResources || function (onload) {
    innovaphone.lib.loadObjectScripts(["web/ui.scrollbar/innovaphone.ui.ScrollBar"], function () {
        innovaphone.ui.TreeViewResourcesLoaded = true;
        onload();
    });
};
innovaphone.ui.TreeView = innovaphone.ui.TreeView || (function () {
    function TreeView(container, storageId) {
        var scrollBar = new innovaphone.ui.ScrollBar(container),
            root = null,
            selectedNode = null;    // there can be only one selected node over the whole tree view

        root = new Tree(null);

        scrollBar.appendContent(root.getContainer());
        scrollBar.resize();

        function Tree(parentNode) {
            var instance = this,
                container = document.createElement("div"),
                nodes = [];

            if (parentNode != null) {    // sub trees initially not visible
                container.style.display = "none";
            }
            container.style.position = "relative";

            function selectNode(node) {
                if (storageId) {
                    var storageIds = [];
                    var parentNode = node;
                    while (parentNode && parentNode.id) {
                        storageIds.push(parentNode.id);
                        parentNode = parentNode.parentNode;
                    }
                    localStorage[storageId] = JSON.stringify(storageIds);
                }
                if (selectedNode) {
                    selectedNode.deselect();
                }
                if (selectedNode != node) {             // select the new node and expand it
                    selectedNode = node;
                    node.select();
                }
                else {                                  // select the same node again
                    node.select();
                    selectedNode = node;
                }
                if (selectedNode == null) {
                    localStorage[storageId] = [];
                }
                scrollBar.resize();
            }

            function Node(element, selectable, id, obj) {   // obj can be used to store a json object in a node
                var instance = this,
                    onClick = null,
                    onDeselect = null,
                    onExpand = null,
                    onCollapse = null,
                    nodeContainer = document.createElement("div"),
                    arrow = document.createElement("div"),
                    content = document.createElement("div"),
                    tree = document.createElement("div"),
                    subTree = null,
                    expanded = false;

                tree.style.position = "relative";
                tree.style.display = "block";
                tree.style.whiteSpace = "nowrap";
                if (parentNode != null) {
                    tree.style.marginLeft = "10px";
                }
                tree.style.fontSize = "14px";

                arrow.style.backgroundRepeat = "no-repeat";
                arrow.style.position = "relative";
                arrow.style.display = "inline-block";
                arrow.style.height = "21px";
                arrow.style.width = "21px";
                arrow.style.verticalAlign = "middle";
                arrow.style.backgroundPosition = "center center";
                arrow.addEventListener("click", toggle);

                content.style.position = "relative";
                content.style.display = "inline-block";
                content.style.width = "100%";
                content.style.verticalAlign = "middle";

                innovaphone.lib.addClass(content, "ijs-treeview-node");
                nodeContainer.appendChild(arrow);
                nodeContainer.appendChild(content);
                tree.appendChild(nodeContainer);
                container.appendChild(tree);

                if (selectable) {
                    content.style.cursor = "pointer";
                    content.addEventListener("click", function (e) { selectNode(instance); });    // no click function for none selectable nodes
                }
                updateContent(element);
                    
                function updateContent(element) {
                    while (content.firstChild) content.removeChild(content.firstChild);
                    if (innovaphone.lib.isPrimitiveType(element)) {
                        content.innerHTML = element;
                    }
                    else {
                        content.appendChild(element);
                    }
                }

                function expand() {
                    if (subTree && !expanded) {
                        expanded = true;
                        subTree.getContainer().style.display = "block";
                        innovaphone.lib.addClass(arrow, "ijs-expanded");
                        innovaphone.lib.removeClass(arrow, "ijs-expand");
                        if (onExpand) {
                            subTree.clear();
                            onExpand(instance);
                        }
                    }
                }

                function collapse() {
                    if (subTree && expanded) {
                        expanded = false;
                        if(onExpand) subTree.clear();
                        subTree.getContainer().style.display = "none";
                        innovaphone.lib.addClass(arrow, "ijs-expand");
                        innovaphone.lib.removeClass(arrow, "ijs-expanded");
                        if (onCollapse) {
                            subTree.clear();
                            onCollapse(instance);
                        }
                    }
                }

                function toggle() {
                    if (subTree) {
                        if (!expanded) {
                            expand();
                        }
                        else {
                            collapse();
                        }
                    }
                }

                function deselect() {
                    if (selectable) {
                        innovaphone.lib.removeClass(content, "ijs-selected");
                    }
                    if (onDeselect) {
                        onDeselect(instance);
                    }
                }

                function select() {
                    if (selectable) {
                        innovaphone.lib.addClass(content, "ijs-selected");
                    }
                    if (onClick) onClick(instance);
                }

                // public interface
                this.selectable = selectable;
                this.id = id;
                this.parentNode = parentNode;
                this.container = tree;
                this.content = content;
                this.obj = obj;

                this.toggle = toggle;
                this.expand = expand;
                this.collapse = collapse;
                this.deselect = deselect;
                this.select = select;

                this.createTree = function () {
                    if (subTree) return subTree;
                    subTree = new Tree(instance);
                    tree.appendChild(subTree.getContainer());
                    arrow.style.cursor = "pointer";
                    innovaphone.lib.addClass(arrow, "ijs-expand");
                    return subTree;
                }

                this.expandable = function() {
                    return onExpand != null;
                }

                this.setOnClick = function (funcOnClick) {
                    onClick = funcOnClick;
                    content.style.cursor = "pointer";
                }

                this.setOnExpand = function (funcOnExpand) {
                    onExpand = funcOnExpand;
                    content.addEventListener("dblclick", function () {
                        innovaphone.lib.clearSelection();
                        toggle();
                    });
                }

                this.setOnCollapse = function (funcOnCollapse) {
                    onCollapse = funcOnCollapse;
                }

                this.setOnDeselect = function (funcOnDeselect) {
                    onDeselect = funcOnDeselect;
                }

                this.getSubTree = function () {
                    return subTree;
                }

                this.isExpanded = function () {
                    return expanded;
                }

                this.isSelected = function () {
                    return selectedNode == this;
                }

                this.updateContent = updateContent;

                this.increaseMarginLeft = function (marginLeftPlus) {
                    if (this.container.style.marginLeft.indexOf("px") > 0) {
                        this.container.style.marginLeft = parseInt(this.container.style.marginLeft.substr(0, this.container.style.marginLeft.indexOf("px"))) + marginLeftPlus + "px";
                    } else {
                        this.container.style.marginLeft = marginLeftPlus + "px";
                    }
                }

                this.increaseMarginTop = function (marginTopPlus) {
                    if (this.container.style.marginTop.indexOf("px") > 0) {
                        this.container.style.marginTop = parseInt(this.container.style.marginTop.substr(0, this.container.style.marginTop.indexOf("px"))) + marginTopPlus + "px";
                    } else {
                        this.container.style.marginTop = marginTopPlus + "px";
                    }
                }
            }

            // public interface
            this.getContainer = function () {
                return container;
            }

            this.clear = function () {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].getSubTree()) {
                        nodes[i].getSubTree().clear();
                    }
                    container.removeChild(nodes[i].container);
                }
                nodes = [];
                scrollBar.resize();
            }

            this.addNode = function (element, selectable, id, obj) {
                var node = new Node(element, selectable, id, obj);
                nodes.push(node);
                // do not resize here, as this takes too much CPU! call openFromLocalStorage or resize after having built the whole tree
                return node;
            }

            this.findNode = function (id) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].id == id) {
                        return nodes[i];
                    }
                }
                return null;
            }

            this.removeNode = function (id) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].id == id) {
                        var node = nodes[i];
                        container.removeChild(node.container);
                        nodes.splice(i, 1);
                        return node;
                    }
                }
                return null;
            }

            this.selectNode = selectNode;
            this.parentNode = parentNode;

            this.getNodes = function () {
                return nodes;
            }

            // sortType is a value of innovaphone.ui.TreeView.sortTypes
            this.sort = function (sortType, ascending) {
                if (ascending == undefined) {
                    ascending = true;
                }
                var sortFunc = null;
                switch (sortType) {
                    case innovaphone.ui.TreeView.sortTypes.numeric:
                        sortFunc = function (a, b) {
                            var aVal = parseInt(a.container.textContent);
                            var bVal = parseInt(b.container.textContent);
                            return ascending ? aVal - bVal : bVal - aVal;
                        };
                        break;
                    case innovaphone.ui.TreeView.sortTypes.text:
                    default:
                        sortFunc = function (a, b) {
                            var aVal = a.container.textContent.toString();
                            var bVal = b.container.textContent.toString();
                            return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                        };
                        break;
                }
                nodes.sort(sortFunc);
                for (var i = 0; i < nodes.length; i++) {
                    container.appendChild(nodes[i].container);  // no need to remove the node before, because appendChild does this automatically
                }
            }

            this.openFromLocalStorage = function (storageIds, async) {
                if (!storageIds) {
                    if (storageId && localStorage[storageId]) {
                        storageIds = JSON.parse(localStorage[storageId]);
                    }
                }
                else if (this == root) {    // storageIds given by external application
                    localStorage[storageId] = JSON.stringify(storageIds);
                }
                if (storageIds) {
                    var nodeId = storageIds.pop();
                    var node = null;
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].id == nodeId) {
                            node = nodes[i];
                            break;
                        }
                    }
                    if (node) {
                        selectNode(node);
                        node.expand();
                        var subTree = node.getSubTree();
                        if (!async || (subTree && subTree.getNodes().length > 0)) {
                            if (subTree) {
                                subTree.openFromLocalStorage(storageIds, async);
                            }
                        }
                        else {
                            localStorage[storageId] = JSON.stringify(storageIds);
                        }
                    }
                    else if (!async) {
                        localStorage.removeItem(storageId); // do not remove in async mode, as element might be from upper level
                    }
                }
                scrollBar.resize();
            }
        }

        // public interface
        this.root = root;
        this.resize = scrollBar.resize;

        this.getSelectedNode = function () {
            return selectedNode;
        };

    } return TreeView;
}());

innovaphone.ui.TreeView.sortTypes = {
    numeric: 0,
    text: 1
};
