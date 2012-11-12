// Script-wide stroke specific variables
var thickMag = 5;
var thickness = new Point({length: thickMag, angle: null});
var path;
var strokeEnds = 2;

// Shortcuts to proceed elements
var undo = document.getElementById('undo');
var proceed = document.getElementById('confirm'); // Think confirm is a reserved keyword
var buttons = [undo, proceed];

// Data to send across the sockets
var redrawData = [];
var serializedPath = {}; // Changes on every drawing

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

function toggleProceed()
{
	buttons.forEach(function(b) {
		if (hasClass(b, 'hidden'))
			removeClass(b, 'hidden');
		else
			addClass(b, 'hidden');
	});
}

/*
 * Event listeners - take care of drawing
 */
function onMouseDown(event) {
    //prevent(event);
    path = new Path();
    path.fillColor = "black";
    //path.add(event.point);
    serializedPath = {points: [], startPoint: null, endPoint: null};
}

var lastPoint;
function onMouseDrag(event) {
    var step = event.delta / 2;
    thickness.angle = step.angle + 90;

    var top = event.point + thickness;
    var bottom = event.point - thickness;

    path.add(top);
    path.insert(0, bottom);
    serializedPath.points.push([top.x, top.y]);
    serializedPath.points.splice(0, 0, [bottom.x, bottom.y]);

    lastPoint = event.point;
}

function onMouseUp(event) {
		toggleProceed();
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

if (paper.project)
{
	var event = document.createEvent('HTMLEvents');
	event.initEvent('paperReady', true, false);
	document.dispatchEvent(event);
	console.log('Dispatched paperReady event', paper);
}
	else
		console.log('In draw', paper);
