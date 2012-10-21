var thickness = 7;
var greytone = 0.9;

var function greyset(tone) {
    greytone = tone;
}





var color = new RgbColor(0, 0, 0, greytone); 
//change last number between 0=white and 1=black

tool.minDistance = thickness;
tool.maxDistance = thickness*3;

var path;

function onMouseDown(event) {
    path = new Path();
    path.fillColor = color;
    path.add(event.point);
}

function onMouseDrag(event) {
    var step = event.delta / 2;
    step.angle += 90;
    
    var top = event.middlePoint + step*0.6;
    var bottom = event.middlePoint - step*0.6;
    
    path.add(top);
    path.insert(0, bottom);
    path.smooth();
}

function onMouseUp(event) {
    path.add(event.point);
    path.closed = true;
    path.smooth();
}