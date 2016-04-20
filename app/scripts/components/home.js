import React from 'react';
import ReactDOM from 'react-dom';
import Multiselect from 'react-widgets/lib/Multiselect';

import _ from 'underscore';
import $ from 'jquery';

var capitalizeFirstLetter = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1);

var Amt = React.createClass({
    getInitialState() {
	return {
	    editing: false,
	    persons: [] // Selected persons for this Amt
	};
    },
    requestPersons(props) {
	this.personsRequest = request("belegungen" +
				      "?semester=" + props.semester +
				      "&amt=" + props.amt.name +
				      "&frat=" + props.amt.frat,
				      "persons", this);
    },
    componentDidMount() {
	this.requestPersons(this.props);
    },
    componentWillReceiveProps(newProps) {
	this.requestPersons(newProps);
    },
    componentWillUnmount() {
	this.personsRequest.abort();
    },
    beginEditing() {
	this.setState({editing: true});
    },
    stopEditing(event) {
	this.setState({
	    editing: false
	});
	$.post(serverURL + "update_belegungen", {
	    semester: this.props.semester,
	    amt: this.props.amt.name,
	    frat: this.props.amt.frat,
	    persons: this.state.persons.map(p => {return {firstname: p.firstname, lastname: p.lastname};})
	});
    },
    render () {
	return (
	    <tr>
	      <td style={{width: "20%"}}>
		{this.props.amt.name}
	      </td>
	      {(() => {
		  if (this.state.editing) {
		      return <td>
			  <Multiselect onBlur={this.stopEditing}
					   onChange={persons => this.setState({persons})}
					   defaultValue={this.state.persons}
					   data={this.props.persons}
					   textField={fullname}
					   groupBy={p => capitalizeFirstLetter(p.frat)} />
			  </td>; 
		  } else {
		      return <td onClick={this.beginEditing}>{this.state.persons.map(fullname).join(', ')}</td>;
		  }
	      })()}
	    </tr>
	);
    }
});

var fullname = person =>
	person.firstname + ' ' + person.lastname;
var amtspersonen = (belegungen, amt) => {
    let tmp = _.groupBy(belegungen, 'amt');
    let list = _.has(tmp, amt) ? tmp[amt] : [];
    return list.map(fullname).join(', ');
};
var createBelegungen = (aemter, persons, semester) =>
	aemter.map(amt => <Amt amt={amt} persons={persons} semester={semester} />);

var Aemteraufstellung = props => {
    return (
	<div className={props.frat + ' well'}>
  	  <h3>
	    {props.title}
	  </h3>
	  <table className="table aemter-table">
	    <tbody>
	      {createBelegungen(props.aemter, props.persons, props.semester)}
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
	      <Aemteraufstellung title="Alanenvorstand" frat="alania" semester={props.name}
				 persons={props.persons.filter(p => p.frat == 'alania')}
				 aemter={props.aemter.filter(a => a.frat == 'alania' && isVorstand(a.name))} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenvorstand" frat="laetitia" semester={props.name}
				 persons={props.persons.filter(p => p.frat == 'laetitia')}
				 aemter={props.aemter.filter(a => a.frat == 'laetitia' && isVorstand(a.name))} />
	    </div>
	  </div>
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenämter" frat="alania" semester={props.name}
				 persons={props.persons.filter(p => _.contains(['alania', 'haus'], p.frat))}
				 aemter={props.aemter.filter(a => a.frat == 'alania' && !isVorstand(a.name))} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenämter" frat="laetitia" semester={props.name}
				 persons={props.persons.filter(p => _.contains(['laetitia', 'haus'], p.frat))}
				 aemter={props.aemter.filter(a => a.frat == 'laetitia' && !isVorstand(a.name))} />
	    </div>
	  </div>
	  <Aemteraufstellung title="Hausämter" frat="haus" semester={props.name}
			     persons={props.persons}
			     aemter={props.aemter.filter(a => a.frat == 'haus')} />
	</div>
    );
};

var serverURL = "http://localhost:3000/";
var request = (query, state, component) =>
	$.get(serverURL + query, (result => {
	    component.setState({
		[state]: result
	    });
	}));

export var Semesterauswahl = React.createClass({
    getInitialState() {
	return {
	    aemter: [], // name, frat
	    persons: [], // firstname, lastname, sex, frat
	    semester: "SS16",
	    availableSemester: []
	};
    },
    componentDidMount() {
	this.aemterRequest = request("aemter", "aemter", this);
	this.semesterRequest = request("semester", "availableSemester", this);
	this.personsRequest = request("persons", "persons", this);
    },
    componentWillUnmount() {
	this.aemterRequest.abort();
	this.semesterRequest.abort();
	this.personsRequest.abort();
    },
    createSemesterOption(semester) {
	return <option value={semester}>{semester}</option>;
    },
    changeSemester(event) {
	this.setState({semester: event.target.value});
	event.preventDefault();
    },
    render() {
	return (
	    <div>
	      <nav className="navbar navbar-default">
		<form className="navbar-form navbar-left" role="search">
		  <div className="form-group">
		    <select defaultValue={this.state.semester} onChange={this.changeSemester}>
		      {this.state.availableSemester.map(this.createSemesterOption)}
		    </select>
		  </div>
		</form>
	      </nav>
	      <Semester name={this.state.semester} persons={this.state.persons} aemter={this.state.aemter} />
	      </div>
	);
    }
});
