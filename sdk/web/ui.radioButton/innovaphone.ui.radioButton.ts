
namespace innovaphone.ui {
    export class radioButton {
        funcOnClick: (selection: string) => void;
        container: HTMLElement;
        groupName: string;
        vertical: boolean;
        constructor(container: HTMLElement, groupName: string, elements: string[], funcOnClick: (selection: string) => void, defaultSelection :string, vertical?: boolean) {
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

        private makeRadioButton = (name: string, value: string, checked: boolean, vertical: boolean): HTMLLabelElement => {

            var label = document.createElement("label");
            var radio = document.createElement("input");
            var breakLine = document.createElement("br");
            radio.type = "radio";
            radio.name = name;
            radio.value = value;
            radio.checked = checked;
            radio.addEventListener("click", this.onclick);
            label.appendChild(radio);
            label.appendChild(document.createTextNode(value));
            if (vertical)
                label.appendChild(breakLine);
            return label;
        }

        public getSelected = (): string => {
            var selection: string = (<HTMLInputElement>document.querySelector('input[name = "' + this.groupName + '"]:checked')).value;
            return selection;
        }

        private onclick = (): void => {
            var selection: string = this.getSelected();

            if (this.funcOnClick) {
                this.funcOnClick(selection);
            }
        }

    }
    
}


