//****************CONTROLLER************************* */
function Controller(model) {
    this.model = model;
    this.timer = null;
    this.nextGenBut, this.startBut, this.stopBut;
    this.subscribeHandlers();
}

Controller.prototype.subscribeHandlers = function() {

    this.populateBut = document.querySelector("#populate");
    this.populateBut.addEventListener("click", event => {
        this.handlePopulate(event);
    });

    this.nextGenBut = document.querySelector("#next");
    this.nextGenBut.addEventListener("click", event => {
        this.handleNextGen(event);
    });

    this.startBut = document.querySelector("#start");
    this.startBut.addEventListener("click", event => {
        this.start();
    });

    this.stopBut = document.querySelector("#stop");
    this.stopBut.addEventListener("click", event => {
        this.stop();
    });
};

Controller.prototype.handlePopulate = function(event) {
    this.model.populate();
}

Controller.prototype.handleNextGen = function(event) {
    this.model.turn();
};

Controller.prototype.handleCheckbox = function(checkboxElem) {
    this.model.setValueByIndex(checkboxElem.id, checkboxElem.checked);
};

Controller.prototype.start = function() {
    this.timer = setInterval(() => {
        this.handleNextGen(event);
    }, 1000);
};

Controller.prototype.stop = function() {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
};

export { Controller };