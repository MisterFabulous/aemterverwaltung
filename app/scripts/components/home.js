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

var serverURL = 'http://localhost/services/';

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
				      "&org=" + props.org,
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
	    org: this.props.org,
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
	    groupBy={p => capitalizeFirstLetter(p.org)} />
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
	  <EditablePersons semester={props.semester} amt={props.amt} persons={props.persons} org={props.org} />
	</tr>
    );
};

var fullname = person =>
	person.firstname + ' ' + person.lastname;
var createBelegungen = (aemter, persons, semester, org) =>
	aemter.map(amt => <Amt amt={amt} persons={persons} semester={semester} org={org} />);

var Aemteraufstellung = props => {
    return (
	<div className={props.org + ' well'}>
  	  <h3>
	    {props.title}
	  </h3>
	  <table className="table aemter-table">
	    <tbody>
	      {createBelegungen(props.aemter, props.persons, props.semester, props.org)}
	    </tbody>
	  </table>
	</div>
    );
};

var isVorstand = amt => _.contains(config().names.vorstand, amt);

var createManagementColumn = (org, persons, semester) => {
    return (
	<div className="col-sm-6">
	  <Aemteraufstellung title={config().names.managements[org]} org={org} semester={semester} persons={persons} aemter={config().names.vorstand} />
	</div>
    );
};

var createDynamicJobsColumn = (org, persons, semester, aemter) => {
    return (
	<div className="col-sm-6">
	  <Aemteraufstellung title={config().names.variings[org]} org={org} semester={semester} persons={persons}
	    aemter={aemter.filter(a => a.org == org && !isVorstand(a.name)).map(a => a.name)} />
	</div>
    );
};

var Semester = props => {
    if (config().names.orgs.length != 2) {
	throw "Currently only two organizations are supported";
    }
    return (
	<div className="semester">
	  <div className="row">
	    {config().names.orgs.map(org => createManagementColumn(org, props.persons.filter(p => p.org == org), props.name))}
	  </div>
	  <div className="row">
	    {config().names.orgs.map(org => createDynamicJobsColumn(org,
								    props.persons.filter(p => _.contains([org, 'common'], p.org)),
								    props.name,
								    props.aemter))
	    }
	  </div>
	  <Aemteraufstellung title={config().names.common} org="common" semester={props.name}
			     persons={props.persons}
			     aemter={props.aemter.filter(a => a.org == 'common').map(a => a.name)} />
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
	    org: event.target.elements[2].value,
	    sex: event.target.elements[3].value
	});
	this.props.onPersonAdded();
	event.preventDefault();
    },
    render() {
	return (
	    <form className="form-horizontal" role="form" onSubmit={this.addPerson}>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-firstname">{config().names.add_person.firstname}</label>
		<div className="col-sm-8">
		  <input type="text" className="form-control" id="addperson-firstname" />
		</div>
	      </div>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-lastname">{config().names.add_person.lastname}</label>
		<div className="col-sm-8">
		  <input type="text" className="form-control" id="addperson-lastname" />
		</div>
	      </div>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-org">{config().names.add_person.org}</label>
		<div className="col-sm-8">
		  <select className="form-control" id="addperson-org" defaultValue="alania">
		    {config().names.orgs.map(createOption)}
		  </select>
		</div>
	      </div>
	      <div className="form-group">
		<label className="control-label col-sm-4 add-person-label" for="addperson-sex">{config().names.add_person.sex}</label>
		<div className="col-sm-8">
		  <select name="sex" className="form-control" id="addperson-sex" defaultValue="male">
		    {config().names.sexs.map(createOption)}
		  </select>
		</div>
	      </div>
	      <div className="form-group">
		<div className="col-sm-offset-4 col-sm-8">
		  <button type="submit" className="btn btn-default">{config().names.add_person.button}</button>
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
		  {config().names.semesters.map(createOption)}
		</select>
		<input type="number" min="1905" defaultValue={this.props.defaultYear} className="form-control" data-initialize="spinbox" />
	      </div>
	      <button type="submit" className="btn btn-default">{config().names.switch_semester}</button>
	    </form>
	);
    }
});

export var Semesterauswahl = React.createClass({
    getInitialState() {
	return {
	    aemter: [], // name, org
	    persons: [], // firstname, lastname, sex, org
	    semester: config().names.semesters[0],
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
		    <a className="navbar-brand" href="#">{config().names.title}</a>
		  </div>
		  <div id="navbarCollapse" className="collapse navbar-collapse">
		    <SemesterSwitcher onSwitch={this.changeSemester} defaultSemester={this.state.semester} defaultYear={this.state.year} />
		    <ul className="nav pull-right">
		      <li className="dropdown">
			<a className="dropdown-toggle btn btn-default" href="#" data-toggle="dropdown" role="button">
			  {config().names.add_person.button} <strong className="caret"></strong>
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
