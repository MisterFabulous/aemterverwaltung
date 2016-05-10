import React from 'react';
import ReactDOM from 'react-dom';
import ReactWidgets from 'react-widgets';
var Multiselect = ReactWidgets.Multiselect;
import Fuelux from 'fuelux';
import onClickOutside from 'react-onclickoutside';

import _ from 'underscore';
import $ from 'jquery';

var capitalizeFirstLetter = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1);

var EditablePersons = onClickOutside(React.createClass({
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
    handleClickOutside(event) {
	if (this.state.editing) {
	    this.stopEditing(event);
	}
    },
    render () {
	if (this.state.editing) {
	    return <td>
		<Multiselect
	    ref={c => {if(c != null) c.focus();}}
	    onBlur={this.stopEditing}
	    onChange={persons => this.setState({persons})}
	    defaultValue={this.state.persons}
	    data={this.props.persons}
	    textField={fullname}
	    groupBy={p => capitalizeFirstLetter(p.frat)} />
		</td>;
	} else {
	    return <td onClick={this.beginEditing}>
		{this.state.persons.map(fullname).join(', ')}
	    </td>;
	}
    }
}));

var Amt = props => {
    return (
	<tr>
	  <td style={{width: "20%"}}>
	    {props.amt.name}
	  </td>
	  <EditablePersons semester={props.semester} amt={props.amt} persons={props.persons} />
	</tr>
    );
};

var fullname = person =>
	person.firstname + ' ' + person.lastname;
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
	    semester: "SS",
	    year: new Date().getFullYear()
	};
    },
    componentDidMount() {
	this.aemterRequest = request("aemter", "aemter", this);
	this.personsRequest = request("persons", "persons", this);
    },
    componentWillUnmount() {
	this.aemterRequest.abort();
	this.personsRequest.abort();
    },
    createSemesterOption(semester) {
	return <option value={semester}>{semester}</option>;
    },
    changeSemester(event) {
	this.setState({
	    semester: event.target.elements[0].value,
	    year: event.target.elements[1].value
	});
	event.preventDefault();
    },
    render() {
	return (
	    <div>
	      <nav className="navbar navbar-default">
		<div className="container-fluid">
		  <div className="navbar-header">
		    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
		      <span className="sr-only">Toggle navigation</span>
		    </button>
		    <a className="navbar-brand" href="#">Gipsburg-Aemterverwaltung</a>
		  </div>
		  <div className="collapse navbar-collapse">
		    <form className="navbar-form navbar-left" role="search" onSubmit={this.changeSemester}>
		      <div className="form-group">
			<select className="form-control" defaultValue={this.state.semester}>
			  {["WS", "SS"].map(this.createSemesterOption)}
			</select>
			<input type="number" min="1905" defaultValue={this.state.year} className="form-control" data-initialize="spinbox" />
		      </div>
		      <button type="submit" className="btn btn-default">Switch semester</button>
		    </form>
		  </div>
		</div>
	      </nav>
	      <Semester name={this.state.semester + this.state.year} persons={this.state.persons} aemter={this.state.aemter} />
	    </div>
	);
    }
});
