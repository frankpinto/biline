//tool.fixedDistance = 10;
var socket = io.connect('http://' + window.location.hostname);

var thickMag = 5;
var thickness = new Point({length: thickMag, angle: null});
var path;
var strokeEnds = 2;
var redrawData = [];
var serializedPath = {}; // Changes on every drawing
//redrawData.serializedPoints = [];

function prevent(e) {
  e.preventDefault();
}

function onMouseDown(event) {
    prevent(event);
    path = new Path();
    path.fillColor = "black";
    //path.add(event.point);
    serializedPath = {points: [], startPoint: null, endPoint: null};
}

var lastPoint;
function onMouseDrag(event) {
    // If this is the first drag event,
    // add the strokes at the start:
    //if(event.count == 1) {
    //    addStrokes(event.middlePoint, event.delta * -1);
    //} else {
        var step = event.delta / 2;
        thickness.angle = step.angle + 90;

        var top = event.point + thickness;
        var bottom = event.point - thickness;

        path.add(top);
        path.insert(0, bottom);
        serializedPath.points.push([top.x, top.y]);
        serializedPath.points.splice(0, 0, [bottom.x, bottom.y]);
    //}
    
    lastPoint = event.point;
}

function onMouseUp(event) {
    var delta = event.point - lastPoint;
    delta.length = tool.maxDistance;
    //addStrokes(event.point, delta);
    path.closed = true;
    //path.add(event.point);
    //serializedPath.points.push([event.point.x, event.point.y]);
    serializedPath.endPoint = event.point;
    redrawData.push(serializedPath);
    socket.emit('segmentsReady', {data: redrawData});
}

function addStrokes(point, delta) {
    var step = delta.rotate(90);
    var strokePoints = strokeEnds;
    point -= step / 2;
    step /= strokePoints - 1;
    for(var i = 0; i < strokePoints; i++) {
        var strokePoint = point + step * i;
        var offset = delta * (Math.random() * 0.3 + 0.1);
        if(i % 2) {
            offset *= -1;
        }
        strokePoint += offset;
        path.insert(0, strokePoint);
    }
}

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

// For tablet, prevent browser window moving
DomReady.ready(function() {
  var aElements = document.getElementsByTagName('a');
  for (i = 0; i < aElements.length; i++)
    aElements[i].addEventListener('touchmove', prevent);

  var buttonElements = document.getElementsByTagName('button');
  for (i = 0; i < buttonElements.length; i++)
    buttonElements[i].addEventListener('touchmove', prevent);
});
