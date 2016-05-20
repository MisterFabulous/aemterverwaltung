var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db = require('./db_access');

var _ = require('underscore');

var config = require('../config');

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .get('/services/persons', db.get('persons'))
    .get('/services/belegungen', db.get('belegungen'))
    .get('/services/aemter', db.get('aemter'))
    .get('/services/semester', db.availableSemesters)
    .post('/services/update_belegungen', db.updateBelegungen)
    .post('/services/add_person', db.addPerson)
    .listen(config().connection.port, () => {
	console.log('Server running at http://' + config().connection.host + ':' + config().connection.port + '/');
    });
