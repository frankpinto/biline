/*
 * Receive the data from the server and draw what the other client sent
 */

// Get current PaperScope context
var newScope = (function(paper) {
  paper.install(this);

  var originalLayer;
  var secondLayer;
  var pathsDrawn = 0;
  socket.on('pathReady', function(packet) {
    if (!secondLayer)
    {
      originalLayer = project.activeLayer;
      secondLayer = new Layer();
    }
    else
      secondLayer.activate();

    paths = packet.data;
    while (pathsDrawn < paths.length)
    {
      var newPath = new Path();
      newPath.strokeColor = 'red';
      newPath.fillColor = 'red';
      newPath.strokeWidth = 1;
      newPath.closed = true;
      for (index in paths[pathsDrawn].points)
        newPath.add(paths[pathsDrawn].points[index]);
      pathsDrawn++;
    }
    
    // Make sure it draws immediately
    var canvasElement = document.getElementById('canvas');
    view.draw();
    
    // Switch back to what user is doing
    originalLayer.activate();
  });
  return this;
})(paper);
