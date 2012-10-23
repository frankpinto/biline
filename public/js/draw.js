socket = io.connect('http://' + window.location.hostname);

// Script-wide stroke specific variables
var thickness = new Point({length: 5, angle: null});
var path;
var strokeEnds = 2;

// Data to send across the sockets
var redrawData = {};
redrawData.serializedPoints = [];


/*
 * Helper Functions
 */

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

/*
 * Event listeners - take care of drawing
 */
function onMouseDown(event) {
    //prevent(event);
    path = new Path();
    path.fillColor = "black";
    redrawData.startPoint = event.point;
}

var lastPoint;
function onMouseDrag(event) {
    var step = event.delta / 2;
    thickness.angle = step.angle + 90;

    var top = event.middlePoint + thickness;
    var bottom = event.middlePoint - thickness;

    path.add(top);
    path.insert(0, bottom);
    redrawData.serializedPoints.push([top.x, top.y]);
    redrawData.serializedPoints.splice(0, 0, [bottom.x, bottom.y]);
    
    lastPoint = event.middlePoint;
}

function onMouseUp(event) {
    var delta = event.point - lastPoint;
    redrawData.serializedPoints.push([event.point.x, event.point.y]);
    delta.length = tool.maxDistance;
    //addStrokes(event.point, delta);
    path.closed = true;
    socket.emit('segmentsReady', {points: redrawData.serializedPoints});
}

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
