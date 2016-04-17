var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/aemter';

// Returns a function, that answers a request data and filters with the query in the url
exports.get = (table) => (request, response) => {
    MongoClient.connect(url, (err, db) => {
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

exports.availableSemesters = (request, response) => {
    MongoClient.connect(url, (err, db) => {
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
