/* SYS.Math = function( )
{
  
}; */

SYS.Math = {
  
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
    // Whups, nuffin yet
    console.log( 'HEY! You still have to write this function.' );
  },
  
  normalize: function( )
  {
    var mag = 1 / this.magnitude();
    if ( mag != 0 )
    {
      this.x = this.x * mag;
      this.y = this.y * mag;
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
  },
  
  angleTo: function( v )
  {
    var normal = SYS.getNormalBetweenVectors( v, this );
    return Math.atan2( normal.y, normal.x );
  },
  
  placeAround: function( rotation, vector, radius )
  {
    this.x = vector.x + Math.cos(rotation) * radius;
	this.y = vector.y + Math.sin(rotation) * radius;
  },
  
  set: function ( vector )
  {
    this.x = vector.x;
    this.y = vector.y;
  }
  
};