/// <reference path="./Rope.ts" />

import * as Matter from "matter-js";
import RopeCreator = require('./Rope')

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
    options : { width: 800, height: 400, wireframes: false }
});

Render.run(render);

var ropts = new RopeCreator();

var group = Matter.Body.nextGroup(true);

var ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });
var goal = Bodies.rectangle(600, 300, 25,25, { isSensor: true, isStatic: true });
var candy = Bodies.circle(400, 100, 20, { collisionFilter: {group: group}});
var node1 = Bodies.circle(400, 100, 10, { collisionFilter: {group: group}, isStatic: true });

var rope1 = ropts.CreateRope(candy,goal,group);

// add all of the bodies to the world
World.add(world, [ground, goal, candy, node1]);
World.add(world, rope1[0]);
World.add(world, rope1[1]);
World.add(world, rope1[2]);

Engine.run(engine);
