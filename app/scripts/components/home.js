import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import InlineEdit from 'react-edit-inline';

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
	    <div className={this.props.frat + ' well'}>
  	      <h3>
		{this.props.title}
	      </h3>
	      <table className="table">
		{createBelegungen(this.props.aemter)}
	      </table>
	    </div>
	);
    }
});

var isVorstand = (amt) => _.contains(['X', 'XX', 'XXX', 'VX', 'FM'], amt);

var Semester = React.createClass({
    render() {
	return (
	    <div className="semester">
	      <div className="row">
		<div className="col-sm-6">
		  <Aemteraufstellung title="Alanenvorstand" aemter={this.props.belegungen.filter((b) => b.frat == 'alania' && isVorstand(b.amt))} frat="aln" />
		</div>
		<div className="col-sm-6">
		  <Aemteraufstellung title="Laetizenvorstand" aemter={this.props.belegungen.filter((b) => b.frat == 'laetitia' && isVorstand(b.amt))} frat="lae" />
		</div>
	      </div>
	      <div className="row">
		<div className="col-sm-6">
		  <Aemteraufstellung title="Alanenämter" aemter={this.props.belegungen.filter((b) => b.frat == 'alania' && !isVorstand(b.amt))} frat="aln" />
		</div>
		<div className="col-sm-6">
		  <Aemteraufstellung title="Laetizenämter" aemter={this.props.belegungen.filter((b) => b.frat == 'laetitia' && !isVorstand(b.amt))} frat="lae" />
		</div>
	      </div>
		<Aemteraufstellung title="Hausämter" aemter={this.props.belegungen.filter((b) => b.frat == 'haus')} frat="haus" />
	    </div>
	);
    }
});

export var Semesterauswahl = React.createClass({
    getInitialState() {
	return {
	    belegungen: [],
	    semester: "SS16"
	};
    },
    componentDidMount() {
	this.serverRequest = $.get("http://localhost:3000/belegungen?semester=" + this.state.semester, (result => {
	    this.setState({
		belegungen: result,
		semester: this.state.semester
	    });
	}));
    },
    componentWillUnmount() {
	this.serverRequest.abort();
    },
    render() {
	return (
	    <div>
	      <nav className="navbar navbar-default">
		<form className="navbar-form navbar-left" role="search">
		  <div className="form-group">
		    <input type="text" className="form-control" placeholder="Search" />
		  </div>
		  <button type="submit" className="btn btn-default">Submit</button>
		</form>
	      </nav>
	      <Semester name={this.state.semester} belegungen={this.state.belegungen} />
	      <InlineEdit
		 validate={text => true}
		activeClassName="editing"
		text={this.state.semester}
		paramName="semester"
		change={data => {}}
		/>
	    </div>
	);
    }
});
