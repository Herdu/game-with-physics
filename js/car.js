class Car {
    constructor(world) {
        this.collisionGroup = 2;

        this.width = 200;
        this.height = 100;
        this.color = color(255,0,0);

        this.wheelImg = loadImage('./../img/wheel.png', (img)=> {
            img.resize(60,60);
        });

        let x = 300, y = 100;

        this.body = [];
        this.wheels = [];


        let bodyOptions = {
            collisionFilter: {
                category: 0x0002,
                mask: 0x0002,
            },
            weight: 100000,
        };

        let carBody = Matter.Bodies.rectangle(x, y - 40, 150, 30, bodyOptions);
        carBody.color = color(255,0,0);
        this.body.push(carBody);

        let wheelOptions = {
            collisionFilter: {
                category: 0x0001,
                mask: 0x0001,
            },
            friction: 1,
        };

        let leftWheel = Matter.Bodies.circle( x - 50, y, 30, wheelOptions);
        leftWheel.background = {
            img: this.wheelImg
        };


        this.wheels.push(leftWheel);

        let rightWheel = Matter.Bodies.circle( x + 50, y, 30, wheelOptions);
        rightWheel.background = {
            img: this.wheelImg
        };
        this.wheels.push(rightWheel);

        let suspensionStiffness = 0.6;
        let suspensionDamping = 0.7;

        let leftSuspensionConstraint = Matter.Constraint.create({
            bodyA: leftWheel,
            bodyB: carBody,
            pointB: {
              x: -(carBody.position.x - leftWheel.position.x) - 20,
              y: 0
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });

        let leftSuspensionConstraint2 = Matter.Constraint.create({
            bodyA: leftWheel,
            bodyB: carBody,
            pointB: {
                x: -(carBody.position.x - leftWheel.position.x) + 20,
                y: 0
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });

        let rightSuspensionConstraint = Matter.Constraint.create({
            bodyA: rightWheel,
            bodyB: carBody,
            pointB: {
                x: -(carBody.position.x - rightWheel.position.x) - 20,
                y: 0,
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });

        let rightSuspensionConstraint2 = Matter.Constraint.create({
            bodyA: rightWheel,
            bodyB: carBody,
            pointB: {
                x: -(carBody.position.x - rightWheel.position.x) + 20,
                y: 0,
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });

        world.add(this.body);
        world.add(this.wheels);
        world.add(leftSuspensionConstraint);
        world.add(leftSuspensionConstraint2);
        world.add(rightSuspensionConstraint);
        world.add(rightSuspensionConstraint2);
    }

    drive(value) {
        this.wheels.forEach((item)=>{
            Matter.Body.setAngularVelocity(item, value*0.2);
        })
    }
}