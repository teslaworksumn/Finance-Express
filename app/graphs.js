var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var con = require('./database.js');

router.get('/', middleware.checkAuth, function(req, res) {
  res.sendFile(__dirname + '/src/graphs.html');
});

router.post('/spending', function(req, res) {
	var query = "select (select name from project where generalledger.projectid = project.projectid) as project, SUM(CASE WHEN (deposit=0.00 or deposit is null) THEN expense ELSE -(deposit) END) as spending from generalledger where projectid <> \"null\" group by project";
	var results = con.query(query, function(error, results, fields) {
		if (error) {
			res.status(200).json({error: 'message'});
		} else {
			var resultJson = JSON.stringify(results);
			resultJson = JSON.parse(resultJson);
			res.json(resultJson);
		}
	});
});

module.exports = router;
