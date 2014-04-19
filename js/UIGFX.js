SYS.VectorLine = function( origin )
{
  this.origin = new SYS.Vector2( origin.x, origin.y );
  this.destination = new SYS.Vector2( origin.x + 1, origin.y );
  this.color = ' #858585' ;
  this.lineWidth = 5;
};

SYS.VectorLine.prototype = {
  
  constuctor: SYS.VectorLine,
  
  draw: function(  )
  {
    SYS.context.beginPath(  );
    SYS.context.moveTo( this.origin.x, this.origin.y );
    SYS.context.lineTo( this.destination.x, this.destination.y );
    SYS.context.lineWidth = this.lineWidth;
    SYS.context.strokeStyle = this.color;
    SYS.context.lineCap = 'round';
    SYS.context.stroke(  );
    SYS.context.lineWidth = 0;
  },
  
  setDestination: function( newPosX, newPosY )
  {
    this.destination.set( new SYS.Vector2( newPosX, newPosY ) );
  }
  
};

SYS.GUIInfo = function()
{
    this.infoDiv = document.createElement('div');
    this.infoDiv.className = 'infoDiv';
    document.body.appendChild(this.infoDiv);
    this.infoDiv.innerHTML = 'Test';
};

SYS.GUIInfo.prototype = {
    
    updateInfo: function( speed, objects )
    {
        this.infoDiv.innerHTML = 'simulation speed: ' + speed + '<br>' + 'objects: ' + objects;
    },
    
};