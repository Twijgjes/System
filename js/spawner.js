SYS.Spawner = function( gameObject ) {
  this.game = gameObject;
  this.spawnOnTimer = false;
  this.spawnCounter = 0;
};

SYS.Spawner.prototype = {

  update: function() {
    if(this.spawnOnTimer) this.spawnObjectsOnTimer();
  },
  
  spawn: function(type, args) {
    
  },
  
  makeRandomObjects: function( ) {
    for ( var i = 0; i < 80; i++ ) {
      var randomPos = new SYS.Vector2( Math.round( Math.random() * this.game.settings.WIDTH ), Math.round( Math.random() * this.HEIGHT ) ),
        randomVel = new SYS.Vector2( ( Math.random() * 8 ) - 4, ( Math.random() * 8 ) - 4 ),
        randomMass = 4 + ( Math.random() * 6 ),
        randomDensity = Math.round( 0.5 + ( Math.random() * 0.5 ) );
      new SYS.PhysicsBody( randomMass, randomDensity, randomPos, randomVel );
    }
  },
  
  spawnObjectsOnTimer: function( ) {
    if ( this.spawnCounter > 120 && this.game.physicsObjects.length < 300 ) {
      for ( var i = 0; i < 20; i++ ) {
        var randomPos = new SYS.Vector2( Math.round( Math.random() * (this.game.settings.WIDTH * .8) ), 
                                         Math.round( Math.random() * (this.game.settings.HEIGHT * .8) ) 
                                       ),
            randomVel = new SYS.Vector2( ( Math.random() * 800 ) - 400,
                                         ( Math.random() * 800 ) - 400 
                                       ),
            randomMass = 75 + ( Math.random() * 75 );
            
        new SYS.PhysicsBody( this.game, randomMass, 0, randomPos, randomVel );
      }
      this.spawnCounter = 0;
      return;
    }
    this.spawnCounter++;
  },
  
  asteroids: function( pos, vel, amount ) {
    pos.x += this.game.camera.pos.x; 
    pos.y += this.game.camera.pos.y;
    pos.multiplyScalar( 1 / this.game.camera.scale );
    vel.multiplyScalar( 2 );
    vel.negate();
    for( var i = 0; i < amount; i++ ) {
      rPos = new SYS.Vector2().clone(pos);
      rPos.add( SYS.Utils.randVec(amount * 4) );
      new SYS.PhysicsBody( this.game, 100, 4, rPos, vel );
    }
  },
  
  asteroid: function( pos, vel ) {
    pos.x += this.game.camera.pos.x; 
    pos.y += this.game.camera.pos.y;
    pos.multiplyScalar( 1 / this.game.camera.scale );
    vel.multiplyScalar( 2 );
    vel.negate();
    
    new SYS.PhysicsBody( this.game, 100, 4, pos, vel );
  }
};

