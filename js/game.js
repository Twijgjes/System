SYS.Game = function(userSettings) {
  
  this.isInitialized = false;
  
  this.settings = {
    canvas: null,
    context: null,
    WIDTH: null,
    HEIGHT: null,
    debug: null,
    bounds: 5000,
    speed: 0.0005
  };
  
  this.settings = SYS.Utils.extend(this.settings, userSettings);
  console.log(this.settings);
  
  this.initialize();
  
};

SYS.Game.prototype = {
  
  initialize: function() {
    this.drawables = [ ];
    this.physicsObjects = [ ];
//    this.Math = new SYS.Math();
    this.delta; // TODO
    this.controls = new SYS.Controls( this );
    this.vectorLine;
    this.fps = 0;
    this.fpsUpdateCounter = 0;
    this.currentTime = Date.now();
    this.idCounter = 0;
    this.id = this.idCounter++;
    this.spawnCounter = 0;
    
    
    this.GUI = new SYS.GUI( this );
    this.infoObject = new SYS.GUI.Info();
    //SYS.Utils.makeRandomObjects();
    
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
    
    this.isInitialized = true;
    
    this.progress = new SYS.Progression(this);
    
    this.update( );
    
    new SYS.StationaryPhysicsBody( this, 80000, 40, new SYS.Vector2( this.settings.WIDTH / 2, this.settings.HEIGHT / 2 ), new SYS.Vector2( 0, 0 ) );
    var pos = new SYS.Vector2( (this.settings.WIDTH / 2) + 300, (this.settings.HEIGHT / 2) + 300 );
    new SYS.PhysicsBody( this, 10000, 40, pos, new SYS.Vector2( 180, -180 ) );
    new SYS.PhysicsBody( this, 10000, 40, new SYS.Vector2( (this.settings.WIDTH / 2) - 200, (this.settings.HEIGHT / 2) - 200 ), new SYS.Vector2( -200, 200 ) );
    this.progress.startingBodies = 2;
  },
  
  update: function() {
    // Update step
    for ( var n in this.physicsObjects )
    {
      this.physicsObjects[n].simulate( this.settings.speed * this.deltaTime );
    }
    
    //SYS.Utils.spawnObjectsOnTimer( this);
    this.infoObject.updateInfo( this.settings.speed, this.physicsObjects.length );
    
    // Render step
    this.settings.context.fillStyle = '#000000';
    this.settings.context.fillRect( 0, 0, this.settings.WIDTH, this.settings.HEIGHT );
    
    for ( var n in this.drawables )
    {
      this.drawables[n].draw( this.settings.canvas, this.settings.context );
      if ( this.vectorLine ) this.vectorLine.draw( this.settings.canvas, this.settings.context );
    }
    
    this.checkFPS();
    this.progress.update();
    
    requestAnimFrame( this.update.bind(this) );
  },
  
  checkFPS: function() {
    var newTime = Date.now();
    this.deltaTime = newTime - this.currentTime;
    this.fpsUpdateCounter += this.deltaTime;
    this.currentTime =  newTime;
    this.fps = Math.round(1000 / this.deltaTime);
    
    if(this.fpsUpdateCounter > 250) {
        document.title = 'System v' + SYS.VERSION + ' FPS: ' + this.fps;
        this.fpsUpdateCounter = 0;
    }
  }
  
};