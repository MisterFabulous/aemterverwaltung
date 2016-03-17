var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db = require('./db_access');

var _ = require('underscore');

app
    .use(express.static('../dist'))
    .get('/persons', db.get('persons'))
    .get('/belegungen', db.get('belegungen'))
    .get('/aemter', db.get('aemter'))
    .listen(3000, () => {
	console.log('Server running at http://127.0.0.1:3000/');
    });
