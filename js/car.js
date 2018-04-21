class Car {
    constructor(world) {
        this.collisionGroup = 2;

        this.width = 200;
        this.height = 100;
        this.color = color(255,0,0);

        this.wheelImg = loadImage('./../img/wheel.png', (img)=> {
            img.resize(60,60);
        });

        this.x = 700;
        this.y = -200;



        this.body = [];
        this.wheels = [];
        this.constraints = [];

        this.initBody();
        this.initArm();

        let composite = Matter.Composite.create();

        Matter.Composite.add(composite, this.body);
        Matter.Composite.add(composite, this.wheels);
        Matter.Composite.add(composite, this.constraints);
        world.add(composite);

    }


    initBody() {

        let wheelOffsetX = 70;
        let wheelOffsetY = 10;


        let bodyOptions = {
            collisionFilter: {
                category: 0x0002,
            },
            weight: 100000,
        };

        let carBody = Matter.Bodies.rectangle(this.x, this.y-20, 150, 30, bodyOptions);
        carBody.color = color(255,0,0);
        this.body.push(carBody);

        let wheelOptions = {
            collisionFilter: {
                category: 0x0011,
                mask: 0x0011,
            },
            friction: 1,
        };

        let leftWheel = Matter.Bodies.circle( this.x - wheelOffsetX, this.y - wheelOffsetY, 30, wheelOptions);
        leftWheel.background = {
            img: this.wheelImg
        };


        this.wheels.push(leftWheel);

        let rightWheel = Matter.Bodies.circle( this.x + wheelOffsetX, this.y - wheelOffsetY, 30, wheelOptions);
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
                y: -wheelOffsetY
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });

        let leftSuspensionConstraint2 = Matter.Constraint.create({
            bodyA: leftWheel,
            bodyB: carBody,
            pointB: {
                x: -(carBody.position.x - leftWheel.position.x) + 20,
                y: -wheelOffsetY
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });

        let rightSuspensionConstraint = Matter.Constraint.create({
            bodyA: rightWheel,
            bodyB: carBody,
            pointB: {
                x: -(carBody.position.x - rightWheel.position.x) - 20,
                y: -wheelOffsetY,
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });

        let rightSuspensionConstraint2 = Matter.Constraint.create({
            bodyA: rightWheel,
            bodyB: carBody,
            pointB: {
                x: -(carBody.position.x - rightWheel.position.x) + 20,
                y: -wheelOffsetY,
            },
            stiffness: suspensionStiffness,
            daping: suspensionDamping,
        });
        this.constraints.push(leftSuspensionConstraint);
        this.constraints.push(leftSuspensionConstraint2);
        this.constraints.push(rightSuspensionConstraint);
        this.constraints.push(rightSuspensionConstraint2);
    }

    initArm() {
        let carBody = this.body[0];

        let armOptions = {
            collisionFilter: {
                category: 0x0001,
                mask: 0x0001,
            },
            weight: 100000,
            color: color(0,0,255)
        };

        this.firstArm = Matter.Bodies.rectangle(this.x, this.y-40, 20, 60, armOptions);

        let bodyToArm1 = Matter.Constraint.create({
            bodyA: carBody,
            bodyB: this.firstArm,
            pointA: {
                x: -60,
                y: 0,
            },
            pointB: {
                x: 0,
                y: -20,
            },
            stiffness: 1
        });

        let bodyToArm2 = Matter.Constraint.create({
            bodyA: carBody,
            bodyB: this.firstArm,
            pointA: {
                x: 60,
                y: 0,
            },
            pointB: {
                x: 0,
                y: -20,
            },
            stiffness: 1
        });


        let bodyToArm3 = Matter.Constraint.create({
            bodyA: carBody,
            bodyB: this.firstArm,
            pointA: {
                x: -60,
                y: 0,
            },
            pointB: {
                x: 0,
                y: 30,
            },
            stiffness: 1
        });

        let bodyToArm4 = Matter.Constraint.create({
            bodyA: carBody,
            bodyB: this.firstArm,
            pointA: {
                x: 60,
                y: 0,
            },
            pointB: {
                x: 0,
                y: 30,
            },
            stiffness: 1
        });


        this.body.push(this.firstArm);
        this.constraints.push(bodyToArm1);
        this.constraints.push(bodyToArm2);
        this.constraints.push(bodyToArm3);
        this.constraints.push(bodyToArm4);



        //////////////2nd arm

        let arm2Options = {
            collisionFilter: {
                category: 0x1110,
            },
            weight: 100000,
            color: color(255,200,200)
        };

        this.secondArm = Matter.Bodies.rectangle(this.x, this.y-100, 15, 100, arm2Options);



        let arm1toArm2_1 = Matter.Constraint.create({
            bodyA: this.firstArm,
            bodyB: this.secondArm,
            pointA: {
                x: 0,
                y: -30,
            },
            pointB: {
                x: 0,
                y: 50,
            },
            stiffness: 1,
            length: 0,
        });


        this.body.push(this.secondArm);
        this.constraints.push(arm1toArm2_1);
    }

    drive(value) {
        this.wheels.forEach((item)=>{
            Matter.Body.setAngularVelocity(item, value*0.7);
        })
    }

    normalizeAngle(angle) {
        while(angle < 0) {
            angle+= 2*PI;
        }

        while(angle > 2*PI) {
            angle -= 2*PI;
        }

        return angle;
    }

    process() {
        let offset = this.body[0].position;

        if(offset.y > 1500) {
            setup();
            return;
        }

        let staticArm = this.firstArm;

        let staticX = staticArm.position.x;
        let staticY = staticArm.position.y - 30;

        let _mouseX = mouseX + offset.x - settings.resolutionX/2;
        let _mouseY = mouseY + offset.y - settings.resolutionY/2;


        let vector = Matter.Vector.create( _mouseX - staticX, _mouseY - staticY );

        let oldAngle = this.normalizeAngle(this.secondArm.angle);

        let angle = this.normalizeAngle(Matter.Vector.angle(Matter.Vector.create(0,1), vector) + PI/2);

        let carAngle = this.normalizeAngle(this.body[0].angle);

        let newAngle = angle;

        //console.log({angle: angle, armAngle: angle, newAngle: newAngle,});

        if(newAngle > carAngle + PI/2) {
            newAngle = carAngle + PI/2;
        }

        if(newAngle < carAngle - PI/2) {
            newAngle = carAngle - PI/2;
        }

        //;Matter.Body.setAngle(this.secondArm, newAngle);

        stroke(126);
        line(_mouseX, _mouseY, staticX, staticY);
    }
}