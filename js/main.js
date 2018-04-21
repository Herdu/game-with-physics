let backgroundImg;
let car;
let mouse;

let defaultCategory = 0x0001;

function setup() {
    window.decomp = decomp;
    pixelDensity(1);
    let canvas = createCanvas(settings.resolutionX, settings.resolutionY);
    canvas.parent("canvasContainer");

    backgroundImg = loadImage('./../img/background.jpg');
    backgroundImg.resize(canvas.width, canvas.height);

    world = new World();
    car = new Car(world);
    imageMode(CENTER);

    mouse = Matter.MouseConstraint.create(world.engine, {});


    Math.radians = function(degrees) {
        return degrees * Math.PI / 180;
    };
}

function draw() {
    clear();
    processKey();
    world.draw();
    car.process();

}

function processKey() {
    if (keyIsDown(LEFT_ARROW)) {
        car.drive(-1);
    } else if (keyIsDown(RIGHT_ARROW)) {
        car.drive(1);
    }

    if(keyIsDown(13)) {
        //enter
        setup();
    }

    return false; // prevent any default behaviour
}