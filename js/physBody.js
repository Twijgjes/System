SYS.PhysicsBody = function(mass, density, position, velocity)
{
  this.mass = mass;
  this.density = mass / 25;
  this.radius = Math.pow( ( 3*mass )/(4 * Math.PI ), 1/3 ); //( mass / density ) / ( Math.PI * 4 );
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
    if ( this.mass < 400 )
        this.color = '#616161';
    if ( this.mass > 400 )
        this.color = '#603311';
    if ( this.mass > 4000 )
        this.color = '#AD2D13';
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
        this.checkCollision( SYS.physicsObjects[n] );
      }
    }
    
    // Keep the object within the bounds
    /*
    this.keepInBounds();
    */
    
    // Add the calculated velocity ( from interaction with the other objects ) to the position
    this.position.add( this.velocity );
  },
  
  checkCollision: function( checkAgainst )
  {
    if ( this.position.distanceTo( checkAgainst.position ) < this.radius + checkAgainst.radius )
    {
      // Check the magnitude of relative velocity
      var va = new SYS.Vector2( this.velocity.x, this.velocity.y ),
          vb = new SYS.Vector2( checkAgainst.velocity.x, checkAgainst.velocity.y );
      va.negate();
      vb.add( va );
      
      if ( vb.magnitude() > 10 && checkAgainst.type != 2 )
      {
        console.log( "fragmenting!" );
        // The bigger object will now fragment
        
        SYS.context.beginPath();
        SYS.context.arc( Math.round( this.position.x ), Math.round( this.position.y ), this.radius * 4, 0, 2 * Math.PI, false );
        SYS.context.fillStyle = '#FF0000';
        SYS.context.fill();
        
        if ( this.mass > checkAgainst.mass )
        {
          // Take mass from the bigger object
          this.mass -= checkAgainst.mass;
          
          // Make variables for the new object
          var position = new SYS.Vector2( checkAgainst.position.x, checkAgainst.position.y ),
              velocity = new SYS.Vector2( checkAgainst.velocity.x, checkAgainst.velocity.y ),
              velocityOffset = new SYS.Vector2( this.velocity.x, this.velocity.y );
          
          // Alter the fragment's velocity a bit
          velocityOffset.normalize();
          velocity.add( velocityOffset );
          
          // Make the new object                
          var fragment = new SYS.PhysicsBody
                             ( 
                               checkAgainst.mass, 
                               this.density, 
                               position, 
                               velocity 
                             );
                         
          // Calculate the position offset
          /*var positionOffset = new SYS.Vector2( checkAgainst.velocity.x, checkAgainst.velocity.y );
          positionOffset.multiplyScalar( velocity.magnitude() / ( this.radius * 2.5 ) );*/
          
          // This will probably go wrong. Basing the rotation off a velocity isn't fool-proof. Methinks.
          // Place the resulting fragment outside the impacted body, 90 degrees from the impact point.
          var velocityNormal =  new SYS.Vector2( checkAgainst.velocity.x, checkAgainst.velocity.y );
          velocityNormal.normalize();
          var rotation = Math.atan2( velocityNormal.y, velocityNormal.x );
          rotation += Math.PI / 2;
          var radius = fragment.radius + ( this.radius * 2 );
          fragment.position.placeAround( rotation, this.position, radius );
          
          rotation += Math.PI / 12;
          radius += checkAgainst.radius;
          checkAgainst.position.placeAround( rotation, this.position, radius );
        }
        else
        {
          // Take mass from the bigger object
          checkAgainst.mass -= this.mass;
          
          // Make variables for the new object
          var position = new SYS.Vector2( this.position.x,this.position.y ),
              velocity = new SYS.Vector2( this.velocity.x, this.velocity.y ),
              velocityOffset = new SYS.Vector2( checkAgainst.velocity.x, checkAgainst.velocity.y );
          
          // Alter the fragment's velocity a bit
          velocityOffset.normalize();
          velocity.add( velocityOffset );
          
          // Make the new object            
          var fragment = new SYS.PhysicsBody
                         ( 
                           this.mass, 
                           checkAgainst.density, 
                           position, 
                           velocity 
                         );
          
          // Calculate the position offset
          /*var positionOffset = new SYS.Vector2( this.velocity.x, this.velocity.y );
          positionOffset.multiplyScalar( velocity.magnitude() / ( checkAgainst.radius * 2.5 ) );*/
          
          // Offset the position
          var velocityNormal =  new SYS.Vector2( this.velocity.x, this.velocity.y );
          velocityNormal.normalize();
          var rotation = Math.atan2( velocityNormal.y, velocityNormal.x );
          rotation += Math.PI / 2;
          var radius = fragment.radius + ( checkAgainst.radius * 2 );
          fragment.position.placeAround( rotation, checkAgainst.position, radius );
          
          rotation += Math.PI / 12;
          radius += this.radius;
          this.position.placeAround( rotation, checkAgainst.position, radius );
        }
      }
      else if ( checkAgainst.type != 2 )
      {
        // Check which object is bigger. The bigger one absorbs the smaller one.
        if ( this.mass > checkAgainst.mass ) 
        {
          // this object absorbs the other
          this.mass += checkAgainst.mass;
          //this.density += ( checkAgainst.mass * 0.01 );
          this.radius = Math.pow( ( 3*this.mass )/(4 * Math.PI ), 1/3 );
          
          var velocityModifier = checkAgainst.mass / this.mass;
          checkAgainst.velocity.sub( this.velocity );
          checkAgainst.velocity.multiplyScalar( velocityModifier );
          this.velocity.add( checkAgainst.velocity );
          
          checkAgainst.destroy();
        }
        // When the masses are equal it doesn't really matter which one absorbs the other
        else
        {
          // The other object absorbs this one
          checkAgainst.mass += this.mass;
          //checkAgainst.density += ( this.mass * 0.01 );
          //checkAgainst.radius = ( checkAgainst.mass / checkAgainst.density ) / ( Math.PI * 4 );
          Math.pow( ( 3*checkAgainst.mass )/(4 * Math.PI ), 1/3 );
          
          var velocityModifier = this.mass / checkAgainst.mass;
          this.velocity.sub( checkAgainst.velocity );
          this.velocity.multiplyScalar( velocityModifier );
          checkAgainst.velocity.add( this.velocity );
          
          this.destroy();
        }
      }
    }
    // If there's no intersection the other object attracts this object with its gravity ( changes its velocity )
    else
    {
      var acceleration;
      acceleration = SYS.Math.getNormalBetweenVectors( this.position, checkAgainst.position );
      if ( acceleration.x != 0 && acceleration.y != 0 ) acceleration.multiplyScalar( ( checkAgainst.mass / checkAgainst.position.distanceTo( this.position ) ) / SYS.speed );
      this.velocity.add( acceleration );
    }
  },
  
  keepInBounds: function()
  {
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
  this.radius =  Math.pow( ( 3*mass )/(4 * Math.PI ), 1/3 );
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