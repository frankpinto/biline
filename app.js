#!/usr/local/bin/node

var express = require('express');
var app     = express.createServer();
var io      = require('socket.io').listen(app, {log: false});

io.sockets.on('connection', function (socket) {
  console.log('Drawer named ' + socket.id + ' has joined the session.');
  //console.log('Waiting for other client to connect');
  socket.on('segmentsReady', function (data) {
    socket.broadcast.emit('pathReady', data);
  });

  socket.on('disconnect', function() {
    console.log('Drawer named ' + socket.id + ' has disconnected.');
  });
});

app.use(express.cookieParser());
//app.use(express.session({secret: 'pandas'}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.render('index.ejs', {layout: false});
  res.end();
});

app.listen(3000, function() {
    console.log('Now listening on port 3000');    
});
