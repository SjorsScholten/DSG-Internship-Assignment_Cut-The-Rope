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
    options: {
        width: 800,
        height: 400,
        wireframes: false
    }
});

Render.run(render);

var ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });

var group = Matter.Body.nextGroup(true);

var node1 = Bodies.circle(400, 50, 5, {
    collisionFilter: {group: group},
    isStatic: true
});

var candy = Bodies.circle(400, 100, 20, {
    collisionFilter: {group: group},
});

var rope = Matter.Composites.stack(400, 50, 10, 1, 0, 0, function (x, y) {
    return Bodies.rectangle(x - 6, y, 12, 6, {
        collisionFilter: { group: group },
        chamfer: {radius: 3},
        density: 0.005,
        frictionAir: 0.05,
        render: {
            fillStyle: '#575375'
        }
    });
});

Matter.Composites.chain(rope, 0.3, 0, -0.3, 0, {
    stiffness: 0,
    length: 0,
    render: {
        visible: false
    }
});

var mouse = Matter.Mouse.create(render.canvas),
mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.1,
        render: {
            visible: false
        }
    }
});

render.mouse = mouse;

var constraint1 = Matter.Constraint.create({
    bodyA: node1,
    bodyB: rope.bodies[0],
    render: {
        visible: false
    }
});

var constraint2 = Matter.Constraint.create({
    bodyA: candy,
    bodyB: rope.bodies[rope.bodies.length - 1],
    length: candy.circleRadius,
    render: {
        visible: false
    }
});

World.add(world, [candy, rope, ground, mouseConstraint, node1, constraint1, constraint2]);


Matter.Events.on(engine, 'collisionStart', function(event){
    var pairs = event.pairs;

    console.log(pairs);
});

Engine.run(engine);