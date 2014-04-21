// Controls

SYS.Controls = function( gameObject )
{
  this.game = gameObject;
  this.mouse = new SYS.Vector2( 0, 0 );
  this.mouseDelta = new SYS.Vector2( 0, 0 );
  this.mouseDown = false;
  window.addEventListener( 'mousedown', this.onMouseDown.bind( this ), false );
  window.addEventListener( 'touchstart', this.onMouseDown.bind( this ), false );
  window.addEventListener( 'mouseup', this.onMouseUp.bind( this ), false );
  window.addEventListener( 'touchend', this.onMouseUp.bind( this ), false );
  window.addEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
  window.addEventListener( 'touchmove', this.onMouseMove.bind( this ), false );
  window.addEventListener( 'keydown' , this.onKeyDown.bind( this ), false );
};

SYS.Controls.prototype = {
  
  onMouseDown: function( e )
  {
    e.preventDefault();
    var event = e.touches ? e.touches[0] : e;

    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    
    this.mouseDown = true;
    this.game.vectorLine = new SYS.VectorLine( this.game, this.mouse );
  },
  
  onMouseUp: function( e )
  {
    e.preventDefault();
    var event = e.touches ? e.touches[0] : e;

    this.mouseDelta.x = event.clientX;
	this.mouseDelta.y = event.clientY;
    
    this.mouseDown = false;
    
    var position = new SYS.Vector2( this.mouse.x, this.mouse.y );
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
       //console.log("x: ",event.clientX," y: ",event.clientY);
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
                this.game.settings.speed += 0.005;
              console.log(this.game.settings.speed);
              break;
          case 39:
              // Key right.
              break;
          case 40:
              // Key down.
              if( this.game.settings.speed > 0.005 )
                this.game.settings.speed -= 0.005;
              console.log(this.game.settings.speed);
              break;
     }
     //event.preventDefault();
  }
  
};