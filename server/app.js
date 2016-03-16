var express = require('express');
var app = express();

app
    .use(express.static('../dist'))
    .get('/persons', (request, response) => {
	response.json([
	    "Fabian Böller",
	    "Andre Flemming",
	    "Tim Kempen",
	    "Bernhard Lüttgenau",
	    "Anton Sander",
	    "Thomas Gesseleit-Braun"
	]);
    })
    .get('/semester', (request, response) => {
	response.json({
	    name: request.query.name,
	    alania: {
		vorstand: {
		    X: 'Bernhard Lüttgenau',
		    FM: 'Anton Sander',
		    VX: 'Andre Flemming',
		    XX: 'Thomas Gesseleit-Braun',
		    XXX: 'Marc Zandek'
		},
		klein: {
		    Vereinsgericht: ['Jens Lock', 'Karsten Melzer', 'Michael Janssen'],
		    DCA: ['Lukas Heinen', 'Bertram Buchholz', 'Fabian Böller']
		}
	    },
	    laetitia: {
		vorstand: {
		    X: 'Anna Paeßens',
		    FM: 'Sandy Niesten',
		    VX: 'Eva-Maria Zeißig',
		    XX: 'Helen Schmidt',
		    XXX: 'Andreia Marques Peixoto'
		},
		klein: {
		    Homepage: ['Nele Kegler']
		}
	    },
	    haus: {
		Bier: ['Fabian Böller', 'Philipp Caesar', 'Nele Semrau'],
		BA: ['Jan Philip Schulze-Ardey', 'Tim Kempen', 'Jan Staffel', 'Dana Hein', 'Luisa Gaspar']
	    }
	});
    })
    .listen(3000, () => {
	console.log('Server running at http://127.0.0.1:3000/');
    });
