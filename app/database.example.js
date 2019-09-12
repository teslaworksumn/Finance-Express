var mysql = require('mysql');

var connection = mysql.createConnection({
    host:     'localhost',
    user:     'username',
    password: 'password',
    database: 'database'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
