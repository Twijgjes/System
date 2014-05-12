// Controls

SYS.Controls = function( gameObject )
{
  this.game = gameObject;
  this.preventNextEvent = false;
  this.mouseStart = new SYS.Vector2( 0, 0 );
  this.mouseDelta = new SYS.Vector2( 0, 0 );
  this.mouseDown = false;
  this.keys = [];
  this.ofst = new SYS.Vector2(this.game.settings.WIDTH * .5, this.game.settings.HEIGHT * .5);
  this.game.settings.canvas.addEventListener( 'mousedown', this.onMouseDown.bind( this ), false );
  this.game.settings.canvas.addEventListener( 'touchstart', this.onMouseDown.bind( this ), false );
  document.addEventListener( 'mouseup', this.onMouseUp.bind( this ), false );
  document.addEventListener( 'touchend', this.onMouseUp.bind( this ), false );
  document.addEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
  document.addEventListener( 'touchmove', this.onMouseMove.bind( this ), false );
  document.addEventListener( 'keydown' , this.onKeyDown.bind( this ), false );
  document.addEventListener( 'keyup' , this.onKeyUp.bind( this ), false );
  document.addEventListener( 'mousewheel', this.onScroll.bind( this ), false );
};

SYS.Controls.prototype = {
  
  onMouseDown: function( e )
  {
    e.preventDefault();
    
    if( this.preventNextEvent == true) {
      this.preventNextEvent = false;
      return;
    }
    
    var event = e.touches ? e.touches[0] : e;

    this.mouseStart.x = event.clientX - this.ofst.x;
    this.mouseStart.y = event.clientY - this.ofst.y;
    
    this.mouseDown = true;
    this.game.vectorLine = new SYS.VectorLine( this.game, this.mouseStart );
  },
  
  onMouseUp: function( e )
  {
    if(this.mouseDown == true) {
      e.preventDefault();
      console.log('mouse released');
      var event = e.changedTouches ? e.changedTouches[0] : e;

      this.mouseDelta.x = event.clientX - this.ofst.x;
      this.mouseDelta.y = event.clientY - this.ofst.y;
      
      this.mouseDown = false;
      
      var position = new SYS.Vector2( this.mouseStart.x, this.mouseStart.y );
      var velocity = new SYS.Vector2( this.mouseDelta.x, this.mouseDelta.y );
      velocity.sub( this.mouseStart );
      
      this.game.spawner.asteroids(position, velocity, 50);
      this.game.vectorLine = null;
    }
  },
  
  onMouseMove: function( e )
  {
    e.preventDefault();
    if (this.mouseDown)
    {
      var event = e.touches ? e.touches[0] : e;
      this.game.vectorLine.setDestination( event.clientX - this.ofst.x, event.clientY - this.ofst.y );
    }
  },
  
  onScroll: function( event ) {
    if(event.wheelDelta > 0)
      this.game.camera.scale += 0.1;
    if(event.wheelDelta < 0 && this.game.camera.scale > 0.11)
      this.game.camera.scale -= 0.1;
  },
  
  test: function( event ) {
    console.log('event: ',event);
  },
  
  onKeyDown: function ( event ) {
    event.preventDefault();      
    this.keys[event.keyCode] = true;
  },
  
  onKeyUp: function ( event ) {
    event.preventDefault(); 
    this.keys[event.keyCode] = false;
  },
  
  processKeys: function() {
    var camMove = new SYS.Vector2(0,0);
    
    if(this.keys[37])
      camMove.x--;
    if(this.keys[38])
      camMove.y--;
    if(this.keys[39])
      camMove.x++;
    if(this.keys[40])
      camMove.y++;
      
    if(this.keys[17]) {
      if( this.game.settings.speed > 0.0002 )
        this.game.settings.speed -= 0.0001;
      console.log(this.game.settings.speed);
    }
    
    if(this.keys[16]) {
      if ( this.game.settings.speed < 1 ) 
        this.game.settings.speed += 0.0001;
      console.log(this.game.settings.speed);
    }
    
    this.game.camera.move(camMove);
  }
  
};