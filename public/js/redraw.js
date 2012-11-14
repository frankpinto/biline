/*
 * Receive the data from the server and draw what the other client sent
 */

var socketedPaper = {};
document.addEventListener('paperReady', function() {
  paper.install(socketedPaper);
  socketedPaper.socket = socket;
  //socketedPaper.projects[0].activate();

  // Install PaperScope context
  var setupRedraw = function() {

    var originalLayer;
    var secondLayer;
    var pathsDrawn = 0;
    var redraw = function(packet) {
      if (!secondLayer)
      {
        originalLayer = socketedPaper.projects[0].activeLayer;
        secondLayer = new socketedPaper.Layer();
      }
      else
        secondLayer.activate();

      paths = packet.data;
      while (pathsDrawn < paths.length)
      {
        var newPath = new socketedPaper.Path();
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
      socketedPaper.views[0].draw();
      
      // Switch back to what user is doing
      originalLayer.activate();
    };

    socket.on('pathReady', redraw);
  };

  setupRedraw();
});
