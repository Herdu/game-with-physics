let backgroundImg;
let car;
let myBox;
let myCircle;

let defaultCategory = 0x0001;

function setup() {
    window.decomp = decomp;
    pixelDensity(1);
    let canvas = createCanvas(800, 600);
    canvas.parent("canvasContainer");

    backgroundImg = loadImage('./../img/background.jpg');
    backgroundImg.resize(canvas.width, canvas.height);

    world = new World();

    myBox = Matter.Bodies.rectangle(50,50,50,50);

    for(let i = 0; i < 40; i++) {
        myCircle = Matter.Bodies.circle(400 + Math.random() * 100, 5,5, {
            friction: 1,
        });
        world.add(myCircle);

    }

    car = new Car(world);
    world.add(myBox);
    imageMode(CENTER);
}

function draw() {
    clear();
    let offset = car.body[0].position;

    let bgSpeed = 0.9;
    let width = backgroundImg.width;

    let backgroundOffset = {
        x: ((offset.x)*bgSpeed),
        y: ((offset.y)*bgSpeed)
    };

    while(backgroundOffset.x > offset.x - width) {
        backgroundOffset.x -= width;
    }

    translate(-offset.x + canvas.width/2, -offset.y + canvas.height/2);
    background(0,0,255);
    noStroke();

    image(backgroundImg, backgroundOffset.x + width , offset.y);
    image(backgroundImg, backgroundOffset.x + width * 2, offset.y);
    fill(0,255,0);
    world.draw();

    processKey();
}

function processKey() {
    if (keyIsDown(LEFT_ARROW)) {
        car.drive(-1);
    } else if (keyIsDown(RIGHT_ARROW)) {
        car.drive(1);
    }
    return false; // prevent any default behaviour
}