// Script-wide stroke specific variables
var thickMag = 5;
var thickness = new Point({length: thickMag, angle: null});
var path;
var strokeEnds = 2;

// Shortcuts to proceed elements
var undo = document.getElementById('undo');
var proceed = document.getElementById('confirm'); // Think 'confirm' is a reserved keyword
var buttons = [undo, proceed];

// Shortcuts to settings elements
var small = document.getElementById('small_stroke');
var med = document.getElementById('med_stroke');
var large = document.getElementById('large_stroke');
var strokes = [small, med, large];

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

var strokeDrawn = false;
function toggleProceed()
{
  if (hasClass(buttons[0], 'hidden'))
  {
    strokeDrawn = true;
    buttons.forEach(function(b) {
			removeClass(b, 'hidden');
    });
  }
  else
  {
    strokeDrawn = false;
    buttons.forEach(function(b) {
      addClass(b, 'hidden');
    });
  }
}

/*
 * Drawing Event Handlers
 */
function onMouseDown(event) {
  if (!strokeDrawn)
  {
    path = new Path();
    path.fillColor = "black";
    //path.add(event.point);
    serializedPath = {points: [], startPoint: null, endPoint: null};
  }
}

var lastPoint;
function onMouseDrag(event) {
  if (!strokeDrawn)
  {
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
}

function onMouseUp(event) {
  if (!strokeDrawn)
  {
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
}

/* 
 * Settings change Event Handlers
 */
strokes.forEach(function(s) {
  s.addEventListener('mouseup', changeThickness);
  s.addEventListener('touchend', changeThickness);
});
function changeThickness(event)
{
  strokes.forEach(function(s) {
      removeClass(s, 'current');
  });
  addClass(event.target, 'current');
  if (event.target.dataset)
     var strokeThickness = event.target.dataset.stroke;
  else
  {
    if (event.target.hasAttribute('data-stroke'))
      var strokeThickness = event.target.hasAttribute('data-stroke');
  }

  switch (strokeThickness) {
    case 'small':
      thickness = new Point({length: 2, angle: null});
      break;
    case 'large':
      thickness = new Point({length: 7, angle: null});
      break;
    default:
      thickness = new Point({length: 5, angle: null}); // Medium
      break;
  }
}

/*
 * Proceed buttons' event handlers
 */
undo.addEventListener('touchend', undoPath);
undo.addEventListener('mouseup', undoPath);
proceed.addEventListener('touchend', sendPaths);
proceed.addEventListener('mouseup', sendPaths);
function undoPath(event)
{
  children = project.activeLayer.getChildren();
  if (children.length > 0)
  {
   project.activeLayer.removeChildren(children.length - 1);
   redrawData.pop();
  }
  view.draw();
}
function sendPaths(event)
{
}


// So that redraw knows when to initialize
if (paper.project)
{
	var event = document.createEvent('HTMLEvents');
	event.initEvent('paperReady', true, false);
	document.dispatchEvent(event);
}
