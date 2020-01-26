import * as Matter from "matter-js";

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create();
var world = engine.world;

var render = Render.create({
    element: document.body,
    engine: engine,
    options : {
        width: 800,
        height: 400,
        wireframes: false
    }
});

Render.run(render);

var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });
var group = Matter.Body.nextGroup(true);

var rope = Matter.Composites.stack(0, 0, 15, 1, 0, 0, function(x:any,y:any){
    return Bodies.rectangle(x-20,y,53,20, {
        collisionFilter: {group:group},
        chamfer: {radius: 20},
        density: 0.005,
        frictionAir: 0.05,
        render: {
            fillStyle: '#575375'
        }
    });
});

Matter.Composites.chain(rope, 0.3, 0, -0.3, 0, {
    stiffness: 1,
    length: 0,
    render: {
        visible: false
    }
});

// add all of the bodies to the world
World.add(world, rope);
World.add(world, ground);

Engine.run(engine);

