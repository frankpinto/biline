#!/usr/local/bin/node

var OAuth= require('oauth').OAuth;

var oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  'UFzttyoZssfh6V8o5uapA',
  'HI5CLqlwQtuyPOnp9j1uW515kpe5wzN7D8JLjGH3Yw',
  '1.0',
  'http://frankpinto.info:3000/auth/twitter/callback',
  'HMAC-SHA1'
);

var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app, {log: false});

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

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.session({secret: 'pandas'}));

app.get('/', function(req, res, next) {
  var username = req.session.username;// || 'frankjpinto';
  req.session = null;
  if (username) {
    res.render('index.ejs', {layout: false, username: username, hidden: ''});
  } else {
    res.render('index.ejs', {layout: false, username: null, hidden: ' hidden'});
  }
  res.end();
});

app.get('/auth/twitter', function (req, res) {
  console.log('got called');
  oauth.getOAuthRequestToken( function (err, oauth_token, oauth_token_secret, results) {
    if (err) {
      throw err;
    } else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      req.session.oauth.token_secret = oauth_token_secret;
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
    }
  });  
});


app.get('/auth/twitter/callback', function (req, res) {
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oa = req.session.oauth;

    oauth.getOAuthAccessToken(oa.token, oa.token_secret, oa.verifier,
      function (err, oauth_access_token, oauth_access_token_secret, results) {
        if (err) {
          throw err;
        } else {
          req.session.oauth.access_token = oauth_access_token;
          req.session.oauth.access_token_secret = oauth_access_token_secret;
          req.session.username = results.screen_name;
          res.redirect('/');
        }
    });
  }
});


app.listen(3000, function() {
    console.log('Now listening on port 3000');    
});
