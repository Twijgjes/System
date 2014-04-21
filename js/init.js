window.onload = function() {
  initializeGame();
};

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
  
  var game = new SYS.Game(settings);
};
