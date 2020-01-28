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
    options: { width: 800, height: 400, wireframes: false }
});

Render.run(render);
Engine.run(engine);

var group = Matter.Body.nextGroup(true);

var ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });
var goal = Bodies.rectangle(600, 300, 25,25, { isSensor: true, isStatic: true });
var candy = Bodies.circle(400, 100, 20, { collisionFilter: {group: group}});

var node1 = Bodies.circle(400, 100, 10, { collisionFilter: {group: group}, isStatic: true });
var node2 = CreateNode(100,50);
var sensorNode2 = CreateActivatableNode(node2, 25);

var ropes;

//Mouse script
var isCutting = false;
var cuttingSensor = Matter.Bodies.circle(100,200,10, {
  isStatic: true,
  isSensor: true,
  render: { strokeStyle: '#C44D58', fillStyle: 'transparent', lineWidth: 1}
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

//Matter.Events.on(mouseConstraint, 'mousedown', function(Event){ setCutting(true); });
//Matter.Events.on(mouseConstraint, 'mouseup', function(event){ setCutting(false); });
Matter.Events.on(mouseConstraint, 'mousemove', function(event){
  //var b = event.source.body;
  //if(b != null){
  //  World.remove(world, event.source.body);
  //}
});

function setCutting(value){
  isCutting = value;
  cuttingSensor.render.visible = isCutting;
  if(isCutting){ mouseConstraint.body = cuttingSensor; }
  else{ mouseConstraint.body = null; }
}

World.add(world, [ground, candy, node1, mouseConstraint]);
World.add(world, CreateRope(candy, node1));
World.add(world, [node2, sensorNode2]);
World.add(world, cuttingSensor);

Matter.Events.on(engine, 'collisionStart', function(event){
    var pairs = event.pairs;

    pairs.forEach(pair => {
        var a = pair.bodyA;
        var b = pair.bodyB;
        //Candy enters goal
        //create rope between node and candy
        if((a === candy && b === sensorNode2) || (b === candy && a === sensorNode2)){
            World.add(world, CreateRope(a,b));
        }
        //delete rope when cut
    });
});

Matter.Events.on(engine, 'collisionEnd', function(event) {
    //Candy out of bounds condition
});

function CreateNode(x,y){
    return Bodies.circle(x, y, 10, { collisionFilter: {group: group}, isStatic: true });
}

function CreateActivatableNode(node, radius){
    var sensor = Bodies.circle(node.position.x, node.position.y, radius, {
        isSensor: true,
        isStatic: true,
        render: { strokeStyle: '#C44D58', fillStyle: 'transparent', lineWidth: 1 }
    });

    return sensor;
}

function CreateRope(objectA, objectB){
  var particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }},
      constraintOptions = { stiffness: 1 },
      clothrope = Matter.Composites.softBody(10, 10, 5, 1, 5, 5, false, 8, particleOptions, constraintOptions),
      candycloth = Matter.Constraint.create({ bodyA: objectA, bodyB: clothrope.bodies[0], length: 0 }),
      nodecloth = Matter.Constraint.create({ bodyA: objectB, bodyB: clothrope.bodies[clothrope.bodies.length -1], length: 0 }),
      rope = [clothrope, candycloth, nodecloth];
    console.log(['created rope', rope]);
    return rope;
}
