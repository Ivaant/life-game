import { Point, directions } from "./helpers.js";

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

Grid.prototype.setValueByIndex = function(index, value) {
    this.cells[index] = value;
}
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
    this.grid = grid;
    this.populate();
    this.observers = [];
}

Game.prototype.populate = function() {
    let grid = this.grid;
    grid.each((point) => {
        const value = Math.random() > 0.5 ? true : false;
        grid.setValueAt(point, value);
    });
    if (this.observers && this.observers.length)
        this.notifyObservers();
};

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
    this.notifyObservers();
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

Game.prototype.setValueByIndex = function(index, value) {
    this.grid.setValueByIndex(index, value);
    this.notifyObservers();
};

Game.prototype.subscribe = function(observer) {
    this.observers.push(observer);
};

Game.prototype.unsubscribe = function(observer) {
    const obsIndex = this.observers.indexOf(observer);
    if (obsIndex > -1)
        this.observers.splice(obsIndex, 1);
};

Game.prototype.notifyObservers = function() {
    this.observers.forEach(o => o.update());
};

export { Game };