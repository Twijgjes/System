window.onload = function() {
  initializeGame();
};

var game;

function initializeGame() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var WIDTH = canvas.width = window.innerWidth;
  var HEIGHT = canvas.height = window.innerHeight;
  
  var settings = {
    canvas: canvas,
    context: context,
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,
    debug: true
  };
  
  game = new SYS.Game(settings);
};
