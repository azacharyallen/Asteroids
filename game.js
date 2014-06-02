(function (root) {
var Asteroids = root.Asteroids = (root.Asteroids || {});

var frames = 0;
var fps = 0;

var img = new Image();
img.onload = function () {
  ctx.drawImage(img, 0, 0);
};
img.src = 'space.jpeg';


window.setInterval(function() {
  fps = frames;
  frames = 0;
  }, 1000);

var Game = Asteroids.Game = function(context, numAsteroids) {
  this.context = context;
  this.asteroids = [];
  this.bullets = [];
  this.seedAsteroids(numAsteroids);
  this.ship = new Asteroids.Ship();
};

var DIM_X = Game.DIM_X = 1280;
var DIM_Y = Game.DIM_Y = 600;
var CENTER = Game.CENTER = [DIM_X / 2, DIM_Y / 2];
var RATE = Game.RATE = 30;
var loop = undefined;


Game.prototype.seedAsteroids = function (num) {
  for (var i = 0; i < num; i++) {
    this.asteroids.push(Asteroids.Asteroid.randomAsteroid());
  };
};

Game.prototype.start = function() {
  var game = this;
  loop = window.setInterval(function() {
    game.step();},
    RATE);
};

Game.prototype.step = function () {
  this.move();
  this.draw();
  this.checkShipCollisions();
  this.gameOver();

  // ACTIONS
  var keys = key.getPressedKeyCodes();

  if (keys.indexOf(65) > -1) {
    this.ship.thrust("left");
  };
  if (keys.indexOf(87) > -1) {
    this.ship.thrust("up");
  };
  if (keys.indexOf(68) > -1) {
    this.ship.thrust("right");
  };
  if (keys.indexOf(83) > -1) {
    this.ship.thrust("down");
  };
  if (keys.indexOf(88) > -1) {
    this.ship.thrust("stop");
  };
  if (keys.indexOf(37) > -1) {
    this.ship.rotate("cClockwise");
  };
  if (keys.indexOf(39) > -1) {
    this.ship.rotate("clockwise");
  };
  if (keys.indexOf(38) > -1) {
    this.fireBullet();
  };
  frames += 1;
};

Game.prototype.move = function() {
  game = this;
  this.ship.move();

  var asteroids = this.asteroids;
  this.asteroids.forEach(function(asteroid) {
      asteroid.move();

      collidingObjects = asteroid.isCollidedWith(asteroids);
      if (collidingObjects.length > 0){
        asteroid.bounce(collidingObjects[0]);
      };
  });

  var bullets = this.bullets;
  this.bullets.forEach(function(bullet) {
      bullet.move();
      if(bullet.offEdge()) {
        game.removeBullet(bullet);
      };

      collidingObjects = bullet.isCollidedWith(asteroids);
      if (collidingObjects.length > 0){
        var asteroid = collidingObjects[0];
        game.removeAsteroid(asteroid);
        game.removeBullet(bullet);
      };
  });
};

Game.prototype.draw = function () {
  this.context.clearRect(0, 0, DIM_X, DIM_Y);
  var context = this.context;
  context.drawImage(img, 0, 0);
  context.fillText(fps + " fps", 5, 10);
  this.ship.draw(context);

  this.asteroids.forEach(function(asteroid) {
      asteroid.draw(context);
    });

    this.bullets.forEach(function(bullet) {
      bullet.draw(context);
    });
};

Game.prototype.checkShipCollisions = function() {

  if (this.ship.isCollidedWith(this.asteroids).length > 0) {
    window.clearInterval(loop);
    alert("YOU DIED");

  };
};

Game.prototype.fireBullet = function() {
  var bullet = this.ship.fireBullet();
  if (bullet) {
    this.bullets.push(bullet);
  };
};

Game.prototype.removeBullet = function(bullet) {
  var bulletIndex = this.bullets.indexOf(bullet);
  this.bullets.splice(bulletIndex, 1);
};

Game.prototype.removeAsteroid = function(asteroid) {
  var asteroidIndex = this.asteroids.indexOf(asteroid);
  this.asteroids.splice(asteroidIndex, 1);
};

Game.prototype.gameOver = function () {
  if(this.asteroids.length === 0) {
    alert("YOU DEFEATED ASTEROIDS");
    window.clearInterval(loop);
  } else {
    return false;
  };
};

Game.prototype.bindKeyHandlers = function () {
  var ship = this.ship;
  var game = this;
  key('up', function(){ ship.thrust('up'); });
  key('down', function(){ ship.thrust('down'); });
  key('left', function(){ ship.thrust('left'); });
  key('right', function(){ ship.thrust('right'); });
  key('x', function(){ ship.thrust('stop'); });
  key('z', function(){ game.fireBullet(); });
};

})(this);