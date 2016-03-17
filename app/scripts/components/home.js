import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

var Amt = React.createClass({
    render() {
	return (
	    <tr>
	      <td>
		{this.props.description}
	      </td>
	      <td>
		{this.props.name}
	      </td>
	    </tr>
	);
    }
});

var fullname = (person) =>
	person.firstname + ' ' + person.lastname;
var belegungsliste = (belegungen) =>
	_.groupBy(belegungen, (belegung) => belegung.amt);
var createBelegungen = (belegungen) =>
	_.mapObject(belegungsliste(belegungen), (persons,amt) => <Amt description={amt} name={persons.map(fullname).join(', ')} />);

var Aemteraufstellung = React.createClass({
    render() {
	return (
	    <div className={"panel panel-default " + this.props.frat}>
  	      <div className="panel-heading">
		{this.props.title}
	      </div>
	      <table className="table">
		{createBelegungen(this.props.aemter)}
	      </table>
	    </div>
	);
    }
});

var isVorstand = (amt) => _.contains(['X', 'XX', 'XXX', 'VX', 'FM'], amt);

export var Semester = React.createClass({
    getInitialState() {
	return { belegungen: [] };
    },
    componentDidMount() {
	this.serverRequest = $.get("http://localhost:3000/belegungen?semester=" + this.props.name, (result) => {
	    this.setState({belegungen: result});
	}.bind(this));
    },
    componentWillUnmount() {
	this.serverRequest.abort();
    },
    render() {
	return (
	    <div className="panel panel-default semester">
	      <div className="panel-heading">{this.props.name}</div>
	      <div className="panel-body">
		<div className="row">
		  <div className="col-xs-6">
		    <Aemteraufstellung title="Alanenvorstand" aemter={this.state.belegungen.filter((b) => b.frat == 'alania' && isVorstand(b.amt))} frat="aln" />
		    <Aemteraufstellung title="Alanenämter" aemter={this.state.belegungen.filter((b) => b.frat == 'alania' && !isVorstand(b.amt))} frat="aln" />
		  </div>
		  <div className="col-xs-6">
		    <Aemteraufstellung title="Laetizenvorstand" aemter={this.state.belegungen.filter((b) => b.frat == 'laetitia' && isVorstand(b.amt))} frat="lae" />
		    <Aemteraufstellung title="Laetizenämter" aemter={this.state.belegungen.filter((b) => b.frat == 'laetitia' && !isVorstand(b.amt))} frat="lae" />
		  </div>
		</div>
		<Aemteraufstellung title="Hausämter" aemter={this.state.belegungen.filter((b) => b.frat == 'haus')} frat="haus" />
	      </div>
	    </div>
	);
    }
});
