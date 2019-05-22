var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');

var bodyParser = require('body-parser');
var plaid = require('plaid');

var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;

router.get('/', middleware.checkAuth, function(req, res) {
  res.sendFile(__dirname + '/src/plaid.html');
});

var client = new plaid.Client(
	'5cd99b39047a1d0013ba3a68',
	'f1a25a722d7df00dfee795fc501dc5',
	'44347b607c3af81f063221cf79697f',
	plaid.environments.development
);

router.post('/get_access_token', function(request, response, next) {
	PUBLIC_TOKEN = request.body.public_token;
	client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
		if (error != null) {
			console.log('Could not exchange public_token!\n' + error);
			return response.json({error: msg});
		}
		ACCESS_TOKEN = tokenResponse.access_token;
		ITEM_ID = tokenResponse.item_id;
		response.json({'error': false, 'ACCESS_TOKEN': ACCESS_TOKEN, 'ITEM_ID': ITEM_ID});
	});
});

router.get('/get_transactions', function(req, res) {
	var accessToken = "access-development-5b2f13e6-20ef-4b34-ae01-f41dbea645aa";
	var transactions = null;
	client.getTransactions(accessToken, '2019-01-01', '2019-02-01', {
		count: 250,
		offset: 0,
	}, (err, result) => {
		res.json({'transactions': result.transactions});
		//transactions = result.transactions;
	});
	//res.json({'transactions': transactions});
});

module.exports = router;
