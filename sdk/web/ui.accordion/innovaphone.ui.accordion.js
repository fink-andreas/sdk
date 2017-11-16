/// <reference path="innovaphone.lib.js" />
/// <reference path="innovaphone.ui.ScrollBar.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};


innovaphone.ui.Accordion = innovaphone.ui.Accordion || (function () {
    function Accordion(container, left, top, accWidth, accHeight) {
        var  sections = [];
        var maximumHeight = 0;
        var eventChangeSection = new CustomEvent('changeSection');
        var expandedSection = "";
        var expandedMaxHeight = 0;

        if (!container) {
            container = document.createElement("div");
            container.clientWidth = accWidth;
            container.clientHeight = accHeight;
        }
        

        function Section(name, sectionContainer) {
            var newSection = document.createElement("div");
            var accTitle = document.createElement("button");
            accTitle.innerHTML = name;
            innovaphone.lib.addClass(accTitle, "ijs-accordion-head");
            accTitle.onclick = function ()
            {
 
                
                var accMaxHeight = container.clientHeight;
               /* if (accHeight == 0) {
                    accMaxHeight = container.clientHeight;
                }  */            
    
                var takeOutLength = container.offsetTop;
                var i;
                for (i = 0; i < sections.length; i++) {

                    if (sections[i].accTitle != this) {
                        sections[i].accTitle.classList.toggle("active", false);
                        sections[i].accBody.classList.toggle("show", false);   
                        sections[i].accBody.style.maxHeight = "0px";
                        
                    }
                }

                for (i = 0; i < sections.length; i++) {

                    var styles = window.getComputedStyle(sections[i].accTitle);
                    var margin = parseFloat(styles['marginTop']) +
                                     parseFloat(styles['marginBottom']);

                    cTitle = sections[i].accTitle;
                    cBody = sections[i].accBody;
                    takeOutLength += cTitle.offsetHeight + margin;
                    //takeOutLength += cBody.offsetHeight;


                }
                takeOutLength +=10;
                this.classList.toggle("active");
                this.nextElementSibling.classList.toggle("show");
                if (this.nextElementSibling.classList.contains("show")) {
                    expandedSection = this.innerHTML;
                    var maxHeight = accMaxHeight - takeOutLength;
                    this.nextElementSibling.style.maxHeight = maxHeight + "px";
                    expandedMaxHeight = maxHeight;
                }
                else{
                    this.nextElementSibling.style.maxHeight = "0px";
                }

                dispatchEvent(eventChangeSection);
            }

            var accBody = document.createElement("div");
            innovaphone.lib.addClass(accBody, "ijs-accordion-panel");
          
            if (!sectionContainer) {
                sectionContainer = document.createElement("div");
                sectionContainer.innerHTML = "TestInnerSection";
            }

            accBody.appendChild(sectionContainer);
            newSection.appendChild(accTitle);
            newSection.appendChild(accBody);
            container.appendChild(newSection);
            this.accTitle = accTitle;
            this.accBody = accBody;
            this.section = newSection;

        }

        // public interface
        this.container = container;
        this.addSection = function (name, sectionContainer)
        {
            var section = new Section(name, sectionContainer);
            sections.push(section);
        }

        this.removeSection = function (name)
        {
            for (i = 0; i < sections.length; i++) {
                if(sections[i].accTitle.innerHTML == name){
                    sections[i].section.remove();    
                    sections.splice(i, 1);

                }
            }
        }

        this.getExpandedSection = function()
        {
            return expandedSection;
        }

        this.getExpandedMaxHeight = function () {
            return expandedMaxHeight;
        }

        this.setOnChangeSection = function (onChange) {
            addEventListener("changeSection", onChange);
        }


    } return Accordion;
    }());
