var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var con = require('./database.js');

router.get('/', middleware.checkAuth, function(req, res) {
  res.sendFile(__dirname + '/src/ledger.html');
});

router.get('/:year', middleware.checkAuth, function(req, res) {
	var query = `select 
        ledgerid,
        date,
        (select name from ledgertype where generalledger.ledgertypeid = ledgertype.ledgertypeid) as type,
        checknum,
        (select name from receiptstatus where generalledger.receiptstatusid = receiptstatus.receiptstatusid) as receipt,
        expense,
        deposit,
        source,
        description,
        (select name from project where generalledger.projectid = project.projectid) as project,
        (select name from externalfunding where generalledger.externalfundingid = externalfunding.externalfundingid) as externalfunding,
        (select name from incomecategory where generalledger.incomecategoryid = incomecategory.incomecategoryid) as income,
        (select name from ssfoptions where generalledger.ssfoptionsid = ssfoptions.ssfoptionsid) as ssf,
        (select name from category where generalledger.categoryid = category.categoryid) as category,
        (select name from allocation where generalledger.allocationid = allocation.allocationid) as allocation,
        (select year from fiscalyear where generalledger.fiscalyearid = fiscalyear.fiscalyearid) as fiscalyear
    from generalledger where (select fiscalyearid from fiscalyear where year = ?) = fiscalyearid 
    order by date desc`;
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
