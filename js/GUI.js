SYS.GUI = function( gameObject ) {
  this.game = gameObject;
  this.elements = [];
  this.spawnerButtons = new SYS.GUI.SpawnerButtons( this.game, new SYS.Vector2(), 20, 20 );
  this.res = new SYS.GUI.Resources( this.game, 1000, 10000 );
};

SYS.GUI.prototype = {
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

SYS.GUI.Info = function() {
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

SYS.GUI.Notification = function( gameObject, xPos, yPos, width, height, text) {
  this.game = gameObject;
  this.notification = document.createElement( 'div' );
  this.notification.className =  'dialog notification';
  this.notification.innerHTML = text;
  this.style = this.game.GUI.createStyle( xPos, yPos, width, height, 'notification' );
  
  document.body.appendChild(this.notification);
  
  this.close = document.createElement( 'div' );
  this.close.className = 'close';
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

SYS.GUI.SpawnerButtons = function( gameObject, pos, width, height ) {
  this.game = gameObject;
  this.buttonCnt = document.getElementsByClassName('buttons')[0];
  console.log(this.buttonCnt);
  var buttons = this.buttonCnt.children;
  for ( var i = 0; i < this.buttonCnt.children.length; i++ ){
    this.buttonCnt.children[i].addEventListener( 'click', this.click.bind( this ) , false);
  };
};

SYS.GUI.SpawnerButtons.prototype = {
  addButton: function( button, callback ) {
    var name = button
  },
  
  click: function(e) {
    console.log(e.target.innerHTML);
    var mode = e.target.innerHTML;
    if( mode == 'asteroid') {
      this.game.spawner.mode = this.game.spawner.asteroid;
    } else if( mode = 'shotgun') {
      this.game.spawner.mode = this.game.spawner.asteroids;
    }
  }
};

SYS.VectorLine = function( gameObject, origin ) {
  this.game = gameObject;
  this.origin = new SYS.Vector2( origin.x, origin.y );
  this.destination = new SYS.Vector2( origin.x + 1, origin.y );
  this.color = 'rgba(127,127,127,.1)' ;
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

SYS.GUI.Resources = function( gameObject, initialMass, initialEnergy ) {
  this.game = gameObject;
  this.resources = {
    mass    : initialMass,
    energy  : initialEnergy,
    massEl  : document.getElementById('mass'),
    energyEl: document.getElementById('energy')
  };
  this.resources.massEl.innerHTML = 'mass: ' + this.resources.mass;
  this.resources.energyEl.innerHTML = 'energy: ' + this.resources.energy;

};

SYS.GUI.Resources.prototype = {
  update: function( type, amount ) {
    // TODO: prevent non-existent resources from being used.
    console.log('adding',Math.round(amount),'to',type);
    this.resources[type] += amount;
    this.resources[type] = Math.round(this.resources[type]);
    var element = type+'El';
    this.resources[element].innerHTML = type + ': ' + this.resources[type];
  },

  set: function( type, amount ) {
    this.resources[type] = amount;
    var element = type+'El';
    this.resources[element].innerHTML = type + ': ' + this.resources[type];
  },
};