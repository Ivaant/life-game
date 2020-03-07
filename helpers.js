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

export { Point, directions };