var express = require('express');
var jayson = require('jayson');
var router = express.Router();

var server = jayson.server({
  echo: function(msg, callback) {
    callback(null, msg);
  },

  multiply: function(a, b, callback) {
    callback(null, a * b);
  },
});

server.http().listen(3001, function() {
  console.log('Server listening on http://localhost:3001');
});

var data = [];

var client = jayson.client.http({ port: 3001, host: 'localhost' });

/* GET home page. */

router.get('/', function(req, res) {

  res.render('index', { title: data });

  client.request('multiply', [5, 5], function(err, reply) {
    // res.render('index', { title: JSON.stringify(reply) });
  });
});

router.post('/', function(req, res, next) {

  client.request('echo', [req.body.message], function(err, reply) {
    console.log(reply);
    data.push(reply);
  });

  console.log(req.body.message);
  res.redirect('/');
  next();
});

module.exports = router;
