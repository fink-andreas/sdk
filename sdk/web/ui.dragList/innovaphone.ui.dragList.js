/// <reference path="innovaphone.lib.js" />
/// <reference path="innovaphone.ui.ScrollBar.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};


innovaphone.ui.dragList = innovaphone.ui.dragList  || (function () {
    function dragList(container) {

        if (!container) {
            container = document.createElement("div");

        }
       
        var items = [];
        var ul = document.createElement('ul');
        innovaphone.lib.addClass(ul, "ijs-dragList");
        container.appendChild(ul);
        var itemHeight = 20;
        var finalItemHeight = itemHeight + "px";
        var eventRemovedElement = new CustomEvent('removeListElement');

        
        function AddNewItem(text) {
            var li = document.createElement('li');
            li.setAttribute('draggable', 'true');

            li.ondragenter = function(e) {
                if(e.target.className == "ijs-dragList") {

                    e.target.style.background = "#fdb901";
                    if (isbefore(source, e.target)) {
                        e.target.parentNode.insertBefore(source, e.target);
                        slideInDiv(source);
 
                    }
                    else {
                        e.target.parentNode.insertBefore(source, e.target.nextSibling);
                        slideInDiv(source);


                    }
                }
            }; 

            function slideInDiv(element){  
                if(element == null){
                    return;
                }
                element.style.height = "0px";
                setTimeout(function() {
                    element.style.height = finalItemHeight;                    
                }, 0);          
                
            }

            li.ondragleave = function(e) {

                e.target.style.background = "";
   
            }; 


            li.ondragstart = function(e){
                if(e.target.className == "ijs-dragList") {

                    source = e.target;
                    e.dataTransfer.effectAllowed = 'move';
                    source.style.visibility = "hidden";
                }else {
                    e.preventDefault();
                }

            };
            li.ondragend = function(e){
                source.style.visibility = "visible";
            }



            innovaphone.lib.addClass(li, "ijs-dragList");
            var closeSpan = document.createElement('span');
            closeSpan.className = 'ijs-dragList-deleteItem';
            closeSpan.innerHTML="✖";
            closeSpan.onclick = function() {
                this.parentNode.parentNode.removeChild(this.parentNode);  
                dispatchEvent(eventRemovedElement);
                return false;
            }

  
            var t = document.createTextNode(text);
        
            li.innerHTML=li.innerHTML + text ;
            li.appendChild(closeSpan);
            ul.appendChild(li);

            return li;
        }

        var source;

        function isbefore(a, b) {
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
        
        
        this.container = container;
        this.AddItem = function (text){
            return AddNewItem(text);
        }

        this.GetElements = function () {
            var list = ul.getElementsByTagName("li");
            var finalArray = [];
            for(var i = 0; i < list.length; i++) {
                var cElement = list[i].innerText;
                cElement = cElement.substring(0, cElement.length - 1);
                finalArray.push(cElement);
            }

            return finalArray;
        }

        this.GetElementsObjects = function () {
            return ul.getElementsByTagName("li");
  
        }

        this.setOnRemoveElement = function (onRemoveElement) {
            addEventListener("removeListElement", onRemoveElement);
        }
    } return dragList;
    }());
