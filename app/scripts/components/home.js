import React from 'react';

export default class extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    semester: {
		name: 'WS 15/16',
		alania: {
		    vorstand: {
			X: 'Jan Philip Schulze-Ardey',
			FM: 'Philip Bredol',
		        VX: 'Lukas Heinen',
			XX: 'Daniel Schürmann',
			XXX: 'Patrick Köhnen'
		    }
		},
		laetitia: {
		    vorstand: {
			X: 'Jan Philip Schulze-Ardey',
			FM: 'Philip Bredol',
			VX: 'Lukas Heinen',
			XX: 'Daniel Schürmann',
			XXX: 'Patrick Köhnen'
		    }
		},
		haus: {
		    Vereinsgericht: ['Tim Kempen', 'Michael Janssen', 'Bertram Buchholz'],
		    DCA: ['Samuel Schulte', 'Bernhard Lüttgenau', 'Andre Flemming']
		}
	    }
	};
    }

    render() {
	return (
	    <div>
	    {this.renderVorstand('Alanenvorstand', this.state.semester.alania.vorstand)}
	    {this.renderVorstand('Laetizenvorstand', this.state.semester.laetitia.vorstand)}
	    {this.renderHaus(this.state.semester.haus)}
	    </div>
	);
    }

    renderVorstand(title, vorstand) {
	return (
	    <div className="panel panel-default">
  	    <div className="panel-heading">{title}</div>
	    <ul className="list-group">
	    {_.mapObject(vorstand, (person,amt) => this.renderAmt(amt, person))}
	    </ul>
	    </div>
	);
    }

    renderHaus(haus) {
	return (
	    <div className="panel panel-default">
  	    <div className="panel-heading">Hausämter</div>
	    <ul className="list-group">
	    {_.mapObject(haus, (persons,amt) => this.renderAmt(amt, persons.join(', ')))}
	    </ul>
	    </div>
	);

    }

    renderAmt(description, name) {
	return <li className="list-group-item">{description}: {name}</li>
    }
}
