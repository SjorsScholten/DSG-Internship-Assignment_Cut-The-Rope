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
Engine.run(engine);

var ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });

var group = Matter.Body.nextGroup(true);

var node1 = CreateNode(400,50);
var node2 = CreateNode(100,50);
var sensorNode2 = CreateActivatableNode(node2, 10);

var candy = Bodies.circle(400, 100, 20, {
    collisionFilter: {group: group},
});

var goal = Bodies.rectangle(600, 300, 25,25, {
    isSensor: true,
    isStatic: true
});

var mouse = Matter.Mouse.create(render.canvas);
render.mouse = mouse;

var mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.1,
        render: {
            visible: false
        }
    }
});

World.add(world, [
    goal, 
    candy, 
    ground, 
    mouseConstraint, 
    node1, 
    node2, 
    sensorNode2
]);

CreateRope(node1, candy);

Matter.Events.on(engine, 'collisionStart', function(event){
    var pairs = event.pairs;

    pairs.forEach(pair => {
        var a = pair.bodyA;
        var b = pair.bodyB;
        //Candy enters goal
        //create rope between node and candy
        if((a === candy && b === sensorNode2) || (b === candy && a === sensorNode2)){
            CreateRope(a,b);
        }
        //delete rope when cut
    });
    
});

Matter.Events.on(engine, 'collisionEnd', function(event) {
    //Candy out of bounds condition
});

Matter.Events.on(mouseConstraint, 'mousedown', function(Event){
    //start cutting
});

Matter.Events.on(mouseConstraint, 'mouseup', function(event){
    //stop cutting
});

function CreateNode(x,y){
    //create node
    var node = Bodies.circle(x, y, 5, {
        collisionFilter: {group: group},
        isStatic: true
    });
    //create sensor (radius:number)
    //set Event (if object candy enters sensor create rope)

    return node
}

function CreateActivatableNode(node, radius){
    var sensor = Bodies.circle(node.position.x, node.position.y, radius, {
        isSensor: true,
        isStatic: true,
        render: {
            strokeStyle: '#C44D58',
            fillStyle: 'transparant'
        }
    });

    return sensor;
}

function CreateRope(objectA, objectB){
    var chain = Matter.Composites.stack(400, 50, 10, 1, 0, 0, function (x, y) {
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
    
    Matter.Composites.chain(chain, 0.3, 0, -0.3, 0, {
        stiffness: 0,
        length: 0,
        render: {
            visible: false
        }
    });

    var nodeRopeConstraint = Matter.Constraint.create({
        bodyA: objectA,
        bodyB: chain.bodies[0],
        render: {
            visible: false
        }
    });
    
    var candyRopeConstraint = Matter.Constraint.create({
        bodyA: objectB,
        bodyB: chain.bodies[chain.bodies.length - 1],
        length: candy.circleRadius,
        render: {
            visible: false
        }
    });

    World.add(world, [chain, nodeRopeConstraint, candyRopeConstraint]);
}