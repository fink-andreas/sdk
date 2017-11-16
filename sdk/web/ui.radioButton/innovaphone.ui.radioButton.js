var innovaphone;
(function (innovaphone) {
    var ui;
    (function (ui) {
        var radioButton = (function () {
            function radioButton(container, groupName, elements, funcOnClick, defaultSelection, vertical) {
                var _this = this;
                this.makeRadioButton = function (name, value, checked, vertical) {
                    var label = document.createElement("label");
                    var radio = document.createElement("input");
                    var breakLine = document.createElement("br");
                    radio.type = "radio";
                    radio.name = name;
                    radio.value = value;
                    radio.checked = checked;
                    radio.addEventListener("click", _this.onclick);
                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(value));
                    if (vertical)
                        label.appendChild(breakLine);
                    return label;
                };
                this.getSelected = function () {
                    var selection = document.querySelector('input[name = "' + _this.groupName + '"]:checked').value;
                    return selection;
                };
                this.onclick = function () {
                    var selection = _this.getSelected();
                    if (_this.funcOnClick) {
                        _this.funcOnClick(selection);
                    }
                };
                this.funcOnClick = funcOnClick;
                this.container = container;
                this.groupName = groupName;
                for (var i = 0; i < elements.length; i++) {
                    var checked = false;
                    if (elements[i] == defaultSelection) {
                        checked = true;
                    }
                    var newRadio = this.makeRadioButton(groupName, elements[i], checked, vertical || false);
                    container.appendChild(newRadio);
                }
            }
            return radioButton;
        }());
        ui.radioButton = radioButton;
    })(ui = innovaphone.ui || (innovaphone.ui = {}));
})(innovaphone || (innovaphone = {}));
//# sourceMappingURL=innovaphone.ui.radioButton.js.map