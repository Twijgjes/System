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
};

SYS.GUI.Info = function()
{
    this.infoDiv = document.createElement('div');
    this.infoDiv.className = 'infoDiv';
    document.body.appendChild(this.infoDiv);
    this.infoDiv.innerHTML = 'Test';
    SYS.GUI.elements.push(this);
};

SYS.GUI.Info.prototype = 
{
    
    updateInfo: function( speed, objects )
    {
        this.infoDiv.innerHTML = 'simulation speed: ' + speed + '<br>' + 'objects: ' + objects;
    },
    
};

SYS.GUI.Notification = function( gameObject, xPos, yPos, width, height, text)
{
    this.game = gameObject;
    this.notification = document.createElement( 'div' );
    this.notification.className =  'dialog';
    this.notification.className += ' notification';
    this.notification.innerHTML = text;
    this.style = this.createStyle( xPos, yPos, width, height, 'notification' );
    this.blargh = this.test('AAARGHH');
    console.log(this.blargh);
    
    document.body.appendChild(this.notification);
    
    this.close = document.createElement( 'div' );
    this.close.className = 'button';
    this.close.innerHTML = 'close';
    this.notification.appendChild( this.close );
    
    this.close.addEventListener( 'click' , this.clickClose.bind( this ), false );
    
    this.game.GUI.addEl(this);
};

SYS.GUI.Notification.prototype = 
{
    clickClose: function(e)
    {
        e.preventDefault();
        document.body.removeChild(this.notification);
    },
    
    createStyle: function( leftPos, bottomPos, width, height, name )
    {
        var style = document.createElement( 'style' );
        style.type = 'text/css';
        style.innerHTML = '.'+name+' { bottom: '+bottomPos+'px; left: '+leftPos+'px; width: '+width+'px; height: '+height+'px; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        return style;
    },
    
    test: function(eek)
    {
        console.log(eek);
        return eek;
    }
};