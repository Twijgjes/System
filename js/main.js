SYS = function( )
{
  this.version = '0.1';
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  this.WIDTH = this.canvas.width = window.innerWidth;
  this.HEIGHT = this.canvas.height = window.innerHeight;
  this.idCounter = 0;
  this.id = this.idCounter++;
  this.spawnCounter = 0;
  this.bounds = 5000;
  this.vectorLine;
  this.speed = 1 / 200;
  this.debug = true;
  this.fps = 0;
  this.fpsUpdateCounter = 0;
  this.currentTime = Date.now();
  
};

SYS.prototype = {
  
  constructor: SYS,
  
  initialise: function( )
  {
    this.drawables = [ ];
    this.physicsObjects = [ ];
    this.Math = new SYS.Math();
    this.delta; //// TODO
    this.controls = new SYS.Controls();
    
    window.requestAnimFrame = ( function ( callback ) 
    {
      return window.requestAnimationFrame || 
             window.webkitRequestAnimationFrame || 
             window.mozRequestAnimationFrame || 
             window.oRequestAnimationFrame || 
             window.msRequestAnimationFrame ||
             function( callback ) {
               window.setTimeout(callback, 1000 / 60);
             };
    })();
    
    this.infoObject = new SYS.GUIInfo();
    //this.makeRandomObjects();
    new SYS.StationaryPhysicsBody( 50000, 40, new SYS.Vector2( this.WIDTH / 2, this.HEIGHT / 2 ), new SYS.Vector2( 0, 0 ) );
    this.update( );
    
  },
  
  update: function( )
  {
    //console.log( 'updating' );
    this.context.fillStyle = 'black';
    this.context.fillRect( 0, 0, this.WIDTH, this.HEIGHT );    
    
    // Update step
    for ( var n in this.physicsObjects )
    {
      this.physicsObjects[n].simulate();
    }
    
    //this.spawnObjectsOnTimer();
    
    // Render step
    for ( var n in this.drawables )
    {
      this.drawables[n].draw();
      if ( this.vectorLine ) this.vectorLine.draw();
    }
    
    this.infoObject.updateInfo( this.speed, this.physicsObjects.length );
    
    var newTime = Date.now();
    var ms = newTime - this.currentTime;
    this.fpsUpdateCounter += ms;
    this.currentTime =  newTime;
    this.fps = 1000 / ms;
    
    if(this.fpsUpdateCounter > 500) {
        document.title = 'System FPS: ' + this.fps;
        this.fpsUpdateCounter = 0;
    }
    
    requestAnimFrame( function() {
      SYS.update();
    });
    
  },
  
  makeRandomObjects: function( )
  {
    
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
  
  spawnObjectsOnTimer: function( )
  {
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