SYS.Utils = {
 
  extend: function(a, b) {
    
    //Check each property
    for(var key in b) {
      if(b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    
    //Return the extended object
    return a;
  },
  
  makeRandomObjects: function( ) {
    
    for ( var i = 0; i < 80; i++ )
    {
      var randomPos = new SYS.Vector2( Math.round( Math.random() * this.WIDTH ), Math.round( Math.random() * this.HEIGHT ) ),
        randomVel = new SYS.Vector2( ( Math.random() * 8 ) - 4, ( Math.random() * 8 ) - 4 ),
        randomMass = 4 + ( Math.random() * 6 ),
        randomDensity = Math.round( 0.5 + ( Math.random() * 0.5 ) );
      
      //console.log( randomPos.x + ' ' + randomPos.y + ' ' + randomDensity );
          
      new SYS.PhysicsBody( randomMass, randomDensity, randomPos, randomVel );
    }
  },
  
  spawnObjectsOnTimer: function( ) {
    if ( this.spawnCounter > 120 && this.physicsObjects.length < 100 )
    {
      for ( var i = 0; i < 30; i++ )
      {
        var randomPos = new SYS.Vector2( Math.round( Math.random() * (this.WIDTH * .8) ), Math.round( Math.random() * (this.HEIGHT * .8) ) ),
          randomVel = new SYS.Vector2( ( Math.random() * 800 ) - 400, ( Math.random() * 800 ) - 400 ),
          randomMass = 75 + ( Math.random() * 75 );
          
        new SYS.PhysicsBody( randomMass, 0, randomPos, randomVel );
      }
      console.log( "spawning" );
      this.spawnCounter = 0;
    }
    else
    {
      this.spawnCounter++;
    }
  },
  
};