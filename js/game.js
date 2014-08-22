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
    this.energyUpdate = Date.now();
    this.controls = new SYS.Controls( this );
    this.vectorLine;
    this.fps = 0;
    this.fpsUpdateCounter = 0;
    this.currentTime = Date.now();
    this.idCounter = 0;
    this.id = this.idCounter++;
    this.calculations = 0;
    this.camera = new SYS.Camera( this );
    
    this.GUI = new SYS.GUI( this );
    this.infoObject = new SYS.GUI.Info();
    this.spawner = new SYS.Spawner( this );
    
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
    
    
    new SYS.StationaryPhysicsBody( this, 800000, 40, new SYS.Vector2( 0, 0 ), new SYS.Vector2( 0, 0 ) );
    var pos = new SYS.Vector2( 400, 400 );
    new SYS.PhysicsBody( this, 10000, 40, pos, new SYS.Vector2( 460, -460 ) );
    new SYS.PhysicsBody( this, 10000, 40, pos.negate(), new SYS.Vector2( -500, 500 ) );
    this.progress.startingBodies = 2;
  },
  
  update: function() {
    // Update step
    this.controls.processKeys();
    this.spawner.update();
    
    for ( var n in this.physicsObjects )
    {
      this.physicsObjects[n].simulate( this.settings.speed * this.deltaTime );
    }
    
    this.infoObject.updateInfo( this.settings.speed, this.physicsObjects.length, this.calculations, this.progress.collisions );
    
    // Render step
    this.settings.context.fillStyle = '#000000';
    this.settings.context.fillRect( 0, 0, this.settings.WIDTH, this.settings.HEIGHT );
    this.settings.context.save();
    this.settings.context.translate( this.settings.WIDTH * .5, this.settings.HEIGHT * .5);
    
    for ( var n in this.drawables )
    {
      this.drawables[n].draw( this.settings.canvas, this.settings.context );
      if ( this.vectorLine ) this.vectorLine.draw( this.settings.canvas, this.settings.context );
    }
    this.settings.context.restore();
    
    this.checkFPS();
    this.checkEnergy();
    this.calculations = 0;
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
  },

  checkEnergy: function() {
    var newTime = Date.now();
    var delta = Date.now() - this.energyUpdate;
    if ( delta >= 2000 ) {
      this.energyUpdate = newTime;
      var newEnergy = 0;
      this.physicsObjects.map( function(obj) {
        newEnergy += Math.abs(obj.velocity.magnitude());
      } );
      this.GUI.res.update('energy', newEnergy *.01);
    }
  }
  
};