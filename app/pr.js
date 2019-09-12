var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var con = require('./database.js');

router.get('/', function(req, res) {
  res.sendFile(__dirname + '/src/pr.html');
});

router.get('/projects', function(req, res) {
	var query = "select * from project where proption = 1"; 
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

router.get('/allocations', function(req, res) {
	var query = "select * from allocation where proption = 1"; 
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

router.get('/prtypes', function(req, res) {
	var query = "select * from prtype"; 
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
