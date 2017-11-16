/// <reference path="~/sdk/web/lib1/innovaphone.lib1.js" />
/// <reference path="~/sdk/web/ui1.lib/innovaphone.ui1.lib.js" />

innovaphone = innovaphone || {};
innovaphone.ui1 = innovaphone.ui1 || {};

innovaphone.ui1.AutoCompleteInputConfig = innovaphone.ui1.AutoCompleteInputConfig || function (inputStyle, inputCl, suggestionStyle, suggestionCl, suggestionHighlightCl, dropDownCl) {
    this.inputStyle = inputStyle;
    this.inputCl = inputCl;
    this.suggestionStyle = suggestionStyle;
    this.suggestionCl = suggestionCl;
    this.suggestionHighlightCl = suggestionHighlightCl;
    this.dropDownCl = dropDownCl;
}

innovaphone.ui1.AutoCompleteInput = innovaphone.ui1.AutoCompleteInput || function (style, cl, config) {
    /// <param name="config" type="innovaphone.ui1.AutoCompleteInputConfig"/>

    if (!config) {  // backward compatibility
        config = new innovaphone.ui1.AutoCompleteInputConfig();
    }
    this.createNode("div", style, "", cl);
    var width = 100;
    var callBackOnChange = null;
    var callBackCompleteValue = null;
    var lastKeyCode = 0;
    var separator = ',';
    var useSpaces = true;
    var container = this.container;
    var inputBoxThis = this;
    //var inputBox = this.add(new innovaphone.ui1.Node("input", config.inputStyle, config.inputCl));
    var inputBox = this.add(new innovaphone.ui1.Node("input", config.inputStyle, null, config.inputCl));

    inputBox.container.autocomplete = "off";
    inputBox.container.autocorrect = "off";
    inputBox.container.autocapitalize = "off";
    inputBox.container.spellcheck = false;

    function getCurrentValue() {
        var currentValue = inputBoxThis.value();
        var valueArray = currentValue.split(separator);
        return valueArray[valueArray.length - 1];

    }

    function setNewValue(newValue) {
        var currentValue = inputBoxThis.value();
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

        inputBoxThis.setValue(finalValue);
    }



    function AutoSuggestControl(oTextbox,
                                oProvider) {
        this.createNode("div", "", "");
        this.cur = -1;
        this.provider = oProvider;
        this.textbox = oTextbox;
        this.init();

    }
    AutoSuggestControl.prototype = innovaphone.ui1.nodePrototype;


    AutoSuggestControl.prototype.autoSuggest = function (aSuggestions,
                                                         bTypeAhead) {
        if (aSuggestions.length > 0) {
            if (bTypeAhead) {
                this.typeAhead(aSuggestions[0]);
            }

            this.showSuggestions(aSuggestions);
        } else {
            this.hideSuggestions();
        }
    };


    AutoSuggestControl.prototype.createDropDown = function () {

        var oThis = this;

        this.container.classList.add(config.dropDownCl);
        this.container.style.position = "fixed";
        this.container.style.width = width;
        this.container.style.height = "auto";
        this.container.style.clear = "both";
        this.container.style.padding = "0px";
        this.container.style.textAlign = "left";
        this.container.style.zIndex = 199;

        //this.container.style.visibility = "hidden";
        this.container.style.display = "none";

        this.container.onmousedown =
        this.container.onmouseup =
        this.container.onmouseover = function (oEvent) {
            oEvent = oEvent || window.event;
            var oTarget = oEvent.target || oEvent.srcElement;

            if (oEvent.type === "mousedown") {
                setNewValue(oTarget.firstChild.nodeValue);
                oThis.hideSuggestions();
            } else if (oEvent.type === "mouseover") {
                oThis.highlightSuggestion(oTarget);
            } else {
                oThis.textbox.focus();
            }
        };

    };


    AutoSuggestControl.prototype.getLeft = function () {

        var oNode = this.textbox;
        var iLeft = 0;

        while (oNode.tagName !== "BODY") {
            iLeft += oNode.offsetLeft;
            oNode = oNode.offsetParent;
        }

        return iLeft;
    };

    AutoSuggestControl.prototype.getTop = function () {

        var oNode = this.textbox;
        var iTop = 0;

        while (oNode.tagName !== "BODY") {
            iTop += oNode.offsetTop;
            oNode = oNode.offsetParent;
        }

        return iTop;
    };

    AutoSuggestControl.prototype.handleKeyDown = function (oEvent) {

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

    AutoSuggestControl.prototype.handleKeyUp = function (oEvent) {

        var iKeyCode = oEvent.keyCode;
        lastKeyCode = iKeyCode;
        if (callBackCompleteValue !== null)
            callBackCompleteValue(inputBox.value());
        var cValue = getCurrentValue().trim();

        var cSuggestions = callBackOnChange(cValue.trim());
        if (cSuggestions === null) {
            return;
        }

        this.handleSuggestion(cSuggestions);
    };

    AutoSuggestControl.prototype.handleSuggestion = function (cSuggestions) {

        var aSuggestions = [];
        var iKeyCode = lastKeyCode;
        var cValue = getCurrentValue().trim();

        for (var i = 0; i < cSuggestions.length; i++) {
            if (cSuggestions[i].indexOf(cValue.trim()) === 0) {
                aSuggestions.push(cSuggestions[i]);
            }
        }

        //for backspace (8) and delete (46), shows suggestions without typeahead
        if (iKeyCode === 8 || iKeyCode === 46) {

            this.autoSuggest(cSuggestions, false);
            this.cur = -1;

        } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
            if (iKeyCode === 38) {
                this.textbox.selectionStart = this.textbox.selectionEnd = this.textbox.value.length;
            }

        } else {

            this.autoSuggest(cSuggestions, true);
            this.cur = -1;
        }
    }

    AutoSuggestControl.prototype.hideSuggestions = function () {
        //this.container.style.visibility = "hidden";
        this.container.style.display = "none";
    };

    AutoSuggestControl.prototype.highlightSuggestion = function (oSuggestionNode) {

        for (var i = 0; i < this.container.childNodes.length; i++) {
            var oNode = this.container.childNodes[i];
            if (oNode === oSuggestionNode) {
                oNode.classList.add(config.suggestionHighlightCl);
            } else {
                oNode.classList.remove(config.suggestionHighlightCl);
            }
        }
    };


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


    AutoSuggestControl.prototype.nextSuggestion = function () {
        var cSuggestionNodes = this.container.childNodes;

        if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length - 1) {
            var oNode = cSuggestionNodes[++this.cur];
            this.highlightSuggestion(oNode);
            setNewValue(oNode.firstChild.nodeValue);
        }
    };

    AutoSuggestControl.prototype.previousSuggestion = function () {
        var cSuggestionNodes = this.container.childNodes;

        if (cSuggestionNodes.length > 0 && this.cur > 0) {
            var oNode = cSuggestionNodes[--this.cur];
            this.highlightSuggestion(oNode);
            setNewValue(oNode.firstChild.nodeValue);
            this.textbox.selectionStart = this.textbox.selectionEnd = this.textbox.value.length;
        }
    };

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

    AutoSuggestControl.prototype.showSuggestions = function (aSuggestions /*:Array*/) {
        
        var oDiv = null;
        this.container.innerHTML = "";

        for (var i = 0; i < aSuggestions.length; i++) {
            oDiv = this.add(new innovaphone.ui1.Div(config.suggestionStyle, "", config.suggestionCl));
            oDiv.container.appendChild(document.createTextNode(aSuggestions[i]));
        }

        //this.container.style.left = "0px";
        //this.container.style.top = (this.textbox.offsetHeight + 2) + "px";
        //this.container.style.visibility = "visible";
        this.container.style.display = "block";
    };


    AutoSuggestControl.prototype.typeAhead = function (sSuggestion /*:String*/) {

        //check for support of typeahead functionality
        if (this.textbox.createTextRange || this.textbox.setSelectionRange) {
            var iLen = this.textbox.value.length;
            setNewValue(sSuggestion);
            var selectionLength = sSuggestion.length - getCurrentValue().length;
            this.selectRange(iLen, sSuggestion.length);
        }
    };



    var oTextbox = this.add(new AutoSuggestControl(inputBox.container, null));


    this.setDataCallBack = function (dataCallBack) {
        callBackOnChange = dataCallBack;
    }

    this.setCompleteDataCallBack = function (callbackCompleteValue) {
        callBackCompleteValue = callbackCompleteValue;
    }

    this.triggerAutoComplete = function (cSuggestions) {
        oTextbox.handleSuggestion(cSuggestions);

    }

    this.inputBox = inputBox;
    this.style = inputBox.style;
    this.value = function () { return inputBox.container.value; };

    // do not use this.focus = input.focus; as this behaves strange
    // same for setSelectionRange/addEventListener
    this.setSelectionRange = function (start, end) {
        inputBox.container.setSelectionRange(start, end);
    }

    this.addEventListener = function (type, listener) {
        inputBox.container.addEventListener(type, listener);
    }

    this.focus = function () {
        inputBox.container.focus();
    }

    this.setValue = function (value) {
        if (value === null || value === undefined) return;
        inputBox.container.value = value;
    }

    this.setMaxLength = function (maxLength) {
        inputBox.container.maxLength = maxLength;
    }

    this.setWidth = function (width) {
        inputBox.container.style.width = (width - 4) + "px";
    }

    this.setPlaceHolder = function (placeHolder) {
        inputBox.container.placeholder = placeHolder;
    }

    this.setOnEnter = function (onEnter) {

        inputBox.container.setOnEnter(onEnter);
    }

    this.setOnChange = function (onChange) {
        inputBox.container.addEventListener("change", onChange);
    }

    this.hasChanged = function () {
        return inputBox.container.hasChanged();
    }

    this.enable = function () {
        inputBox.container.disabled = false;
    }

    this.disable = function () {
        inputBox.container.disabled = true;
    }

    this.isDisabled = function () {
        return inputBox.container.disabled;
    }

    this.setSeparator = function (separatorIn) {
        separator = separatorIn;

    }
    this.getLastValue = function () {
        return getCurrentValue();
    }

};

innovaphone.ui1.AutoCompleteInput.prototype = innovaphone.ui1.nodePrototype;
