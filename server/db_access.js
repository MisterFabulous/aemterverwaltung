var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');

// Returns a function, that answers a request data and filters with the query in the url
exports.get = (table) => (request, response) => {
    MongoClient.connect(config().mongo, (err, db) => {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	db.collection(table)
	    .find(request.query)
	    .toArray((err, persons) => {
		assert.equal(null, err);
		response.json(persons);
		db.close();
	    });
    });
};

exports.updateBelegungen = (request, response) => {
    MongoClient.connect(config().mongo, (err, db) => {
	assert.equal(null, err);
	console.log("Start updating 'belegungen'");
	try {
	    db.collection('belegungen')
		.remove({
		    semester: request.body.semester,
		    amt: request.body.amt,
		    frat: request.body.frat,
		    $isolated: true
		});
	    console.log(JSON.stringify(request.body));
	    if(request.body.persons) {
		db.collection('belegungen')
		    .insertMany(request.body.persons.map(p => { return {
			firstname: p.firstname,
			lastname: p.lastname,
			amt: request.body.amt,
			frat: request.body.frat,
			semester: request.body.semester
		    };}));
	    }
	} catch (e) {
	    console.log(e);
	    response.json(e);
	}
    });
};

exports.addPerson = (request, response) => {
    MongoClient.connect(config().mongo, (err, db) => {
	assert.equal(null, err);
	console.log("Start adding 'person'");
	db.collection('persons')
	    .insert({
		firstname: request.body.firstname,
		lastname: request.body.lastname,
		frat: request.body.frat,
		sex: request.body.sex
	    });
    });
};

exports.availableSemesters = (request, response) => {
    MongoClient.connect(config().mongo, (err, db) => {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	db.collection("belegungen")
	    .distinct("semester")
	    .then(arr => {
		response.json(arr);
		db.close();
	    });
    });
};
