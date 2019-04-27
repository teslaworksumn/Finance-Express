var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');

router.get('/', middleware.checkToken, function(req, res) {
  res.sendFile(__dirname + '/src/ledger.html');
});

module.exports = router;
