var socket = io.connect('http://' + window.location.hostname);
var canvas = document.getElementById('canvas');
paper.install(window);
paper.setup(canvas);

var tool = new Tool();
//tool.fixedDistance = 10;

var path;

socket.on('pathReady', function(data) {
  console.log(data.segments);

  path = new Path(data.segments);
  path.fillColor = '#000';
  path.closed = true;
  console.log(path);
});
