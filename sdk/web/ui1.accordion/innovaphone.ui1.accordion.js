/// <reference path="../ui.lib1/innovaphone.ui.lib1.js" />
var innovaphone = innovaphone || {};
innovaphone.ui1 = innovaphone.ui1 || {};


innovaphone.ui1.Accordion = innovaphone.ui1.Accordion ||function (style, headerClass, bodyClass) {
    this.createNode("div", style, "", '');
    var _this = this;
    var sections = [];
    var eventChangeSection = new CustomEvent('changeSection', {detail: {object: this}});
    var expandedSection = null;
    var expandedMaxHeight = 0;
    var container = this.container;
    var i;


    function Section(name, node) {
        expandedSection = null;
        var thisSection = this;
        this.createNode("div", "", "", '');
        var title = this.add(new innovaphone.ui1.Div("", name, headerClass));
        var body = null;

        if (!node) {
            body = this.add(new innovaphone.ui1.Div("", "TestSection", bodyClass));
        } else {
            body = this.add(node);
            body.addClass(bodyClass);
        }
        body.container.style.maxHeight = "0";
        body.container.style.opacity = "0";
            
        function clickSection() {
            var maxHeightBody = container.clientHeight;
            var takeOutLength = 0;//container.offsetTop;
            for (i = 0; i < sections.length; i++) {
                if (sections[i] !== thisSection) {
                    sections[i].title.container.classList.toggle("active", false);
                    sections[i].body.container.classList.toggle("show", false);
                    sections[i].body.container.style.maxHeight = "0";
                    sections[i].body.container.style.opacity = "0";
                }
            }

            for (i = 0; i < sections.length; i++) {

                var styles = window.getComputedStyle(sections[i].title.container);
                var margin = parseFloat(styles['marginTop']) +
                                    parseFloat(styles['marginBottom']);

                var localTitle = sections[i].title.container;
                takeOutLength += localTitle.offsetHeight + margin;
            }
            takeOutLength += 10;
            title.container.classList.toggle("active");
            body.container.classList.toggle("show");
            if (body.container.classList.contains("show")) {
                expandedSection = thisSection;
                var maxHeight = maxHeightBody - takeOutLength;
                body.container.style.maxHeight = maxHeight + "px";
                expandedMaxHeight = maxHeight;
                body.container.style.opacity = "1";
            } else {
                expandedSection = null;
                body.container.style.maxHeight = "0";
                body.container.style.opacity = "0";
            }
            dispatchEvent(eventChangeSection);
        }

        title.addEvent("click", clickSection);
        this.title = title;
        this.body = body;
    }
    Section.prototype = innovaphone.ui1.nodePrototype;

    // public interface
        
    this.addSection = function (name, sectionContainer) {
        var section = this.add(new Section(name, sectionContainer));
        sections.push(section);

        return section;
    }

    this.removeSection = function (section) {
        this.rem(section);
        for (i = 0; i < sections.length; i++) {
            if (sections[i] === section) {
                sections.splice(i, 1);
            }
        }
    }

    this.getExpandedSection = function () {
        return expandedSection;
    }

    this.getExpandedMaxHeight = function () {
        return expandedMaxHeight;
    }

    this.setOnChangeSection = function (onChange) {
        addEventListener("changeSection", function(e) {
            if (e.detail.object === _this) {
                onChange();
            }
        });
    }

}

innovaphone.ui1.Accordion.prototype = innovaphone.ui1.nodePrototype;