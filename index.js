//*******************HELPERS*************************** */

function forEachIn(object, action) {
    for (var property in object) {
        if (Object.prototype.hasOwnProperty.call(object, property))
            action(property, object[property]);
    }
}


//Dictionary proto

function Dictionary(startValues) {
    this.values = startValues || {};
}
Dictionary.prototype.store = function(name, value) {
    this.values[name] = value;
};
Dictionary.prototype.lookup = function(name) {
    return this.values[name];
};
Dictionary.prototype.contains = function(name) {
    return Object.prototype.hasOwnProperty.call(this.values, name) &&
        Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Dictionary.prototype.each = function(action) {
    forEachIn(this.values, action);
};
Dictionary.prototype.numToProp = function(number) {
    return Object.keys(this.values)[number];
};

//Point proto

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.getX = function() { return this.x };
Point.prototype.getY = function() { return this.y };

Point.prototype.add = function(point) {
    const x = this.getX() + point.getX();
    const y = this.getY() + point.getY();
    return new Point(x, y);
};

Point.prototype.isEqualTo = function(point) {
    if (point.getX() === this.x && point.getY() === this.y)
        return true;
    else return false;
};

Point.prototype.toString = function() {
    console.log(`Point (x = ${this.x}, y = ${this.y})`);
};

const directions = new Dictionary({
    "n": new Point(0, -1),
    "ne": new Point(1, -1),
    "e": new Point(1, 0),
    "se": new Point(1, 1),
    "s": new Point(0, 1),
    "sw": new Point(-1, 1),
    "w": new Point(-1, 0),
    "nw": new Point(-1, -1)
});


//************************MODEL*************** */

//Grid proto

function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
}
Grid.prototype.valueAt = function(point) {
    return this.cells[point.y * this.width + point.x];
};
Grid.prototype.setValueAt = function(point, value) {
    this.cells[point.y * this.width + point.x] = value;
};
Grid.prototype.isInside = function(point) {
    return point.x >= 0 && point.y >= 0 &&
        point.x < this.width && point.y < this.height;
};
Grid.prototype.moveValue = function(from, to) {
    this.setValueAt(to, this.valueAt(from));
    this.setValueAt(from, undefined);
};

Grid.prototype.each = function(action) {
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            const currentPoint = new Point(x, y);
            action(currentPoint, this.valueAt(currentPoint));
        }
    }
};

Grid.prototype.listSurroundings = function(center) {
    const surroundings = {};
    const self = this;
    directions.each((direction, point) => {
        const gridPoint = center.add(point);
        let value = null;
        if (self.isInside(gridPoint))
            value = self.valueAt(gridPoint);
        surroundings[direction] = value;
    });
    return surroundings;
};

Grid.prototype.calculateLife = function(point) {
    const surroundings = this.listSurroundings(point);
    const liveCount = Object.values(surroundings).filter(value => value == true).length;
    if (this.valueAt(point)) {
        if (liveCount == 2 || liveCount == 3)
            return true;
        else return false;
    } else if (!this.valueAt(point) && liveCount == 3)
        return true;
    else return false;
};

Grid.prototype.toString = function() {
    for (let y = 0; y < this.height; y++) {
        let output = "";
        for (let x = 0; x < this.width; x++) {
            const currentPoint = new Point(x, y);
            output += characterFromElement(this.valueAt(currentPoint));
        }
        console.log(output);
    }
};

//Game proto

function Game(width, height) {
    let grid = new Grid(width, height);
    grid.each((point) => {
        const value = Math.random() > 0.5 ? true : false;
        grid.setValueAt(point, value);
    });
    this.grid = grid;
}

Game.prototype.turn = function() {
    // const grid = JSON.parse(JSON.stringify(this.grid));
    // grid.prototype = Object.create(Grid.prototype);
    // grid.prototype.constructor = Grid;
    let grid = this.grid;
    const nextGrid = new Grid(grid.width, grid.height);
    grid.each((point) => {
        nextGrid.setValueAt(point, grid.calculateLife(point));
    });
    this.grid = Object.create(nextGrid);
};

Game.prototype.toString = function() {
    let output = "";
    const endOfLine = this.grid.width - 1;
    this.grid.each((point, value) => {
        output += (value ? "+" : ".");
        if (point.x === endOfLine) {
            output += "\n";
        }
    });
    return output;
};

//****************CONTROLLER************************* */
function Controller(model) {
    this.model = model;
    this.timer = null;
}

Controller.prototype.handleNextGen = function(event) {
    this.model.turn();
    //event.preventDefault();
    console.log(this.model.toString());
};

Controller.prototype.start = function() {
    this.timer = setInterval(() => {
        this.handleNextGen(event);
    }, 2000);
};

Controller.prototype.stop = function() {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
};


//**************************PROGRAM********************** */



//test
const game = new Game(10, 3);
console.log(game.toString());
game.turn();
console.log(game.toString());

//test controller
const controller = new Controller(game);
const nextGenBut = document.querySelector("#next");
nextGenBut.addEventListener("click", event => {
    controller.handleNextGen(event);
});

const startBut = document.querySelector("#start");
startBut.addEventListener("click", event => {
    controller.start();
});

const stopBut = document.querySelector("#stop");
stopBut.addEventListener("click", event => {
    controller.stop();
});