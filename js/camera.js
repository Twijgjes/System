SYS.Camera = function( gameObject ) {
  this.game =  gameObject;
  this.pos = new SYS.Vector2(0,0);
  this.viewport = [gameObject.settings.WIDTH, gameObject.settings.HEIGHT];
  this.objToFollow = null;
  this.followDistance = 200;
  this.scale = 1;
  this.moveSpeed = 5;
};

SYS.Camera.prototype = {

  update: function() {
//    if( this.objToFollow && this.objToFollow.position.distanceTo(this.position) > this.followDistance ) {
//      this.position
//    }
  },
  
  move: function(vec) {
    vec.multiplyScalar(this.moveSpeed / this.scale)
    this.pos.add(vec);
  }
};

