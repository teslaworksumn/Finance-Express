let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/auth');
  }
};

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.redirect('/auth');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.redirect('/auth');
  }
};

module.exports = {
  checkToken: checkToken,
  checkAuth: checkAuth
}
