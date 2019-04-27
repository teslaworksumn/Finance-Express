const express = require('express')
const app = express();

app.get('/', (req, res) => {
	res.send('Hello world!')
});

app.post('/', (req, res) => {
	res.send('This is a POST request!')
});

app.listen(8000, () => {
	console.log('Server listening on port 8000')
});
