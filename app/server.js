const express = require('express')
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');
var session = require('express-session');

var mainpage = require('./mainpage.js');
var ledger = require('./ledger.js');
var graphs = require('./graphs.js');
var auth = require('./auth.js');


// Starting point of the server
function main () {
  let app = express();
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.use(express.static(__dirname + '/src'))
  app.use(session({secret: "tesla_works_is_amazing", saveUninitialized: false, resave: false}));
  app.use('/', mainpage);
  app.use('/auth', auth);
  app.use('/ledger', ledger);
  app.use('/graphs', graphs);
  app.listen(port, () => console.log('Server is listening on port: ${port}'));
}

main();
