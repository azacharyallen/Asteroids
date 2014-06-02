(function (root) {
var Asteroids = root.Asteroids = (root.Asteroids || {});

Function.prototype.inherits = function(parentClass) {
  function Surrogate() {};
  Surrogate.prototype = parentClass.prototype;

  this.prototype = new Surrogate();
};

var COLOR = "red";
var RADIUS = 2;

var Bullet = Asteroids.Bullet = function (ship) {
  headingRad = ship.heading * (Math.PI / 180);
  var bulletVelocity = [Math.cos(headingRad) * 15, Math.sin(headingRad) * 15];

  Asteroids.MovingObject.call(
    this, [ship.centerX, ship.centerY], bulletVelocity, RADIUS, COLOR
  );
};

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.offEdge = function () {
    if (this.centerX > Asteroids.Game.DIM_X ||
      this.centerY > Asteroids.Game.DIM_Y ||
      this.centerX < 0 || this.centerY < 0) {
        return true;
      };
      return false;
  };
})(this);