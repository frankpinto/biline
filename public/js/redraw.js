/*
 * Receive the data from the server and draw what the other client sent
 */

var socketedPaper = {};
document.addEventListener('paperReady', function() {
	paper.install(socketedPaper);
	socketedPaper.socket = socket;
	//socketedPaper.projects[0].activate();
	console.log('In redraw', socketedPaper);

	// Install PaperScope context
	var setupRedraw = (function() {
		console.log(this);

		var originalLayer;
		var secondLayer;
		var pathsDrawn = 0;
		var redraw = (function(packet) {
			console.log(this);
			if (!secondLayer)
			{
				originalLayer = this.projects[0].activeLayer;
				secondLayer = new this.Layer();
			}
			else
				secondLayer.activate();

			paths = packet.data;
			while (pathsDrawn < paths.length)
			{
				var newPath = new this.Path();
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
			this.views[0].draw();
			
			// Switch back to what user is doing
			originalLayer.activate();
		}).bind(this);

		socket.on('pathReady', redraw);
	}).bind(socketedPaper);

	setupRedraw();
});
