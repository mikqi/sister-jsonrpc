var express = require('express');
var path = require('path');
var jayson = require('jayson');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var routes = require('./routes/index');
var Blowfish = require('blowfish');
var bf = new Blowfish('some key');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);

var server = jayson.server({
  echo: function(data, time, color, callback) {
    callback(null, { detail: data, waktu: time, color: color });
  },

  multiply: function(a, b, callback) {
    callback(null, a * b);
  },
});

var dataTemp = {};

server.http().listen(3001, function() {
  console.log('Server listening on http://localhost:3001');
});

var data = [];
var dataRefresh = [];
var online = 0;

var client = jayson.client.http({ port: 3001, host: 'localhost' });

/* GET home page. */

app.get('/', function(req, res) {

  res.render('index', { data: dataRefresh });
});

app.post('/', function(req, res, next) {

  // FORMAT WAKTU Menit kurang dair 2 digit
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes().toString();
  if (m.length === 1) {
    m = '0' + today.getMinutes().toString();
    var time = [h, m].join(':');
    console.log(m);
  } else {
    var time = [h, m].join(':');
  }

  client.request('echo', [req.body.message, time], function(err, reply) {
    console.log(reply);
    data.push(reply);
  });

  console.log(req.body.message);
  res.redirect('/');
  next();
});

io.on('connection', function(socket) {
  console.log('user connected');
  var color = '';

  // SETIAP DC
  socket.on('disconnect', function() {
    online -= 1;
    io.emit('disconnect', { nama: socket.nama, online: online });
    console.log(`${socket.nama} has been disconnected`);
  });

  // SETIAP ADA YANG JOIN
  socket.on('join', function(nama) {
    online += 1;
    socket.nama = nama.nama;
    console.log(nama);
    color = nama.color;
    io.emit('join', { nama: nama.nama, online: online });
  });

  socket.on('typing', function(status) {
    io.emit('typing', status);
  });

  // USER REQUEST SAVE CACHE
  socket.on('chat message', function(msg) {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();

    var time = [h, m].join(':');

    client.request('echo', [msg, time, color], function(err, reply) {
      console.log(`client request`);
      console.log(reply);
      dataTemp = reply;
      dataTemp.result.detail.pesan = bf.decrypt(reply.result.detail.pesan).replace(/0/g, '');

      dataRefresh.push(reply);
      data.push(reply);
      io.emit('chat message', data);

    });

    console.log(msg);
  });
});

http.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
