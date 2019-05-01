var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');

router.get('/', middleware.checkAuth, function(req, res) {
  res.sendFile(__dirname + '/src/home.html');
});

module.exports = router;
