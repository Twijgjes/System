SYS.GUI = function( gameObject ) {
  this.game = gameObject;
  this.elements = [];
};

SYS.GUI.prototype =
{
    addEl: function(arg)
    {
        this.elements.push(arg);
    },
    
    createStyle: function( leftPos, bottomPos, width, height, name )
    {
        var style = document.createElement( 'style' );
        style.type = 'text/css';
        style.innerHTML = '.'+name+' { bottom: '+bottomPos+'px; left: '+leftPos+'px; width: '+width+'px; height: '+height+'px; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        return style;
    },
};

SYS.GUI.Info = function()
{
    this.infoDiv = document.createElement('div');
    this.infoDiv.className = 'infoDiv';
    document.body.appendChild(this.infoDiv);
    this.infoDiv.innerHTML = 'Test';
};

SYS.GUI.Info.prototype = {
    
    updateInfo: function( speed, objects, calc, collisions )
    {
        this.infoDiv.innerHTML = 'simulation speed: ' + speed.toFixed(4) + '<br>' + 'objects: ' + objects + '<br> calculations: ' + calc + '<br> collisions: ' + collisions;
    },
    
};

SYS.GUI.Notification = function( gameObject, xPos, yPos, width, height, text)
{
    this.game = gameObject;
    this.notification = document.createElement( 'div' );
    this.notification.className =  'dialog';
    this.notification.className += ' notification';
    this.notification.innerHTML = text;
    this.style = this.game.GUI.createStyle( xPos, yPos, width, height, 'notification' );
    
    document.body.appendChild(this.notification);
    
    this.close = document.createElement( 'div' );
    this.close.className = 'button';
    this.close.innerHTML = 'close';
    this.notification.appendChild( this.close );
    
    this.close.addEventListener( 'click' , this.clickClose.bind( this ), false );
    this.close.addEventListener( 'touchend' , this.clickClose.bind( this ), false );
    
    this.game.GUI.addEl(this);
};

SYS.GUI.Notification.prototype = {
  clickClose: function(e) {
    e.preventDefault();
    this.destroy();
  },
  
  destroy: function() {
    if(this.notification) {
      document.body.removeChild(this.notification);
      this.notification = null;
    }
  }
    
};

SYS.VectorLine = function( gameObject, origin ) {
  this.game = gameObject;
  this.origin = new SYS.Vector2( origin.x, origin.y );
  this.destination = new SYS.Vector2( origin.x + 1, origin.y );
  this.color = ' #858585' ;
  this.lineWidth = 5;
};

SYS.VectorLine.prototype = {
  
  draw: function( canvas, context ) {
    context.beginPath(  );
    context.moveTo( this.origin.x, this.origin.y );
    context.lineTo( this.destination.x, this.destination.y );
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    context.lineCap = 'round';
    context.stroke(  );
    context.lineWidth = 0;
  },
  
  setDestination: function( newPosX, newPosY ) {
    this.destination.set( new SYS.Vector2( newPosX, newPosY ) );
  }
  
};