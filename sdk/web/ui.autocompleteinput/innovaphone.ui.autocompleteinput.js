/// <reference path="../lib/innovaphone.lib.js" />
/// <reference path="../ui.input/innovaphone.ui.input.js" />

var innovaphone = innovaphone || {};
innovaphone.ui = innovaphone.ui || {};

innovaphone.ui.AutocompleteinputResources = innovaphone.ui.AutocompleteinputResources || function (onload) {
    innovaphone.lib.loadObjectScripts([
            "web/ui.input/innovaphone.ui.Input",
            "web/ui.scrollbar/innovaphone.ui.ScrollBar"
    ], function () {
        innovaphone.ui.AutocompleteinputResourcesLoaded = true;
        onload();
    });
};

innovaphone.ui.Autocompleteinput = innovaphone.ui.Autocompleteinput || (function () {
    function Autocompleteinput(container, width, value, left, top, parent) {


        var inputBox = new innovaphone.ui.InputText(container,value, left, top, parent);
        var callBackOnChange = null;
        var callBackCompleteValue = null;
        var lastKeyCode = 0;
        var separator = ',';
        var useSpaces = true;


        if (!container) {
            container = document.createElement("span");
            if (left != undefined || top != undefined) {
                container.style.position = "absolute";
                if (left != undefined) container.style.left = left + "px";
                if (top != undefined) container.style.top = top + "px";
            }
        }

        inputBox.setWidth(width);
        container.appendChild(inputBox.container);

        function GetCurrentValue() {
            var valueArray = inputBox.value().split(separator);
            return valueArray[valueArray.length - 1];
            
        }

        function SetNewValue(newValue) {
            var currentValue = inputBox.value();
            var lastComma = currentValue.lastIndexOf(separator);


            var finalValue = currentValue.substring(0, lastComma + 1);
            var toChop = currentValue.substring(lastComma + 1, currentValue.length);
            var firstNonSpace = toChop.search(/\S|$/);
            var lastSpace = toChop.lastIndexOf(" ");
            var lastNonSpace = toChop.replace(/\s*$/, "").length;
            finalValue += toChop.substring(0, firstNonSpace);
            finalValue += newValue;
            if (lastNonSpace > 0) {
                finalValue += toChop.substring(lastNonSpace, toChop.length);                
            }

            inputBox.setValue(finalValue);
        }

        

        function AutoSuggestControl(oTextbox /*:HTMLInputElement*/,
                                    oProvider /*:SuggestionProvider*/) {

            /**
             * The currently selected suggestions.
             * @scope private
             */
            this.cur /*:int*/ = -1;

            /**
             * The dropdown list layer.
             * @scope private
             */
            this.layer = null;

            /**
             * Suggestion provider for the autosuggest feature.
             * @scope private.
             */
            this.provider /*:SuggestionProvider*/ = oProvider;

            /**
             * The textbox to capture.
             * @scope private
             */
            this.textbox /*:HTMLInputElement*/ = oTextbox.getElementsByTagName('input')[0];

 

            //initialize the control
            this.init();

        }

        /**
         * Autosuggests one or more suggestions for what the user has typed.
         * If no suggestions are passed in, then no autosuggest occurs.
         * @scope private
         * @param aSuggestions An array of suggestion strings.
         * @param bTypeAhead If the control should provide a type ahead suggestion.
         */
        AutoSuggestControl.prototype.autosuggest = function (aSuggestions /*:Array*/,
                                                             bTypeAhead /*:boolean*/) {
            //make sure there's at least one suggestion
            if (aSuggestions.length > 0) {
                if (bTypeAhead) {
                    this.typeAhead(aSuggestions[0]);
                }

                this.showSuggestions(aSuggestions);
            } else {
                this.hideSuggestions();
            }
        };

        /**
         * Creates the dropdown layer to display multiple suggestions.
         * @scope private
         */
        AutoSuggestControl.prototype.createDropDown = function () {

            var oThis = this;

            //create the layer and assign styles
            this.layer = document.createElement("div");

            innovaphone.lib.addClass(this.layer, "ijs-autocomplete-suggestions");
            this.layer.style.position = "absolute";
            this.layer.style.width = width;
            this.layer.style.height = "auto";
            this.layer.style.clear = "both";
            this.layer.style.borderWidth = "1px";
            this.layer.style.borderStyle = "solid";
            this.layer.style.padding = "0px";
            this.layer.style.textAlign = "left";
            this.layer.style.zIndex = 199;

            this.layer.style.visibility = "hidden";
           // this.layer.style.width = this.textbox.offsetWidth;

            //when the user clicks on the a suggestion, get the text (innerHTML)
            //and place it into a textbox
            this.layer.onmousedown =
            this.layer.onmouseup =
            this.layer.onmouseover = function (oEvent) {
                oEvent = oEvent || window.event;
                oTarget = oEvent.target || oEvent.srcElement;

                if (oEvent.type == "mousedown") {
                    SetNewValue(oTarget.firstChild.nodeValue);
                    oThis.hideSuggestions();
                } else if (oEvent.type == "mouseover") {
                    oThis.highlightSuggestion(oTarget);
                } else {
                    oThis.textbox.focus();
                }
            };


            document.body.appendChild(this.layer);
        };

        /**
         * Gets the left coordinate of the textbox.
         * @scope private
         * @return The left coordinate of the textbox in pixels.
         */
        AutoSuggestControl.prototype.getLeft = function () /*:int*/ {

            var oNode = this.textbox;
            var iLeft = 0;

            while (oNode.tagName != "BODY") {
                iLeft += oNode.offsetLeft;
                oNode = oNode.offsetParent;
            }

            return iLeft;
        };

        /**
         * Gets the top coordinate of the textbox.
         * @scope private
         * @return The top coordinate of the textbox in pixels.
         */
        AutoSuggestControl.prototype.getTop = function () /*:int*/ {

            var oNode = this.textbox;
            var iTop = 0;

            while (oNode.tagName != "BODY") {
                iTop += oNode.offsetTop;
                oNode = oNode.offsetParent;
            }

            return iTop;
        };

        /**
         * Handles three keydown events.
         * @scope private
         * @param oEvent The event object for the keydown event.
         */
        AutoSuggestControl.prototype.handleKeyDown = function (oEvent /*:Event*/) {

            switch (oEvent.keyCode) {
                case 38: //up arrow
                    this.previousSuggestion();
                    oEvent.preventDefault();
                    break;
                case 40: //down arrow 
                    this.nextSuggestion();
                    break;
                case 13: //enter
                    this.hideSuggestions();
                    break;
            }

        };

        /**
         * Handles keyup events.
         * @scope private
         * @param oEvent The event object for the keyup event.
         */
        AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {
            
            var iKeyCode = oEvent.keyCode;
            lastKeyCode = iKeyCode;
            if (callBackCompleteValue !== null)
            callBackCompleteValue(inputBox.value());
            cValue = GetCurrentValue().trim();
            
            cSuggestions = callBackOnChange(cValue.trim());
            if (cSuggestions == null) {
                return;
            }

            this.handleSuggestion(cSuggestions);

   
        };

        /**
         * Handles handle suggestion.
         * @scope private
         * @cSuggestions current Suggestions array.
         */
        AutoSuggestControl.prototype.handleSuggestion = function (cSuggestions) {

            var aSuggestions = [];
            var iKeyCode = lastKeyCode;

            for (var i = 0; i < cSuggestions.length; i++) {
                if (cSuggestions[i].indexOf(cValue.trim()) == 0) {
                    aSuggestions.push(cSuggestions[i]);
                }
            }

            //for backspace (8) and delete (46), shows suggestions without typeahead
            if (iKeyCode == 8 || iKeyCode == 46) {

                this.autosuggest(cSuggestions, false);
                this.cur = -1;

                //this.provider.requestSuggestions(this, false);

                //make sure not to interfere with non-character keys
            } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
                if (iKeyCode == 38) {
                    this.textbox.selectionStart = this.textbox.selectionEnd = this.textbox.value.length;
                }
                //ignore
            } else {

                this.autosuggest(cSuggestions, true);
                this.cur = -1;

                //request suggestions from the suggestion provider with typeahead
                //this.provider.requestSuggestions(this, true);
            }
        }

        /**
         * Hides the suggestion dropdown.
         * @scope private
         */
        AutoSuggestControl.prototype.hideSuggestions = function () {
            this.layer.style.visibility = "hidden";
        };

        /**
         * Highlights the given node in the suggestions dropdown.
         * @scope private
         * @param oSuggestionNode The node representing a suggestion in the dropdown.
         */
        AutoSuggestControl.prototype.highlightSuggestion = function (oSuggestionNode) {

            for (var i = 0; i < this.layer.childNodes.length; i++) {
                var oNode = this.layer.childNodes[i];
                if (oNode == oSuggestionNode) {
                    oNode.className = "current"
                } else if (oNode.className == "current") {
                    oNode.className = "";
                }
            }
        };

        /**
         * Initializes the textbox with event handlers for
         * auto suggest functionality.
         * @scope private
         */
        AutoSuggestControl.prototype.init = function () {

            //save a reference to this object
            var oThis = this;

            //assign the onkeyup event handler
            this.textbox.onkeyup = function (oEvent) {

                //check for the proper location of the event object
                if (!oEvent) {
                    oEvent = window.event;
                }

                //call the handleKeyUp() method with the event object
                oThis.handleKeyUp(oEvent);
            };

            //assign onkeydown event handler
            this.textbox.onkeydown = function (oEvent) {

                //check for the proper location of the event object
                if (!oEvent) {
                    oEvent = window.event;
                }

                //call the handleKeyDown() method with the event object
                oThis.handleKeyDown(oEvent);
            };

            //assign onblur event handler (hides suggestions)    
            this.textbox.onblur = function () {
                oThis.hideSuggestions();
            };

            //create the suggestions dropdown
            this.createDropDown();
        };

        /**
         * Highlights the next suggestion in the dropdown and
         * places the suggestion into the textbox.
         * @scope private
         */
        AutoSuggestControl.prototype.nextSuggestion = function () {
            var cSuggestionNodes = this.layer.childNodes;

            if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length - 1) {
                var oNode = cSuggestionNodes[++this.cur];
                this.highlightSuggestion(oNode);
                SetNewValue(oNode.firstChild.nodeValue);
            }
        };

        /**
         * Highlights the previous suggestion in the dropdown and
         * places the suggestion into the textbox.
         * @scope private
         */
        AutoSuggestControl.prototype.previousSuggestion = function () {
            var cSuggestionNodes = this.layer.childNodes;

            if (cSuggestionNodes.length > 0 && this.cur > 0) {
                var oNode = cSuggestionNodes[--this.cur];
                this.highlightSuggestion(oNode);
                SetNewValue(oNode.firstChild.nodeValue);
                this.textbox.selectionStart = this.textbox.selectionEnd = this.textbox.value.length;              
            }
        };

        /**
         * Selects a range of text in the textbox.
         * @scope public
         * @param iStart The start index (base 0) of the selection.
         * @param iLength The number of characters to select.
         */
        AutoSuggestControl.prototype.selectRange = function (iStart /*:int*/, iLength /*:int*/) {

            //use text ranges for Internet Explorer
            if (this.textbox.createTextRange) {
                var oRange = this.textbox.createTextRange();
                oRange.moveStart("character", iStart);
                oRange.moveEnd("character", iLength - this.textbox.value.length);
                oRange.select();

                //use setSelectionRange() for Mozilla
            } else if (this.textbox.setSelectionRange) {
                this.textbox.setSelectionRange(iStart, iStart + iLength);
            }

            //set focus back to the textbox
            this.textbox.focus();
        };

        /**
         * Builds the suggestion layer contents, moves it into position,
         * and displays the layer.
         * @scope private
         * @param aSuggestions An array of suggestions for the control.
         */
        AutoSuggestControl.prototype.showSuggestions = function (aSuggestions /*:Array*/) {

            var oDiv = null;
            this.layer.innerHTML = "";  //clear contents of the layer

            for (var i = 0; i < aSuggestions.length; i++) {
                oDiv = document.createElement("div");
                oDiv.appendChild(document.createTextNode(aSuggestions[i]));
                this.layer.appendChild(oDiv);
            }

            this.layer.style.left = (this.getLeft() + 5) + "px";
            this.layer.style.top = (this.getTop() + this.textbox.offsetHeight + 1) + "px";
            this.layer.style.visibility = "visible";

        };

        /**
         * Inserts a suggestion into the textbox, highlighting the 
         * suggested part of the text.
         * @scope private
         * @param sSuggestion The suggestion for the textbox.
         */
        AutoSuggestControl.prototype.typeAhead = function (sSuggestion /*:String*/) {

            //check for support of typeahead functionality
            if (this.textbox.createTextRange || this.textbox.setSelectionRange) {
                var iLen = this.textbox.value.length;
                SetNewValue(sSuggestion);
                var selectionLength = sSuggestion.length - GetCurrentValue().length;
                this.selectRange(iLen, sSuggestion.length);
            }
        };

        

        var oTextbox = new AutoSuggestControl(inputBox.container, null);

        this.container = container;
        this.SetDataCallBack =  function(dataCallBack) {
            callBackOnChange = dataCallBack;
        }

        this.SetCompleteDataCallBack = function(callbackCompleteValue) {
            callBackCompleteValue = callbackCompleteValue;
        }

        this.TriggerAutoComplete = function (cSuggestions) {
            oTextbox.handleSuggestion(cSuggestions);
            
         }

        this.style = inputBox.style;
        this.value = function () { return inputBox.value(); };

        // do not use this.focus = input.focus; as this behaves strange
        // same for setSelectionRange/addEventListener
        this.setSelectionRange = function (start, end) {
            inputBox.setSelectionRange(start, end);
        }

        this.addEventListener = function (type, listener) {
            inputBox.addEventListener(type, listener);
        }

        this.focus = function () {
            inputBox.focus();
        }

        this.reset = function () {
            inputBox.reset();
        }

        this.setValue = function (value) {
            inputBox.setValue(value);
        }

        this.setMaxLength = function (maxLength) {
            inputBox.maxLength = maxLength;
        }

        this.setWidth = function (width) {
            inputBox.style.width = (width - 4) + "px"; // 4 => 1px paddingLeft, 1px paddingRight, 1px borderLeft, 1px borderRight
        }

        this.setPlaceHolder = function (placeHolder) {
            inputBox.placeholder = placeHolder;
        }

        this.setOnEnter = function (onEnter) {

            inputBox.setOnEnter(onEnter);
        }

        this.setOnChange = function (onChange) {
            inputBox.addEventListener("change", onChange);
        }

        this.checked = function () {
            return inputBox.checked;
        }

        this.check = function (checked) {
            input.checked = checked;
        }



        this.getType = function () {
            return inputBox.type;
        }

        this.hasChanged = function () {
            return inputBox.hasChanged();
        }



        this.setTitle = function (title) {
            inputBox.title = title;
        }

        this.enable = function () {
            inputBox.disabled = false;
        }

        this.disable = function () {
            inputBox.disabled = true;
        }

        this.isDisabled = function () {
            return inputBox.isDisabled;
        }

        this.SetSeparator = function (separatorIn) {
            separator = separatorIn;

        }
        this.GetLastValue = function() {
            return GetCurrentValue();
        }


    } return Autocompleteinput;
}());