import React from 'react';
import ReactDOM from 'react-dom';
import InlineEdit from 'react-edit-inline';

import _ from 'underscore';
import $ from 'jquery';

var Amt = (props) => {
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

var fullname = (person) =>
	person.firstname + ' ' + person.lastname;
var belegungsliste = (belegungen) =>
	_.groupBy(belegungen, (belegung) => belegung.amt);
var createBelegungen = (belegungen) =>
	_.values(_.mapObject(belegungsliste(belegungen), (persons,amt) => <Amt description={amt} name={persons.map(fullname).join(', ')} />));

var Aemteraufstellung = (props) => {
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

var isVorstand = (amt) => _.contains(['X', 'XX', 'XXX', 'VX', 'FM'], amt);

var Semester = (props) => {
    return (
	<div className="semester">
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenvorstand" aemter={props.belegungen.filter((b) => b.frat == 'alania' && isVorstand(b.amt))} frat="aln" />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenvorstand" aemter={props.belegungen.filter((b) => b.frat == 'laetitia' && isVorstand(b.amt))} frat="lae" />
	    </div>
	  </div>
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenämter" aemter={props.belegungen.filter((b) => b.frat == 'alania' && !isVorstand(b.amt))} frat="aln" />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenämter" aemter={props.belegungen.filter((b) => b.frat == 'laetitia' && !isVorstand(b.amt))} frat="lae" />
	    </div>
	  </div>
	  <Aemteraufstellung title="Hausämter" aemter={props.belegungen.filter((b) => b.frat == 'haus')} frat="haus" />
	</div>
    );
};

export var Semesterauswahl = React.createClass({
    getInitialState() {
	return {
	    belegungen: [],
	    semester: "SS16"
	};
    },
    requestSemesterData(semester) {
	this.serverRequest = $.get("http://localhost:3000/belegungen?semester=" + semester, (result => {
	    this.setState({
		belegungen: result,
		semester: semester
	    });
	}));
    },
    componentDidMount() {
	this.requestSemesterData(this.state.semester);
	$("#semesterform").submit(e => {
	    this.requestSemesterData($("#semesterformval").val());
	    e.preventDefault();
	});
    },
    componentWillUnmount() {
	this.serverRequest.abort();
    },
    render() {
	return (
	    <div>
	      <nav className="navbar navbar-default">
		<form className="navbar-form navbar-left" role="search" id="semesterform">
		  <div className="form-group">
		    <input type="text" className="form-control" placeholder="Search" id="semesterformval" />
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
