import * as Matter from 'matter-js'

export = class RopeCreator{

  constructor(){}

  CreateRope(objectA:Matter.Body, objectB:Matter.Body, group:number){
    var particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }},
        constraintOptions = { stiffness: 1 },
        clothrope = Matter.Composites.softBody(10, 10, 5, 1, 5, 5, false, 8, particleOptions, constraintOptions),
        candycloth = Matter.Constraint.create({ bodyA: objectA, bodyB: clothrope.bodies[0], length: 0 }),
        nodecloth = Matter.Constraint.create({ bodyA: objectB, bodyB: clothrope.bodies[clothrope.bodies.length -1], length: 0 }),
        rope = [clothrope, candycloth, nodecloth];
      console.log(['created rope', rope]);
      return rope;
  }
}

class Rope {
  cloth:Matter.Composite;
  clothToObjectA:Matter.Constraint;
  clothToObjectB:Matter.Constraint;

  constructor(cloth:Matter.Composite, clothToObjectA:Matter.Constraint, clothToObjectB:Matter.Constraint){
    this.cloth = cloth;
    this.clothToObjectA = clothToObjectA;
    this.clothToObjectB = clothToObjectB;
  }
}
