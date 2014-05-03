// Controls

SYS.Controls = function( gameObject )
{
  this.game = gameObject;
  this.preventNextEvent = false;
  this.mouseStart = new SYS.Vector2( 0, 0 );
  this.mouseDelta = new SYS.Vector2( 0, 0 );
  this.mouseDown = false;
  this.game.settings.canvas.addEventListener( 'mousedown', this.onMouseDown.bind( this ), false );
  this.game.settings.canvas.addEventListener( 'touchstart', this.onMouseDown.bind( this ), false );
  document.addEventListener( 'mouseup', this.onMouseUp.bind( this ), false );
  document.addEventListener( 'touchend', this.onMouseUp.bind( this ), false );
  document.addEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
  document.addEventListener( 'touchmove', this.onMouseMove.bind( this ), false );
  this.game.settings.canvas.addEventListener( 'keydown' , this.onKeyDown.bind( this ), false );
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

    this.mouseStart.x = event.clientX;
    this.mouseStart.y = event.clientY;
    
    this.mouseDown = true;
    this.game.vectorLine = new SYS.VectorLine( this.game, this.mouseStart );
  },
  
  onMouseUp: function( e )
  {
    e.preventDefault();
    console.log('mouse released');
    var event = e.changedTouches ? e.changedTouches[0] : e;

    this.mouseDelta.x = event.clientX;
	this.mouseDelta.y = event.clientY;
    
    this.mouseDown = false;
    
    var position = new SYS.Vector2( this.mouseStart.x, this.mouseStart.y );
    var velocity = new SYS.Vector2( this.mouseDelta.x, this.mouseDelta.y );
    velocity.sub( position );
//    velocity.multiplyScalar( 0.7 );
    velocity.negate();
    
    new SYS.PhysicsBody( this.game, 100, 4, position, velocity );
    this.game.vectorLine = null;
  },
  
  onMouseMove: function( e )
  {
    e.preventDefault();
    if (this.mouseDown)
    {
      var event = e.touches ? e.touches[0] : e;
      this.game.vectorLine.setDestination( event.clientX, event.clientY );
    }
  },
  
  onKeyDown: function ( event )
  {
    var code = event.keyCode;
    if (event.charCode && code == 0)
          code = event.charCode;
     switch(code) {
          case 37:
              // Key left.
              break;
          case 38:
              // Key up.
              if ( this.game.settings.speed < 1 ) 
                this.game.settings.speed += 0.0001;
              console.log(this.game.settings.speed);
              break;
          case 39:
              // Key right.
              break;
          case 40:
              // Key down.
              if( this.game.settings.speed > 0.0002 )
                this.game.settings.speed -= 0.0001;
              console.log(this.game.settings.speed);
              break;
     }
     //event.preventDefault();
  }
  
};