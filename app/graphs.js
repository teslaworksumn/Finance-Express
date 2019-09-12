var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var con = require('./database.js');

router.get('/', middleware.checkAuth, function(req, res) {
  res.sendFile(__dirname + '/src/graphs.html');
});

router.get('/spending/:year', middleware.checkAuth, function(req, res) {
	var query = "select * from spending where year = ?"; 
	var results = con.query(query,
	[
		req.params.year
	],
	function(error, results, fields) {
		if (error) {
			res.status(200).json({error: error.code});
		} else {
			var resultJson = JSON.stringify(results);
			resultJson = JSON.parse(resultJson);
			res.json(resultJson);
		}
	});
});

module.exports = router;
