SYS.Progression = function( gameObject ) {
  this.game = gameObject;
  this.startingBodies = 0;
  this.totalBodies = 0;
  this.currentBodies = 0;
  this.collisions = 0;
  this.currentNotification;

  this.events = {
    startGame: {
      completed: false,
      log: 'startGame achieved',
      message: 'Hey there! <br>The big yellow blob you see is a star. Throw asteriods into its orbit by clicking, dragging and then releasing the left mouse button!',
      timeStamp: null
    },
    firstAsteroid: {
      completed: false,
      log: 'firstAsteroid achieved',
      message: 'Great! Your first asteroid. <br>Wonder what`ll happen when there`s more...',
      timeStamp: null
    },
    firstSunCollision: {
      completed: false,
      log: 'firstSunCollision achieved',
      message: 'What happens if an asteroid hits a giant ball of fusion energy? <br>Well, not a lot for the star, but it`s game over for the asteroid!',
      timeStamp: null,
      bodies: null
    },
    firstCollision: {
      completed: false,
      log: 'firstCollision achieved',
      message: 'Hey! Two of those asteroids merged into eachother and made a bigger one. What happens if you make an even bigger one?',
      timeStamp: null,
      bodies: null
    },
    firstDwarfPlanet: {
      completed: false,
      log: 'firstDwarfPlanet achieved',
      message: 'Well look-ee here, you got yourself a dwarf planet!',
      timeStamp: null,
      bodies: null,
      collisions: null
    }
  };
};

SYS.Progression.prototype = {

  update: function() {
    // Here we check if the player has completed certain events
    if( this.events.startGame.completed == false ){
      if( this.currentNotification ) this.currentNotification.destroy();
      this.currentNotification = new SYS.GUI.Notification( this.game, 300, 10, 500, 150, this.events.startGame.message );
      this.events.startGame.completed = true;
      if( this.game.settings.debug == true ) console.log( this.events.startGame.log );
    }
    if( this.events.firstAsteroid.completed == false && this.totalBodies - this.startingBodies >= 1 ) {
      if( this.currentNotification.notification ) this.currentNotification.destroy();
      this.currentNotification = new SYS.GUI.Notification( this.game, 300, 10, 500, 150, this.events.firstAsteroid.message );
      this.events.firstAsteroid.completed = true;
      if( this.game.settings.debug == true ) console.log( this.events.firstAsteroid.log );
    }
  }
};

