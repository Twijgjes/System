SYS.Game = function(userSettings) {
  
  this.isInitialized = false;
  
  this.settings = {
    canvas: null,
    context: null,
    WIDTH: null,
    HEIGHT: null,
    debug: null,
    bounds: 5000,
    speed: 0.005
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
    this.GUI = new SYS.GUI( this );
    //SYS.Utils.makeRandomObjects();
    new SYS.StationaryPhysicsBody( this, 50000, 40, new SYS.Vector2( this.settings.WIDTH / 2, this.settings.HEIGHT / 2 ), new SYS.Vector2( 0, 0 ) );
    new SYS.GUI.Notification( this, 300, 10, 500, 150, 'Hey there! <br> The big yellow blob you see is a star. Throw asteriods into its orbit by clicking, dragging and then releasing the left mouse button!' );
    
    this.update( );
    
    this.isInitialized = true;
  },
  
  update: function() {
    //console.log( 'updating' );
    this.settings.context.fillStyle = '#000000';
    this.settings.context.fillRect( 0, 0, this.settings.WIDTH, this.settings.HEIGHT );    
    
    // Update step
    for ( var n in this.physicsObjects )
    {
      this.physicsObjects[n].simulate( this.settings.speed );
    }
    
    //SYS.Utils.spawnObjectsOnTimer();
    
    // Render step
    for ( var n in this.drawables )
    {
      this.drawables[n].draw( this.settings.canvas, this.settings.context );
      if ( this.vectorLine ) this.vectorLine.draw( this.settings.canvas, this.settings.context );
    }
    
    this.infoObject.updateInfo( this.settings.speed, this.physicsObjects.length );
    
    var newTime = Date.now();
    var ms = newTime - this.currentTime;
    this.fpsUpdateCounter += ms;
    this.currentTime =  newTime;
    this.fps = 1000 / ms;
    
    if(this.fpsUpdateCounter > 500) {
        document.title = 'System FPS: ' + this.fps;
        this.fpsUpdateCounter = 0;
    }
    
    requestAnimFrame( this.update.bind(this) );
  }
  
};