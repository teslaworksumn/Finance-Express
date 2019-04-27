const express = require('express')
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

var ledger = require('./ledger.js');
var graphs = require('./graphs.js');

class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username, fetch user from DB here
    let mockedUsername = 'admin';
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
  }
  index (req, res) {
    res.sendFile(__dirname + '/src/index.html');
  }
}


// Starting point of the server
function main () {
  let app = express();
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.use('/ledger', ledger);
  app.use('/graphs', graphs);
  app.post('/login', handlers.login);
  app.get('/', middleware.checkToken, handlers.index);
  app.listen(port, () => console.log('Server is listening on port: ${port}'));
}

main();
