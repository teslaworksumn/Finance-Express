var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var con = require('./database.js');

router.get('/:term', middleware.checkAuth, function(req, res) {
	var query = "";
	switch (req.params.term) {
		case "ssf":
			query = "select * from ssfoptions";
			break;
		case "type":
			query = "select * from ledgertype";
			break;
		case "receipt":
			query = "select * from receiptstatus";
			break;
		case "project":
			query = "select * from project";
			break;
		case "externalfunding":
			query = "select * from externalfunding";
			break;
		case "income":
			query = "select * from incomecategory";
			break;
		case "category":
			query = "select * from category";
			break;
		case "allocation":
			query = "select * from allocation";
			break;
		case "years":
			query = "select * from fiscalyear";
			break;
	}
	var results = con.query(query, function(error, results, fields) {
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
