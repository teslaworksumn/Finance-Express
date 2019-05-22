var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
var middleware = require('./middleware.js');

router.get('/', function(req, res) {
  res.sendFile(__dirname + '/src/login.html');
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  window.location = '/';
});

router.post('/', function(req, res) {
  var userName = req.body.user;
  //req.session.regenerate(function() {
  //  req.session.user = userName;
  //  res.send(req.session.user);
  //});
  req.session.user = userName;
  res.send(req.session.user);
  //session.save();
  //console.log(req.session.user);
});

router.post('/checkMe', function(req, res) {
  res.send(req.session.user);
})

router.post('/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  // For the purposes of this, the mocked username/password will be used temporarily
  let mockedUsername = 'username';
  let mockedPassword = 'password';

  if (username && password) {
    if (username === mockedUsername && password === mockedPassword) {
      let token = jwt.sign({username: username},
        config.secret,
        { expiresIn: '24h' // expires in 24 hours
        }
      );
      // return the JWT token for the future API calls
      res.json({
        success: true,
        message: 'Authentication successful',
        token: token
      });
    } else {
      res.send(403).json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
  } else {
    res.send(400).json({
      success: false,
      message: 'Authentication failed! Please check the request'
    });
  }
});

module.exports = router;
