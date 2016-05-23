var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');

var connect = handler => 
    MongoClient.connect(config().connection.mongo, handler);

// Returns a function, that answers a request data and filters with the query in the url
exports.get = (table) => (request, response) => {
    connect((err, db) => {
	assert.equal(null, err);
	console.log("Start querying '" + table + "' data");
	db.collection(table)
	    .find(request.query)
	    .toArray((err1, persons) => {
		assert.equal(null, err1);
		response.json(persons);
		console.log("Found " + persons.length + " elements of " + table);
		db.close();
	    });
    });
};

exports.updateBelegungen = (request, response) => {
    connect((err, db) => {
	assert.equal(null, err);
	console.log("Start updating 'belegungen'");
	console.log("Start removing old ones");
	db.collection('belegungen')
	    .deleteMany({
		semester: request.body.semester,
		amt: request.body.amt,
		org: request.body.org
	    }, (err1, r1) => {
		assert.equal(null, err1);
		console.log("Removed " + r1.deletedCount + " from 'belegungen'");
		console.log(JSON.stringify(request.body));
		if(request.body.persons) {
		    console.log("Start inserting new ones");
		    db.collection('belegungen')
			.insertMany(request.body.persons.map(p => { return {
			    firstname: p.firstname,
			    lastname: p.lastname,
			    amt: request.body.amt,
			    org: request.body.org,
			    semester: request.body.semester
			};}), (err2, r2) => {
			    assert.equal(null, err2);
			    console.log("Inserted " + r2.insertedCount + " into 'belegungen'");
			    db.close();
			    response.send(200);
			});
		}
	    });
    });
};

exports.addPerson = (request, response) => {
    connect((err, db) => {
	assert.equal(null, err);
	console.log("Start adding 'person'");
	db.collection('persons')
	    .insert({
		firstname: request.body.firstname,
		lastname: request.body.lastname,
		org: request.body.org,
		sex: request.body.sex
	    }, (err1, r1) => {
		assert.equal(1, r1.insertedCount);
		console.log("Inserted one person");
		db.close();
		response.send(200);
	    });
    });
};

exports.availableSemesters = (request, response) => {
    connect((err, db) => {
	assert.equal(null, err);
	console.log("Start collecting available semesters");
	db.collection("belegungen")
	    .distinct("semester")
	    .then(arr => {
		response.json(arr);
		console.log("Found " + arr.length + "available semester");
		db.close();
	    });
    });
};
