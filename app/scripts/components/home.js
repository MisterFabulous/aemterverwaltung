import React from 'react';

var SEMESTER = {
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
};

var Amt = React.createClass({
    render() {
	return <tr><td>{this.props.description}</td><td>{this.props.name}</td></tr>;
    }
});

var Haus = React.createClass({
    render() {
	return (
	    <div className="panel panel-default">
  	    <div className="panel-heading">Hausämter</div>
	    <table className="table">
	    {_.mapObject(this.props.haus, (persons,amt) => <Amt description={amt} name={persons.join(', ')} />)}
	    </table>
	    </div>
	);
    }
});

var Vorstand = React.createClass({
    render() {
	return (
	    <div className="panel panel-default">
  	    <div className="panel-heading">{this.props.title}</div>
	    <table className="table">
	    {_.mapObject(this.props.vorstand, (person,amt) => <Amt description={amt} name={person} />)}
	    </table>
	    </div>
	);
    }
});

export default class extends React.Component {
    render() {
	return (
	    <div className="panel panel-default">
	    <div className="panel-heading">{SEMESTER.name}</div>
	    <div className="panel-body">
	    <div className="row">
	    <div className="col-xs-6"><Vorstand title="Alanenvorstand" vorstand={SEMESTER.alania.vorstand} /></div>
	    <div className="col-xs-6"><Vorstand title="Laetizenvorstand" vorstand={SEMESTER.laetitia.vorstand} /></div>
	    </div>
	    <Haus haus={SEMESTER.haus} />
	    </div>
	    </div>
	);
    }
}
