/*
 * Receive the data from the server and draw what the other client sent
 */

var secondLayer;
var secondPath;
socket.on('pathReady', function(data) {
  //secondLayer = new Layer();

  path = new Path();
  path.strokeColor = 'red';
  path.strokeWidth = 10;
  console.log(data.points);
  for (index in data.points)
    path.add(data.points[index]);
  var canvasElement = document.getElementById('canvas');
  view.draw();
});

