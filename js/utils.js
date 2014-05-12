SYS.Utils = {
 
  extend: function(a, b) {
    
    //Check each property
    for(var key in b) {
      if(b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    
    //Return the extended object
    return a;
  },
  
  randVec: function( r ) {
    if(!r) r = 1;
    return new SYS.Vector2( 
      ( Math.random() * r ) - ( r * .5 ), 
      ( Math.random() * r ) - ( r * .5 ) 
    );
  }
  
};