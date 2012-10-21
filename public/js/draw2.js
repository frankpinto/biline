//tool.fixedDistance = 10;
var socket = io.connect('http://' + window.location.hostname);

var thickness = new Point({length: 5, angle: null});
var path;
var strokeEnds = 2;

function onMouseDown(event) {
    path = new Path();
    path.fillColor = "black";
}

var lastPoint;
function onMouseDrag(event) {
    // If this is the first drag event,
    // add the strokes at the start:
    if(event.count == 1) {
        addStrokes(event.middlePoint, event.delta * -1);
    } else {
        var step = event.delta / 2;
        thickness.angle = step.angle + 90;

        var top = event.middlePoint + thickness;
        var bottom = event.middlePoint - thickness;

        path.add(top);
        path.insert(0, bottom);
    }
    
    lastPoint = event.middlePoint;
    socket.emit('mousedrag', {point: event.point});
}

function onMouseUp(event) {
    var delta = event.point - lastPoint;
    delta.length = tool.maxDistance;
    addStrokes(event.point, delta);
    path.closed = true;
    var segments = serializeSegments(path.segments);
    socket.emit('mouseup', {segments: segments});
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

function serializeSegments(segments)
{
    for (i = 0; i < segments.length; i++)
    {
      segment = segments[i];
      delete segment._path;
      delete segment._handleIn._owner;
      delete segment._handleOut._owner;
      delete segment._point._owner;
    }
    return segments;
}

