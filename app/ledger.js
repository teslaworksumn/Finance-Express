var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var con = require('./database.js');

router.get('/', middleware.checkAuth, function(req, res) {
  res.sendFile(__dirname + '/src/ledger.html');
});

router.get('/fetch/:year', middleware.checkAuth, function(req, res) {
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

router.get('/info/:term', middleware.checkAuth, function(req, res) {
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

router.get('/destroy', middleware.checkAuth, function(req, res) {
	var values = JSON.parse(req.query.models);
	values = values[0];

	var ledgerid = values.ledgerid;

	var query = `delete from generalledger where ledgerid = ?`;

	var results = con.query(query, [ledgerid],
	function(error, results, fields) {
		if(error) {
			res.status(200).json({error: error.code});
		} else {
			res.status(200).json({success: "Line deleted successfully"});
		}
	});
});

router.get('/update', middleware.checkAuth, function(req, res) {
	var values = JSON.parse(req.query.models);
	values = values[0];

	var date = values.date;
	var type = values.type;
	var checknum = values.checknum;
	var receipt = values.receipt;
	var source = values.source;
	var description = values.description;
	var project = values.project;
	var externalfunding = values.externalfunding;
	var incomecat = values.income;
	var ssf = values.ssf;
	var category = values.category;
	var allocation = values.allocation;
	var expense = values.expense;
	var deposit = values.deposit;
	var ledgerid = values.ledgerid;

	date = date.substr(0,10);

	if(expense == '') {
		expense = 0.00;
	}
	if(deposit == '') {
		deposit = 0.00;
	}

	var query = `update generalledger set
	date = ?,
    ledgertypeid = (select ledgertypeid from ledgertype where name = ?),
    checknum = ?,
    receiptstatusid = (select receiptstatusid from receiptstatus where name = ?),
    expense = ?,
    deposit = ?,
    source = ?,
    description = ?,
    projectid = (select projectid from project where name = ?),
    externalfundingid = (select externalfundingid from externalfunding where name = ?),
    incomecategoryid = (select incomecategoryid from incomecategory where name = ?),
    ssfoptionsid = (select ssfoptionsid from ssfoptions where name = ?),
    categoryid = (select categoryid from category where name = ?),
    allocationid = (select allocationid from allocation where name = ?)
    where ledgerid = ?`;

    var results = con.query(query,
	[
		date,
		type,
		checknum,
		receipt,
		expense,
		deposit,
		source,
		description,
		project,
		externalfunding,
		incomecat,
		ssf,
		category,
		allocation,
		ledgerid
	],
	function(error, results, fields) {
		if(error) {
			res.status(200).json({error: error.code});
		} else {
			res.status(200).json({success: "Line entered successfully"});
		}
	});
});

router.get('/insert', middleware.checkAuth, function(req, res) {
	var values = JSON.parse(req.query.models);
	var year = req.query.year;
	values = values[0];

	var date = values.date;
	var type = values.type;
	var checknum = values.checknum;
	var receipt = values.receipt;
	var source = values.source;
	var description = values.description;
	var project = values.project;
	var externalfunding = values.externalfunding;
	var incomecat = values.income;
	var ssf = values.ssf;
	var category = values.category;
	var allocation = values.allocation;
	var expense = values.expense;
	var deposit = values.deposit;

	date = date.substr(0,10);

	if(expense == '') {
		expense = 0.00;
	}
	if(deposit == '') {
		deposit = 0.00;
	}

	var query = `insert into generalledger 
	(date,
	ledgertypeid,
	checknum,
	receiptstatusid,
	expense,
	deposit,
	source,
	description,
	projectid,
	externalfundingid,
	incomecategoryid,
	ssfoptionsid,
	categoryid,
	allocationid,
	fiscalyearid) values 
	(?,(select ledgertypeid from ledgertype where name = ?),?,(select receiptstatusid from receiptstatus where name = ?),?,?,?,?,(select projectid from project where name = ?),(select externalfundingid from externalfunding where name = ?),(select incomecategoryid from incomecategory where name=?),(select ssfoptionsid from ssfoptions where name=?),(select categoryid from category where name=?),(select allocationid from allocation where name=?),(select fiscalyearid from fiscalyear where year=?))`;

	var results = con.query(query,
	[
		date,
		type,
		checknum,
		receipt,
		expense,
		deposit,
		source,
		description,
		project,
		externalfunding,
		incomecat,
		ssf,
		category,
		allocation,
		year
	],
	function(error, results, fields) {
		if(error) {
			res.status(200).json({error: error.code});
		} else {
			res.status(200).json({success: "Line entered successfully"});
		}
	});
});

module.exports = router;
