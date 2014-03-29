/*! System - Game - v0.1.1 - 2014-02-20
* http://149.210.136.93/~ramus/shared/System/
* Copyright (c) 2014 ; Licensed  */
SYS = function( )
{
  this.version = '0.1';
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  this.WIDTH = this.canvas.width;
  this.HEIGHT = this.canvas.height;
  this.idCounter = 0;
  this.id = this.idCounter++;
  this.spawnCounter = 0;
  this.bounds = 5000;
  
};

SYS.prototype = {
  
  constructor: SYS,
  
  initialise: function( )
  {
    this.drawables = [ ];
    this.physicsObjects = [ ];
    this.Math = new SYS.Math();
    this.delta; //// TODO
    
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
    
    //this.makeRandomObjects();
    new SYS.StationaryPhysicsBody( 800, 40, new SYS.Vector2( this.WIDTH / 2, this.HEIGHT / 2 ), new SYS.Vector2( 0, 0 ) );
    this.update( );
    
  },
  
  update: function( )
  {
    //console.log( 'updating' );
    this.context.fillStyle = 'black';
    this.context.fillRect( 0, 0, this.WIDTH, this.HEIGHT );    
    
    for ( var n in this.physicsObjects )
    {
      this.physicsObjects[n].simulate();
    }
    
    this.spawnObjectsOnTimer();
    
    
    for ( var n in this.drawables )
    {
      this.drawables[n].draw();
    }
    
    requestAnimFrame( function() {
      SYS.update();
    });
    
  },
  
  makeRandomObjects: function( )
  {
    
    for ( var i = 0; i < 80; i++ )
    {
      var randomPos = new SYS.Vector2( Math.round( Math.random() * this.WIDTH ), Math.round( Math.random() * this.HEIGHT ) ),
          randomVel = new SYS.Vector2( ( Math.random() * 8 ) - 4, ( Math.random() * 8 ) - 4 ),
          randomMass = 4 + ( Math.random() * 6 ),
          randomDensity = Math.round( 0.5 + ( Math.random() * 0.5 ) );
      
      //console.log( randomPos.x + ' ' + randomPos.y + ' ' + randomDensity );
          
      new SYS.PhysicsBody( randomMass, randomDensity, randomPos, randomVel );
    }
  },
  
  spawnObjectsOnTimer: function( )
  {
    if ( this.spawnCounter > 480 )
    {
      for ( var i = 0; i < 10; i++ )
      {
        var randomPos = new SYS.Vector2( Math.round( Math.random() * this.WIDTH ), Math.round( Math.random() * this.HEIGHT ) ),
            randomVel = new SYS.Vector2( ( Math.random() * 6 ) - 3, ( Math.random() * 6 ) - 3 ),
            randomMass = 75 + ( Math.random() * 75 ),
            randomDensity = Math.round( 3 + ( Math.random() * 1.5 ) );
        
        //console.log( randomPos.x + ' ' + randomPos.y + ' ' + randomDensity );
            
        new SYS.PhysicsBody( randomMass, randomDensity, randomPos, randomVel );
      }
      console.log( "spawning" );
      this.spawnCounter = 0;
    }
    else
    {
      this.spawnCounter++;
    }
  },
  
};
SYS.Math = function( )
{
  
};

SYS.Math.prototype = {
  
  constructor: SYS.Math,
  
  getNormalBetweenVectors: function ( from, to )
  {
    var fromV = new SYS.Vector2( from.x, from.y ),
        toV = new SYS.Vector2( to.x, to.y );
        
    toV.sub( fromV );
    toV.normalize( );
    
    //console.log( toV );
    
    return toV;
  },

};

SYS.Vector2 = function( x, y )
{
  this.x = x;
  this.y = y;
  
  /* if( x != null && y != null )
  {
    this.x = x; 
    this.y = y;
  } */
};

SYS.Vector2.prototype = {
  
  constructor: SYS.Vector2,
  
  add: function( v )
  {
    this.x += v.x;
    this.y += v.y;
  },
  
  sub: function( v )
  {
    this.x -= v.x;
    this.y -= v.y;
  },
  
  multiplyScalar: function( s )
  {
    this.x *= s;
    this.y *= s;
  },
  
  dot: function( v )
  {
    
  },
  
  normalize: function( )
  {
    var mag = this.magnitude();
    if ( mag != 0 )
    {
      this.x = this.x / mag;
      this.y = this.y / mag;
    }
  },
  
  magnitude: function( )
  {
    return Math.sqrt( ( this.x * this.x ) + ( this.y * this.y ) );
  },
  
  distanceTo: function( v )
  {
    var va = new SYS.Vector2( v.x, v.y ),
        vb = new SYS.Vector2( this.x, this.y );
    
    va.sub( vb );
    return va.magnitude();
  },
  
  negate: function( )
  {
    this.x *= -1;
    this.y *= -1;
  }
  
};
SYS.PhysicsBody = function(mass, density, position, velocity)
{
  this.mass = mass;
  this.density = density;
  this.radius = ( mass / density ) / ( Math.PI * 4 );
  this.position = position;
  this.velocity = velocity;
  this.color = '#603311';
  this.id = SYS.idCounter++;
  this.type = 1; // 1 for asteroid
  
  if ( this.mass != 0 ) SYS.physicsObjects.push( this );
  if ( this.radius != 0 ) SYS.drawables.push( this );
};

SYS.PhysicsBody.prototype = {
  
  constuctor: SYS.PhysicsBody,
  
  draw: function()
  {
    SYS.context.beginPath();
    SYS.context.arc( Math.round( this.position.x ), Math.round( this.position.y ), this.radius, 0, 2 * Math.PI, false );
    SYS.context.fillStyle = this.color;
    SYS.context.fill();
  },
  
  simulate: function()
  {
    // Check if the object is not out of bounds.
    if ( this.position.magnitude() > SYS.bounds )
    {
      this.destroy;
    }
    
    for ( var n in SYS.physicsObjects )
    {
      // See if this object is within range of another object's "gravity" and prevent interacting with itself
      if ( SYS.physicsObjects[n].position.distanceTo( this.position ) < SYS.physicsObjects[n].mass && this.id != SYS.physicsObjects[n].id )
      {
        // Check if two objects collide with eachother
        if ( this.position.distanceTo( SYS.physicsObjects[n].position ) < this.radius + SYS.physicsObjects[n].radius )
        {
          // Check the magnitude of relative velocity
          var va = new SYS.Vector2( this.velocity.x, this.velocity.y ),
              vb = new SYS.Vector2( SYS.physicsObjects[n].velocity.x, SYS.physicsObjects[n].velocity.y );
          va.negate();
          vb.add( va );
          
          if ( vb.magnitude() > 10 && SYS.physicsObjects[n].type != 2 )
          {
            console.log( "fragmenting!" );
            // The bigger object will now fragment
            
            SYS.context.beginPath();
            SYS.context.arc( Math.round( this.position.x ), Math.round( this.position.y ), this.radius * 4, 0, 2 * Math.PI, false );
            SYS.context.fillStyle = '#FF0000';
            SYS.context.fill();
            
            if ( this.mass > SYS.physicsObjects[n].mass )
            {
              // Take mass from the bigger object
              this.mass -= SYS.physicsObjects[n].mass;
              
              // Make variables for the new object
              var position = new SYS.Vector2( SYS.physicsObjects[n].position.x, SYS.physicsObjects[n].position.y ),
                  velocity = new SYS.Vector2( SYS.physicsObjects[n].velocity.x, SYS.physicsObjects[n].velocity.y ),
                  velocityOffset = new SYS.Vector2( this.velocity.x, this.velocity.y );
              
              // Alter the fragment's velocity a bit
              velocityOffset.normalize();
              velocity.add( velocityOffset );
              
              // Make the new object                
              var fragment = new SYS.PhysicsBody( 
                               SYS.physicsObjects[n].mass, 
                               this.density, 
                               position, 
                               velocity 
                             );
                             
              // Calculate the position offset
              var positionOffset = new SYS.Vector2( SYS.physicsObjects[n].velocity.x, SYS.physicsObjects[n].velocity.y );
              positionOffset.multiplyScalar( velocity.magnitude() / ( this.radius * 2.5 ) );
              
              // Offset the position
              fragment.position.add( positionOffset );
              SYS.physicsObjects[n].position.add( positionOffset );
            }
            else
            {
              // Take mass from the bigger object
              SYS.physicsObjects[n].mass -= this.mass;
              
              // Make variables for the new object
              var position = new SYS.Vector2( this.position.x,this.position.y ),
                  velocity = new SYS.Vector2( this.velocity.x, this.velocity.y ),
                  velocityOffset = new SYS.Vector2( SYS.physicsObjects[n].velocity.x, SYS.physicsObjects[n].velocity.y );
              
              // Alter the fragment's velocity a bit
              velocityOffset.normalize();
              velocity.add( velocityOffset );
              
              // Make the new object            
              var fragment = new SYS.PhysicsBody( 
                               this.mass, 
                               SYS.physicsObjects[n].density, 
                               position, 
                               velocity 
                             );
              
              // Calculate the position offset
              var positionOffset = new SYS.Vector2( this.velocity.x, this.velocity.y );
              positionOffset.multiplyScalar( velocity.magnitude() / ( SYS.physicsObjects[n].radius * 2.5 ) );
              
              // Offset the position
              fragment.position.add( positionOffset );
              this.position.add( positionOffset );
            }
          }
          else if ( SYS.physicsObjects[n].type != 2 )
          {
            // Check which object is bigger. The bigger one absorbs the smaller one.
            if ( this.mass > SYS.physicsObjects[n].mass ) 
            {
              this.mass += SYS.physicsObjects[n].mass;
              //this.density += ( SYS.physicsObjects[n].mass * 0.01 );
              this.radius = ( this.mass / this.density ) / ( Math.PI * 4 );
              var velocityModifier = SYS.physicsObjects[n].mass / this.mass;
              SYS.physicsObjects[n].velocity.multiplyScalar( velocityModifier );
              this.velocity.add( SYS.physicsObjects[n].velocity );
              SYS.physicsObjects[n].destroy();
            }
            // When the masses are equal it doesn't really matter which one absorbs the other
            else
            {
              SYS.physicsObjects[n].mass += this.mass;
              //SYS.physicsObjects[n].density += ( this.mass * 0.01 );
              SYS.physicsObjects[n].radius = ( SYS.physicsObjects[n].mass / SYS.physicsObjects[n].density ) / ( Math.PI * 4 );
              var velocityModifier = this.mass / SYS.physicsObjects[n].mass;
              this.velocity.multiplyScalar( velocityModifier );
              SYS.physicsObjects[n].velocity.add( this.velocity );
              this.destroy();
            }
          }
        }
        // If there's no intersection the other object attracts this object with its gravity ( changes its velocity )
        else
        {
          var acceleration;
          acceleration = SYS.Math.getNormalBetweenVectors( this.position, SYS.physicsObjects[n].position );
          if ( acceleration.x != 0 && acceleration.y != 0 ) acceleration.multiplyScalar( ( SYS.physicsObjects[n].mass / SYS.physicsObjects[n].position.distanceTo( this.position ) ) / 100 );
          this.velocity.add( acceleration );
        }
      }
    }
    
    // Keep the object within the bounds
    /*
    if ( this.position.x > SYS.WIDTH ) 
    {
      this.position.x = SYS.WIDTH; 
      this.velocity.negate();
    }
    else if ( this.position.x < 0 )
    {
      this.position.x = 0; 
      this.velocity.negate();
    }
    
    if ( this.position.y > SYS.HEIGHT ) 
    {
      this.position.y = SYS.HEIGHT; 
      this.velocity.negate();
    }
    else if ( this.position.y < 0 )
    {
      this.position.y = 0; 
      this.velocity.negate();
    }
    */
    
    // Add the calculated velocity ( from interaction with the other objects ) to the position
    this.position.add( this.velocity );
  },
  
  destroy: function()
  {
    var indexD = SYS.drawables.indexOf( this );
    SYS.drawables.splice( indexD, 1 );
    var indexP = SYS.physicsObjects.indexOf( this );
    SYS.physicsObjects.splice( indexP, 1 );
  },
  
};

// For suns and black holes.
SYS.StationaryPhysicsBody = function(mass, density, position, velocity)
{
  this.mass = mass;
  this.density = density;
  this.radius = ( mass / density ) / Math.PI;
  this.position = position;
  this.velocity = velocity;
  this.color = '#FFD452';
  this.id = SYS.idCounter++;
  this.type = 2; // 2 for sun
  
  if ( this.mass != 0 ) SYS.physicsObjects.push( this );
  if ( this.radius != 0 ) SYS.drawables.push( this );
};

SYS.StationaryPhysicsBody.prototype = {
  
  constuctor: SYS.StationaryPhysicsBody,
  
  draw: function()
  {
    SYS.context.beginPath();
    SYS.context.arc( Math.round( this.position.x ), Math.round( this.position.y ), this.radius, 0, 2 * Math.PI, false );
    SYS.context.fillStyle = this.color;
    SYS.context.fill();
  },
  
  simulate: function()
  {
    for ( var n in SYS.physicsObjects )
    {
      // WHOA, prevent simulating against self!
      if ( SYS.physicsObjects[n].position.distanceTo( this.position ) < SYS.physicsObjects[n].mass && this.id != SYS.physicsObjects[n].id )
      {
        if ( this.position.distanceTo( SYS.physicsObjects[n].position ) < this.radius + SYS.physicsObjects[n].radius )
        {
          if ( this.mass > SYS.physicsObjects[n].mass ) 
          {
            //this.mass += SYS.physicsObjects[n].mass;
            //this.density += ( SYS.physicsObjects[n].mass * 0.005 );
            //this.radius = ( this.mass / this.density ) / Math.PI;
            SYS.physicsObjects[n].velocity.multiplyScalar( SYS.physicsObjects[n].mass / 400 )
            this.velocity.add( SYS.physicsObjects[n].velocity );
            SYS.physicsObjects[n].destroy();
          }
          else
          {
            /*
            SYS.physicsObjects[n].mass += this.mass;
            SYS.physicsObjects[n].density += ( this.mass * 0.005 );
            SYS.physicsObjects[n].radius = ( SYS.physicsObjects[n].mass / SYS.physicsObjects[n].density ) / Math.PI;
            this.velocity.multiplyScalar( this.mass / 400 )
            SYS.physicsObjects[n].velocity.add( this.velocity );
            this.destroy();
            */
          }
        }
        else
        {
          /*
          var acceleration;
          acceleration = SYS.Math.getNormalBetweenVectors( this.position, SYS.physicsObjects[n].position );
          if ( acceleration.x != 0 && acceleration.y != 0 ) acceleration.multiplyScalar( ( SYS.physicsObjects[n].mass / SYS.physicsObjects[n].position.distanceTo( this.position) ) / 200 );
          this.velocity.add( acceleration );
          */
        }
      }
    }
    
    // Keep the object within the bounds
    /*
    if ( this.position.x > SYS.WIDTH ) 
    {
      this.position.x = SYS.WIDTH; 
      this.velocity.negate();
    }
    else if ( this.position.x < 0 )
    {
      this.position.x = 0; 
      this.velocity.negate();
    }
    
    if ( this.position.y > SYS.HEIGHT ) 
    {
      this.position.y = SYS.HEIGHT; 
      this.velocity.negate();
    }
    else if ( this.position.y < 0 )
    {
      this.position.y = 0; 
      this.velocity.negate();
    }
    */
    
    /*this.position.add( this.velocity );*/
  },
  
  destroy: function()
  {
    var indexD = SYS.drawables.indexOf( this );
    SYS.drawables.splice( indexD, 1 );
    var indexP = SYS.physicsObjects.indexOf( this );
    SYS.physicsObjects.splice( indexP, 1 );
  },
  
};