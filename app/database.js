var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'teslaFinance',
  password : 'teslaFinancePass',
  database : 'financeTest'
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = connection;
