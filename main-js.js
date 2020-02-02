// module aliases
let Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies;

const screenSize = {x: 400, y:800},
candyRadius = 20,
ropes = [],
nodes = [];

let engine = Engine.create();
Engine.run(engine);

let render = Render.create({
    element: document.body,
    engine: engine,
    options: { width: screenSize.x, height: screenSize.y, wireframes: false }
});
Render.run(render);

let world = engine.world;

let mouse = Matter.Mouse.create(render.canvas),
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

let levelBounds = Bodies.rectangle(
    screenSize.x/2,
    screenSize.y/2,
    screenSize.x + candyRadius * 2,
    screenSize.y + candyRadius * 2, 
    { isStatic: true,
    isSensor: true,
    render: {visible: false}
});

var group = Matter.Body.nextGroup(true);

var mouseSensor = Bodies.circle(0,0,10, {
        isStatic: true, 
        isSensor:true,
        render : {fillStyle: '#cde5fd'}
    });

let ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true }),
goal = Bodies.rectangle(200, 700, 25,25, { isSensor: true, isStatic: true, render: {fillStyle: '#FFD700'} }),
candy = Bodies.circle(200, candyRadius, candyRadius, { collisionFilter: {group: group}, render: {fillStyle: '#F4C2C2'}});

initWorld();

function initWorld(){
    World.clear(world, false);
    
    ropes.splice(0,ropes.length);
    nodes.splice(0,nodes.length);

    Matter.Body.setPosition(candy, {x:200, y:candyRadius});

    World.add(world, [levelBounds, goal, candy, mouseSensor]);
    World.add(world, mouseConstraint);
    var node = CreateNode(200,100);
    World.add(world, node);
    World.add(world, CreateRope(candy, node, 5).array);
    World.add(world, CreateActivatableNode(200,400, 25).array);
}

Matter.Events.on(engine, 'beforeUpdate', function(){
    if(!mouse.position.x){return;}
    mouseSensor.render.visible = mouse.button == 0;

    Matter.Body.setPosition(mouseSensor, {
        x: mouse.position.x,
        y: mouse.position.y
    });
});

Matter.Events.on(engine, 'collisionStart', function(event){
    event.pairs.forEach(pair =>{
        if(comparePairToObject(pair, candy, goal)){
            Matter.Body.setStatic(candy, true);
            console.log("youve won the game");
        }

        nodes.forEach(node => {
            if(comparePairToObject(pair, candy, node.sensor)){
                World.add(world, CreateRope(candy, node.node, 5).array);
                World.remove(world, node.sensor);
            }
        });

        if(mouse.button == 0){
            ropes.forEach(rope => {
                var index = rope.rope.bodies.indexOf(pair.bodyB);
                if(index > -1){ rope.remove(); }
            });
        }
    });
})

Matter.Events.on(engine, 'collisionEnd', function(event) {
    event.pairs.forEach(pair => {
        if(comparePairToObject(pair, candy, levelBounds)){
            console.log(["candy left bounds", candy.position]);
            initWorld();
        }
    });
});

function CreateNode(x,y){
    return Bodies.circle(x, y, 10, { collisionFilter: {group: group}, isStatic: true });
}

function CreateActivatableNode(x,y, radius){
    var node = CreateNode(x,y),
    sensor = Bodies.circle(node.position.x, node.position.y, radius, {
        isSensor: true,
        isStatic: true,
        render: { strokeStyle: '#C44D58', fillStyle: 'transparent', lineWidth: 1 }
    }),
    object = {node: node, sensor: sensor, array: [node, sensor]};
    nodes.push(object);
    return object;
}

function comparePairToObject(pair, objectA, objectB){
    return  (pair.bodyA === objectA && pair.bodyB === objectB) || 
            (pair.bodyB === objectA && pair.bodyA === objectB);
}

function CreateRope(objectA, objectB, length){
    var particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }},
    constraintOptions = { stiffness: 1 },
    clothrope = Matter.Composites.softBody(objectA.position.x, objectA.position.y, length, 1, 2, 1, false, 8, particleOptions, constraintOptions),
    candycloth = Matter.Constraint.create({ bodyA: objectA, bodyB: clothrope.bodies[0], length: 0 }),
    nodecloth = Matter.Constraint.create({ bodyA: objectB, bodyB: clothrope.bodies[clothrope.bodies.length -1], length: 0 }),
    rope = {
        rope: clothrope, 
        objectA: candycloth, 
        objectB: nodecloth,
        array: [clothrope, candycloth, nodecloth],
        remove: function(){
            World.remove(world, this.array);
        }
    };
    ropes.push(rope);
    return rope;
}
