var socket = io.connect('http://' + window.location.hostname);

var path;

socket.on('pathReady', function(segments) {
  path = new Path(segments);
});
