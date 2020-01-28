"use strict";
var Matter = require("matter-js");
var Rope = /** @class */ (function () {
    function Rope(cloth, clothToObjectA, clothToObjectB) {
        this.cloth = cloth;
        this.clothToObjectA = clothToObjectA;
        this.clothToObjectB = clothToObjectB;
    }
    return Rope;
}());
module.exports = /** @class */ (function () {
    function RopeCreator() {
    }
    RopeCreator.prototype.CreateRope = function (objectA, objectB, group) {
        var particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false } }, constraintOptions = { stiffness: 1 }, clothrope = Matter.Composites.softBody(10, 10, 5, 1, 5, 5, false, 8, particleOptions, constraintOptions), candycloth = Matter.Constraint.create({ bodyA: objectA, bodyB: clothrope.bodies[0], length: 0 }), nodecloth = Matter.Constraint.create({ bodyA: objectB, bodyB: clothrope.bodies[clothrope.bodies.length - 1], length: 0 }), rope = [clothrope, candycloth, nodecloth];
        console.log(['created rope', rope]);
        return rope;
    };
    return RopeCreator;
}());
