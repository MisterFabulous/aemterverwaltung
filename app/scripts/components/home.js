import React from 'react';
import ReactDOM from 'react-dom';
import ReactWidgets from 'react-widgets';
var Multiselect = ReactWidgets.Multiselect;

import $ from 'jquery';
import _ from 'underscore';

import Fuelux from 'fuelux';
import onClickOutside from 'react-onclickoutside';

var config = require('../../../config');

var capitalizeFirstLetter = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1);

var serverURL = 'http://' + config().host + ':' + config().port + '/';

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
				      "&amt=" + props.amt +
				      "&frat=" + props.frat,
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
	    amt: this.props.amt,
	    frat: this.props.frat,
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
	    {props.amt}
	  </td>
	  <EditablePersons semester={props.semester} amt={props.amt} persons={props.persons} frat={props.frat} />
	</tr>
    );
};

var fullname = person =>
	person.firstname + ' ' + person.lastname;
var createBelegungen = (aemter, persons, semester, frat) =>
	aemter.map(amt => <Amt amt={amt} persons={persons} semester={semester} frat={frat} />);

var Aemteraufstellung = props => {
    return (
	<div className={props.frat + ' well'}>
  	  <h3>
	    {props.title}
	  </h3>
	  <table className="table aemter-table">
	    <tbody>
	      {createBelegungen(props.aemter, props.persons, props.semester, props.frat)}
	    </tbody>
	  </table>
	</div>
    );
};

var frats = ["alania", "laetitia", "haus"];
var sexs = ["male", "female"];
var semesters = ["WS", "SS"];
var vorstand = ['X', 'FM', 'VX', 'XX', 'XXX'];

var isVorstand = amt => _.contains(vorstand, amt);

var Semester = props => {
    return (
	<div className="semester">
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenvorstand" frat="alania" semester={props.name}
				 persons={props.persons.filter(p => p.frat == 'alania')}
				 aemter={vorstand} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenvorstand" frat="laetitia" semester={props.name}
				 persons={props.persons.filter(p => p.frat == 'laetitia')}
				 aemter={vorstand} />
	    </div>
	  </div>
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenämter" frat="alania" semester={props.name}
				 persons={props.persons.filter(p => _.contains(['alania', 'haus'], p.frat))}
		aemter={props.aemter.filter(a => a.frat == 'alania' && !isVorstand(a.name)).map(a => a.name)} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenämter" frat="laetitia" semester={props.name}
				 persons={props.persons.filter(p => _.contains(['laetitia', 'haus'], p.frat))}
				 aemter={props.aemter.filter(a => a.frat == 'laetitia' && !isVorstand(a.name)).map(a => a.name)} />
	    </div>
	  </div>
	  <Aemteraufstellung title="Hausämter" frat="haus" semester={props.name}
			     persons={props.persons}
			     aemter={props.aemter.filter(a => a.frat == 'haus').map(a => a.name)} />
	</div>
    );
};

var request = (query, state, component) =>
	$.get(serverURL + query, (result => {
	    component.setState({
		[state]: result
	    });
	}));

var createOption = name => <option value={name}>{name}</option>;

var AddPersonForm = React.createClass({
    addPerson(event) {
	$.post(serverURL + "add_person", {
	    firstname: event.target.elements[0].value,
	    lastname: event.target.elements[1].value,
	    frat: event.target.elements[2].value,
	    sex: event.target.elements[3].value
	});
	this.props.onPersonAdded();
	event.preventDefault();
    },
    render() {
	return (
	    <form className="form-horizontal" role="form" onSubmit={this.addPerson}>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-firstname">Vorname</label>
		<div className="col-sm-8">
		  <input type="text" className="form-control" id="addperson-firstname" />
		</div>
	      </div>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-lastname">Nachname</label>
		<div className="col-sm-8">
		  <input type="text" className="form-control" id="addperson-lastname" />
		</div>
	      </div>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-frat">Zugehörigkeit</label>
		<div className="col-sm-8">
		  <select className="form-control" id="addperson-frat" defaultValue="alania">
		    {frats.map(createOption)}
		  </select>
		</div>
	      </div>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-sex">Geschlecht</label>
		<div className="col-sm-8">
		  <select name="sex" className="form-control" id="addperson-sex" defaultValue="male">
		    {sexs.map(createOption)}
		  </select>
		</div>
	      </div>
	      <div className="form-group">
		<div className="col-sm-offset-4 col-sm-8">
		  <button type="submit" className="btn btn-default">Person hinzufügen</button>
		</div>
	      </div>
	    </form>
	);
    }
});

var SemesterSwitcher = React.createClass({
    delegateSubmit(event) {
	this.props.onSwitch(event.target.elements[0].value,
			    event.target.elements[1].value);
	event.preventDefault();
    },
    render() {
	return (
	    <form className="navbar-form navbar-left" onSubmit={this.delegateSubmit}>
	      <div className="form-group">
		<select className="form-control" defaultValue={this.props.defaultSemester}>
		  {semesters.map(createOption)}
		</select>
		<input type="number" min="1905" defaultValue={this.props.defaultYear} className="form-control" data-initialize="spinbox" />
	      </div>
	      <button type="submit" className="btn btn-default">Semester wechseln</button>
	    </form>
	);
    }
});

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
    changeSemester(semester, year) {
	this.setState({semester, year});
    },
    render() {
	return (
	    <div>
	      <nav className="navbar navbar-default">
		<div className="container-fluid">
		  <div className="navbar-header">
		    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbarCollapse" aria-expanded="false">
		      <span className="sr-only">Toggle navigation</span>
		      <span className="icon-bar"></span>
		      <span className="icon-bar"></span>
		      <span className="icon-bar"></span>
		    </button>
		    <a className="navbar-brand" href="#">Gipsburg-Aemterverwaltung</a>
		  </div>
		  <div id="navbarCollapse" className="collapse navbar-collapse">
		    <SemesterSwitcher onSwitch={this.changeSemester} defaultSemester={this.state.semester} defaultYear={this.state.year} />
		    <ul className="nav pull-right">
		      <li className="dropdown">
			<a className="dropdown-toggle btn btn-default" href="#" data-toggle="dropdown" role="button">
			  Person hinzufügen <strong className="caret"></strong>
			</a>
			<div className="dropdown-menu dropdown-menu-right big-dropdown-menu">
			  <AddPersonForm onPersonAdded={this.forceUpdate} />
			</div>
		      </li>
		    </ul>
		  </div>
		</div>
	      </nav>
	      <Semester name={this.state.semester + this.state.year} persons={this.state.persons} aemter={this.state.aemter} />
	    </div>
	);
    }
});
