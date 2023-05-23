// Constructor function
function Cat(name, color, type) {
    this.name = name;
    this.color = color
    this.type = type

    this.meow = function () {
        console.log(`${this.name} meow meow`);
    }
}

Cat.prototype.run = function () {
    handle(this.meow)
}

let meow = new Cat('Meow', 'White', 'Bengal');
meow.run();

function handle(cb) {
    cb();
}

// class
class Car {
    constructor(name, color, type) {
        this.name = name;
        this.color = color;
        this.type = type;
    };
    bip() {
        console.log(`${this.name} bipbip`);
    }
    run() {
        handle(this.meow)
    }
}
let car = new Cat('BMW', 'Black', 'Audi');
car.run();