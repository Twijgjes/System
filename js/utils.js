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
      var randomPos = new SYS.Vector2( Math.round( Math.random() * gameObj.settings.WIDTH ), Math.round( Math.random() * this.HEIGHT ) ),
        randomVel = new SYS.Vector2( ( Math.random() * 8 ) - 4, ( Math.random() * 8 ) - 4 ),
        randomMass = 4 + ( Math.random() * 6 ),
        randomDensity = Math.round( 0.5 + ( Math.random() * 0.5 ) );
      
      //console.log( randomPos.x + ' ' + randomPos.y + ' ' + randomDensity );
          
      new SYS.PhysicsBody( randomMass, randomDensity, randomPos, randomVel );
    }
  },
  
  spawnObjectsOnTimer: function( gameObj ) {
    if ( gameObj.spawnCounter > 120 && gameObj.physicsObjects.length < 300 ) {
      
      for ( var i = 0; i < 20; i++ ) {
        var randomPos = new SYS.Vector2( Math.round( Math.random() * (gameObj.settings.WIDTH * .8) ), Math.round( Math.random() * (gameObj.settings.HEIGHT * .8) ) ),
          randomVel = new SYS.Vector2( ( Math.random() * 800 ) - 400, ( Math.random() * 800 ) - 400 ),
          randomMass = 75 + ( Math.random() * 75 );
          
        new SYS.PhysicsBody( gameObj, randomMass, 0, randomPos, randomVel );
      }
      console.log( "spawning" );
      gameObj.spawnCounter = 0;
      return;
    }
    
    gameObj.spawnCounter++;
    
  },
  
};