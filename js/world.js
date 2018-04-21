class World {
    constructor() {
        this.engine = Matter.Engine.create();
        Matter.Engine.run(this.engine);

        this.defaultColor = color(200);

        this.makeGround();
    }

    makeGround() {

        let vertices = [];
        let numberOfVertices = 200;
        let step = 200;
        let posY = 100;

        vertices.push({
            x: -step,
            y: posY + 600
        });

        for(let i = 0; i<numberOfVertices; i++) {
            let x = i*step;
            let y = Math.round(posY + 30 * Math.sin(i)) + 100 * Math.random();

            vertices.push(Matter.Vector.create(x,y));
        }

        vertices.push({
            x:  (numberOfVertices) * step,
            y: posY + 600
        });

        this.ground = Matter.Bodies.fromVertices(numberOfVertices*step/2, 500, vertices, {
            isStatic: true,
            isGround: true,
            color: color(67,0,0),
            collisionFilter: {
                category: 0x0001
            }
        });
        console.log(vertices);
        console.log(this.ground);

        this.add(this.ground);
    }

    add(item) {
        if(item instanceof Array) {
            item.forEach((innerItem) => {
                Matter.World.add(this.engine.world, innerItem);
            })
        } else {
            Matter.World.add(this.engine.world, item);
        }
    }

    draw() {
        this.drawBackground();

        this.drawConstraints(this.engine.world.constraints);
        this.drawBodies(this.engine.world.bodies);

        this.engine.world.composites.forEach(item=>{
           this.drawBodies(item.bodies);
           this.drawConstraints(item.constraints);
        });

    }

    drawBody(item) {
        if(item.background) {
            push();
            translate(item.position.x, item.position.y);
            rotate(item.angle);
            image(item.background.img, 0,0);
            pop();
        } else {
            if(item.color) {
                fill(item.color);
            } else {
                fill(this.defaultColor);
            }

            let vertices = item.vertices;
            beginShape();
            for (let i = 0; i < vertices.length; i++) {
                vertex(vertices[i].x, vertices[i].y);
            }
            endShape();
        }
    }

    drawPart(item) {
        if(item.color) {
            fill(item.color);
            stroke(item.color);
        } else {
            fill(this.defaultColor);
            stroke(this.defaultColor);
        }


        let vertices = item.vertices;
        beginShape();
        for (let i = 0; i < vertices.length; i++) {
            vertex(vertices[i].x, vertices[i].y);
        }
        endShape();

        noStroke();
    }

    drawBodies(bodies) {
       bodies.forEach((item)=>{
            if(item.parts.length > 1) {
                item.parts.forEach((part, index)=> {
                    if(index) { //skip first
                        this.drawPart(part);
                    }
                });
            } else {
                this.drawBody(item);
            }
        })
    }

    drawConstraints(constraints) {

        stroke(126);

        constraints.forEach((item)=>{
            line(
                item.bodyA.position.x + item.pointA.x,
                item.bodyA.position.y + item.pointA.y,
                item.bodyB.position.x + item.pointB.x,
                item.bodyB.position.y + item.pointB.y,
            );

        })
        noStroke();
    }

    drawBackground() {
        let offset = car.body[0].position;


        let width = settings.resolutionX;

        let backgroundOffset = {
            x: ((offset.x)*settings.backgroundSpeed),
            y: ((offset.y)*settings.backgroundSpeed)
        };

        while((offset.x - backgroundOffset.x) > width) {
            backgroundOffset.x += width;
        }

        translate(-offset.x + settings.resolutionX/2, -offset.y + settings.resolutionY/2);
        background(0,0,255);
        noStroke();

        image(backgroundImg, backgroundOffset.x, offset.y, settings.resolutionX, settings.resolutionY);
        image(backgroundImg, backgroundOffset.x + width, offset.y, settings.resolutionX, settings.resolutionY);
        fill(0,255,0);
    }
}