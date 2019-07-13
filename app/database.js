var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'teslaFinance',
  password : 'teslaFinancePass',
  database : 'financetest'
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = connection;
