SYS.PhysicsBody = function(gameObject, mass, density, position, velocity)
{
  this.game = gameObject;
  this.mass = mass;
  this.density = mass / 25;
  this.radius = Math.pow( ( 3*mass )/(4 * Math.PI ), 1/3 ); //( mass / density ) / ( Math.PI * 4 );
  this.position = new SYS.Vector2(position.x, position.y);
  this.velocity = new SYS.Vector2(velocity.x, velocity.y);
  this.color = '#603311';
  this.id = this.game.idCounter++;
  this.type = 1; // 1 for asteroid
  
  if ( this.mass != 0 ) this.game.physicsObjects.push( this );
  if ( this.radius != 0 ) this.game.drawables.push( this );
  this.game.progress.totalBodies++;
};

SYS.PhysicsBody.prototype = {
  
  draw: function( canvas, context )
  {
    context.save();
    var x = ( Math.round( this.position.x ) - this.game.camera.pos.x ) * this.game.camera.scale,
          y = ( Math.round( this.position.y ) - this.game.camera.pos.y ) * this.game.camera.scale;
    context.translate( x, y );
    context.beginPath();
    context.arc( 0, 0, this.radius * this.game.camera.scale, 0, 2 * Math.PI, false );
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  },
  
  simulate: function( speed )
  {
    if ( this.mass < 400 )
        this.color = '#616161';
    if ( this.mass > 400 )
        this.color = '#603311';
    if ( this.mass > 4000 )
        this.color = '#AD2D13';
    // Check if the object is not out of bounds.
    if ( this.position.magnitude() > this.game.settings.bounds )
    {
      this.destroy();
      return;
    }
    
    for ( var n in this.game.physicsObjects )
    {
      this.game.calculations++;
      // See if this object is within range of another object's "gravity" and prevent interacting with itself
      if ( this.game.physicsObjects[n].position.distanceTo( this.position ) < this.game.physicsObjects[n].mass && this.id != this.game.physicsObjects[n].id )
      {
        // Check if two objects collide with eachother
        this.interact( this.game.physicsObjects[n], speed );
      }
    }
    
    // Add the calculated velocity ( from interaction with the other objects ) to the position
    var speedAdjust = new SYS.Vector2( this.velocity.x * speed, this.velocity.y * speed );
    this.position.add( speedAdjust );
  },
  
  interact: function( checkAgainst, speed )
  {
    if ( this.position.distanceTo( checkAgainst.position ) < this.radius + checkAgainst.radius )
    {
      this.collide( checkAgainst );
    }
    // If there's no intersection the other object attracts this object with its gravity ( changes its velocity )
    else
    {
      this.accelerate( checkAgainst, speed );
//      if(checkAgainst.type != 2) checkAgainst.accelerate( this, speed );
    }
  },
  
  collide: function( checkAgainst ) 
  {
    if( checkAgainst.type == 2 ) {
      this.game.progress.fizzles++;
      this.game.GUI.res.update( 'mass', this.mass * -1 );
      this.game.GUI.res.update( 'energy', Math.abs( this.velocity.magnitude() ) * -1 );
      this.destroy();
      return;
    }
    
    // Check the magnitude of relative velocity
    var va = new SYS.Vector2( this.velocity.x, this.velocity.y ),
        vb = new SYS.Vector2( checkAgainst.velocity.x, checkAgainst.velocity.y );
    vb.sub( va );
    
    /*if ( vb.magnitude() > 300 && checkAgainst.type != 2 )
    {
      console.log(vb.magnitude() );
      this.fragment( checkAgainst );
    }
    else*/ if ( checkAgainst.type != 2 )
    {
      this.game.progress.collisions++;
      var mass = this.mass < checkAgainst.mass? this.mass : checkAgainst.mass;
      this.game.GUI.res.update( 'mass', mass );
      this.fuse( checkAgainst );
    }
  },
  
  accelerate: function( checkAgainst, speed ) 
  {
    var acceleration = SYS.Math.getNormalBetweenVectors( this.position, checkAgainst.position );
    acceleration.multiplyScalar( checkAgainst.mass / checkAgainst.position.distanceTo( this.position ) );
    acceleration.multiplyScalar( speed );
    this.velocity.add( acceleration );
  },
  
  fragment: function( checkAgainst ) {
    if(this.game.settings.debug) console.log( "fragmenting!");
    // The bigger object will now fragment
    if ( this.mass > checkAgainst.mass )
    {
      // Draw a red circle around the victim
      /* SYS.context.beginPath();
      SYS.context.arc( Math.round( this.position.x ), Math.round( this.position.y ), this.radius * 4, 0, 2 * Math.PI, false );
      SYS.context.fillStyle = '#FF0000';
      SYS.context.fill(); */
      
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
      var fragment = new SYS.PhysicsBody( 
                              this.game,
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
      // Draw a red circle around the victim
      /* SYS.context.beginPath();
      SYS.context.arc( Math.round( checkAgainst.position.x ), Math.round( checkAgainst.position.y ), checkAgainst.radius * 4, 0, 2 * Math.PI, false );
      SYS.context.fillStyle = '#FF0000';
      SYS.context.fill(); */
      
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
      var fragment = new SYS.PhysicsBody ( 
                       this.game,
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
  },
  
  fuse: function( checkAgainst ) {
    if(this.game.settings.debug) console.log('fusing!');
    // Check which object is bigger. The bigger one absorbs the smaller one.
    if ( this.mass > checkAgainst.mass ) 
    {
      // this object absorbs the other
      this.mass += checkAgainst.mass;
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
      checkAgainst.radius = Math.pow( ( 3*checkAgainst.mass )/(4 * Math.PI ), 1/3 );
      
      var velocityModifier = this.mass / checkAgainst.mass;
      this.velocity.sub( checkAgainst.velocity );
      this.velocity.multiplyScalar( velocityModifier );
      checkAgainst.velocity.add( this.velocity );
      
      this.destroy();
    }
  },
  
  keepInBounds: function() {
    if ( this.position.x > this.game.settings.WIDTH ) 
    {
      this.position.x = this.game.settings.WIDTH; 
      this.velocity.negate();
    }
    else if ( this.position.x < 0 )
    {
      this.position.x = 0; 
      this.velocity.negate();
    }
    
    if ( this.position.y > this.game.settings.HEIGHT ) 
    {
      this.position.y = this.game.settings.HEIGHT; 
      this.velocity.negate();
    }
    else if ( this.position.y < 0 )
    {
      this.position.y = 0; 
      this.velocity.negate();
    }
  },
  
  destroy: function() {
    var indexD = this.game.drawables.indexOf( this );
    this.game.drawables.splice( indexD, 1 );
    var indexP = this.game.physicsObjects.indexOf( this );
    this.game.physicsObjects.splice( indexP, 1 );
  },
  
};

// For suns and black holes.
SYS.StationaryPhysicsBody = function( gameObject, mass, density, position, velocity )
{
  this.game = gameObject;
  this.mass = mass;
  this.density = density;
  this.radius =  Math.pow( ( 3*mass )/(4 * Math.PI ), 1/3 );
  this.position = position;
  this.velocity = velocity;
  this.color = '#FFD452';
  this.id = this.game.idCounter++;
  this.type = 2; // 2 for sun
  this.circleRadians = 2 * Math.PI;
  
  if ( this.mass != 0 ) this.game.physicsObjects.push( this );
  if ( this.radius != 0 ) this.game.drawables.push( this );
};

SYS.StationaryPhysicsBody.prototype = {
  
  draw: function( canvas, context )
  {
    context.save();
    
    var scale = this.game.camera.scale,
          x = ( Math.round( this.position.x ) - this.game.camera.pos.x ) * scale,
          y = ( Math.round( this.position.y ) - this.game.camera.pos.y ) * scale;
    context.translate( x, y );
    
    var glowRadius = this.radius * 20;
    
    context.beginPath();
    context.arc( 0, 0, glowRadius * scale, 0, this.circleRadians, false );
    
    // create radial gradient
    var grd = context.createRadialGradient(0, 0, 1, 0, 0, glowRadius * scale);
    // light blue
    grd.addColorStop(0, this.color );
    grd.addColorStop(0.05, 'rgba(255,212,82,.8)' );
    grd.addColorStop(0.08, 'rgba(255,212,82,.3)' );
    // dark blue
    grd.addColorStop(1, 'rgba(255,212,82,0)');

    context.fillStyle = grd;
    context.fill();
    
    context.beginPath();
    context.arc( 0, 0, this.radius * scale, 0, this.circleRadians, false );
    context.fillStyle = this.color;
    context.fill();
    
    context.restore();
  },
  
  simulate: function( speed )
  {
    for ( var n in this.game.physicsObjects ) {
      // WHOA, prevent simulating against self!
      if ( this.game.physicsObjects[n].position.distanceTo( this.position ) < this.game.physicsObjects[n].mass && this.id != this.game.physicsObjects[n].id ) {
        if ( this.position.distanceTo( this.game.physicsObjects[n].position ) < this.radius + this.game.physicsObjects[n].radius ) {
          this.game.GUI.res.update( 'mass', this.game.physicsObjects[n].mass * -1 );
          this.game.GUI.res.update( 'energy', Math.abs( this.game.physicsObjects[n].velocity.magnitude() ) * -1 );
          this.game.physicsObjects[n].destroy();
          this.game.progress.fizzles++;
          return;
        }
//        this.game.physicsObjects[n].accelerate( this, speed );
      }
    }
  },
  
  destroy: function()
  {
    var indexD = this.game.drawables.indexOf( this );
    this.game.drawables.splice( indexD, 1 );
    var indexP = this.game.physicsObjects.indexOf( this );
    this.game.physicsObjects.splice( indexP, 1 );
  },
  
};