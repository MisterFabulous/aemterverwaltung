var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db = require('./db_access');

var _ = require('underscore');

app
    .use(express.static('../dist'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .get('/persons', db.get('persons'))
    .get('/belegungen', db.get('belegungen'))
    .get('/aemter', db.get('aemter'))
    .get('/semester', db.availableSemesters)
    .post('/update_belegungen', db.updateBelegungen)
    .listen(3000, () => {
	console.log('Server running at http://127.0.0.1:3000/');
    });
