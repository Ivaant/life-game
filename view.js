//**************************VIEW************************* */

function View(model, controller) {
    this.model = model;
    this.model.subscribe(this);
    this.controller = controller;
}

View.prototype.update = function() {
    const modelState = this.model.toString().split("");
    this.display(modelState);
};

View.prototype.display = function(stateArray) {
    let counter = 0;
    const display = document.querySelector("#display");
    while (display.firstChild)
        display.removeChild(display.firstChild);
    stateArray.forEach(elem => {
        if (elem === "\n") {
            const breakElem = document.createElement("br");
            display.appendChild(breakElem);
        } else {
            const chkbElem = document.createElement("input");
            chkbElem.type = "checkbox";
            chkbElem.id = counter++;
            if (elem === "+") {
                chkbElem.checked = true;
            } else {
                chkbElem.removeAttribute("checked");
            }
            chkbElem.onclick = event => {
                const checkboxElem = event.target;
                this.controller.handleCheckbox(checkboxElem);
            };
            display.appendChild(chkbElem);
        }
    });
};

export { View };