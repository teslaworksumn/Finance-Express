# Development Environment Setup

## Overview

Tesla Works uses its own website to manage purchase requests coming from its
many projects.  This information is stored in a MySQL database while the
website is served by a NodeJS Express server.

## Software

In order for a local version of this website to be build and tested, the
following must be installed and configured:

* Node with the Express extension
* MySQL

On an Ubuntu machine, Node with NPM can be installed with
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs
```

A MySQL database must be running locally and contain the appropriate schema to
be used effectively.

Contact a Telsa Works officer or email `tesla@umn.edu` and ask about getting
access to a test database to use for development.

## Files

A `database.example.js` file has been provided for you to modify with your own
credentials.  You should change the name of this file to `database.js` to
prevent it from being source controlled with the command:
```
mv database.example.js database.js
```

The `database.example.js` file looks like:
```javascript
var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'teslaFinance',
  password : 'teslaFinancePass',
  database : 'financeTest'
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = connection;
```

This file will be used to authenticate to the MySQL server and make queries to
the database.

## Running

Create a self-signed certificate using the following command

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Run the server.js file using Node

```
cd /path/to/this/repo/app
node server.js
```

This will start the Express webserver.

Using 8000 port, point your browser to

```
https://localhost:8000
```

which will serve up the login page used by the website and, with a valid login,
allow access to the rest of it for testing.

## Contact

Email this repo's admins or `tesla@umn.edu` if you have any questions.
