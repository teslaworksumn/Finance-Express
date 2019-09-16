var express = require('express');
var router  = express.Router();
let jwt     = require('jsonwebtoken');
let fs      = require('fs');
const path  = require('path');

var middleware = require('./middleware.js');
const con      = require('./database.js');

const {OAuth2Client} = require('google-auth-library');
const credentials    = require('./google_client_id.json');

router.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/login.html');
});

// Given a user ID token, verify the token using Google's oauth stuff
router.post('/token_sign_in', function(req, res) {
    const token     = req.body.idtoken;
    const CLIENT_ID = credentials.client_id;

    const client = new OAuth2Client(CLIENT_ID);

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            hd: 'umn.edu',        // only UMN accounts
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];

        req.session.user = await loginUser(payload);
        req.session.userRole = await checkRole(req.session.user);
        res.send(req.session.user);
    }

    verify().catch(console.error);
});

router.get('/role', function(req, res) {
  res.send(req.session.userRole);
})

router.post('/checkMe', function(req, res) {
    res.send(req.session.user);
})

// Logs in a user with Google UMN credientials
// If a user has signed in before, simply lets them log in
// If a user hasn't logged in before, adds them to the database and then logs them in
// If a duplicate user exists, rejects the promise with an error message
function loginUser(info) {
    return new Promise((resolve, reject) => {
        const email     = info.email;
        const firstName = info.given_name;
        const lastName  = info.family_name;
        const googleId  = info.sub;

        con.query('SELECT * FROM user WHERE googleId = ?', [googleId], function (err, result) {
            if (err) {
                throw err;
            }

            if (result.length == 0) { // new user
                const addQuery = 'INSERT INTO user (email, firstname, lastname, googleId) VALUES (?, ?, ?, ?)';
                con.query(addQuery, [email, firstName, lastName, googleId], function (err, result) {
                    if (err) {
                        throw err;
                    }

                    // successful insert of new user
                    resolve(email);
                });
            } else if (result.length == 1) { // returning user
                resolve(email);
            } else { // duplicate user - shouldn't ever happen
                console.log('ERROR: Duplicate user found in database');
                reject('ERROR: Duplicate user found in database');
            }
        });
    });
}

// Given the email of a logged in user, returns the string of the user's role
function checkRole(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT role.name FROM role INNER JOIN user ON role.roleid=user.roleid WHERE user.email= ?';

        con.query(query, [email], function (err, result) {
            if (err) {
                throw err;
            }

            if (result.length == 0) {
                console.error('Email ' + email + ' not found in database');
                reject('ERROR: Email ' + email + ' not found in database');
            } else if (result.length == 1) {
                resolve(result[0].name);
            } else { // duplicate user - shouldn't ever happen
                console.error('Duplicate user found in database');
                reject('ERROR: Duplicate user found in database');
            }
        });
    });
}

module.exports = router;
