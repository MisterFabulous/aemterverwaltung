import React from 'react';
import ReactDOM from 'react-dom';
import InlineEdit from 'react-edit-inline';

import _ from 'underscore';
import $ from 'jquery';

var Amt = props => {
    return (
	<tr>
	  <td>
	    {props.description}
	  </td>
	  <td>
	    {props.name}
	  </td>
	</tr>
    );
};

var fullname = person =>
	person.firstname + ' ' + person.lastname;
var belegungsliste = belegungen =>
	_.groupBy(belegungen, belegung => belegung.amt);
var createBelegungen = belegungen =>
	_.values(_.mapObject(belegungsliste(belegungen), (persons,amt) => <Amt description={amt} name={persons.map(fullname).join(', ')} />));

var Aemteraufstellung = props => {
    return (
	<div className={props.frat + ' well'}>
  	  <h3>
	    {props.title}
	  </h3>
	  <table className="table">
	    <tbody>
	      {createBelegungen(props.aemter)}
	    </tbody>
	  </table>
	</div>
    );
};

var isVorstand = amt => _.contains(['X', 'XX', 'XXX', 'VX', 'FM'], amt);

var Semester = props => {
    return (
	<div className="semester">
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenvorstand" aemter={props.belegungen.filter(b => b.frat == 'alania' && isVorstand(b.amt))} frat="aln" />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenvorstand" aemter={props.belegungen.filter(b => b.frat == 'laetitia' && isVorstand(b.amt))} frat="lae" />
	    </div>
	  </div>
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenämter" aemter={props.belegungen.filter(b => b.frat == 'alania' && !isVorstand(b.amt))} frat="aln" />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenämter" aemter={props.belegungen.filter(b => b.frat == 'laetitia' && !isVorstand(b.amt))} frat="lae" />
	    </div>
	  </div>
	  <Aemteraufstellung title="Hausämter" aemter={props.belegungen.filter(b => b.frat == 'haus')} frat="haus" />
	</div>
    );
};

var serverURL = "http://localhost:3000/";

var createSemesterOption = semester => <option value={semester}>{semester}</option>;

export var Semesterauswahl = React.createClass({
    getInitialState() {
	return {
	    belegungen: [],
	    semester: "SS16",
	    availableSemester: []
	};
    },
    requestBelegungen(semester) {
	this.serverRequest = $.get(serverURL + "belegungen?semester=" + semester, (result => {
	    this.setState({
		belegungen: result,
		semester: semester
	    });
	}));
    },
    componentDidMount() {
	this.requestBelegungen(this.state.semester);
	this.semesterRequest = $.get(serverURL + "semester", (result => {
	    this.setState({
		availableSemester: result
	    });
	}));
	$("#semesterform").submit(e => {
	    this.requestBelegungen($("#semesterformval").val());
	    e.preventDefault();
	});
    },
    componentWillUnmount() {
	this.serverRequest.abort();
	this.semesterRequest.abort();
    },
    render() {
	return (
	    <div>
	      <nav className="navbar navbar-default">
		<form className="navbar-form navbar-left" role="search" id="semesterform">
		  <div className="form-group">
		    <select defaultValue={this.state.semester} id="semesterformval">
		      {this.state.availableSemester.map(createSemesterOption)}
		    </select>
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
