import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';
import $ from 'jquery';

var Amt = React.createClass({
    getInitialState() {
	return {
	    editing: false,
	    persons: []
	};
    },
    componentDidMount() {
	this.personsRequest = request("belegungen" +
				      "?semester=" + this.props.semester +
				      "&amt=" + this.props.amt.name +
				      "&frat=" + this.props.amt.frat,
				      "persons", this);
    },
    componentWillUnmount() {
	this.personsRequest.abort();
    },
    beginEditing() {
	this.setState({editing: true});
    },
    render () {
	return (
	    <tr>
	      <td>
		{this.props.amt.name}
	      </td>
	      <td onclick="this.beginEditing">
		{(() => {
		    if (this.state.editing) {
			return null; 
		    } else {
			return <div onClick={this.beginEditing}>{this.state.persons.map(fullname).join(', ')}</div>;
		    }
		})()}
	      </td>
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
var createBelegungen = (aemter, semester) =>
	aemter.map(amt => <Amt amt={amt} semester={semester} />);

var Aemteraufstellung = props => {
    return (
	<div className={props.frat + ' well'}>
  	  <h3>
	    {props.title}
	  </h3>
	  <table className="table">
	    <tbody>
	      {createBelegungen(props.aemter, props.semester)}
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
				 aemter={props.aemter.filter(a => a.frat == 'alania' && isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'alania' && isVorstand(b.amt))} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenvorstand" frat="laetitia" semester={props.name}
				 aemter={props.aemter.filter(a => a.frat == 'laetitia' && isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'laetitia' && isVorstand(b.amt))} />
	    </div>
	  </div>
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenämter" frat="alania" semester={props.name}
				 aemter={props.aemter.filter(a => a.frat == 'alania' && !isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'alania' && !isVorstand(b.amt))} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenämter" frat="laetitia" semester={props.name}
				 aemter={props.aemter.filter(a => a.frat == 'laetitia' && !isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'laetitia' && !isVorstand(b.amt))} />
	    </div>
	  </div>
	  <Aemteraufstellung title="Hausämter" frat="haus" semester={props.name}
			     aemter={props.aemter.filter(a => a.frat == 'haus')}
			     belegungen={props.belegungen.filter(b => b.frat == 'haus')} />
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

var createSemesterOption = semester => <option value={semester}>{semester}</option>;

export var Semesterauswahl = React.createClass({
    getInitialState() {
	return {
	    aemter: [],
	    belegungen: [],
	    semester: "SS16",
	    availableSemester: []
	};
    },
    componentDidMount() {
	this.aemterRequest = request("aemter", "aemter", this);
	this.semesterRequest = request("semester", "availableSemester", this);
	$("#semesterform").submit(e => {
	    var semester = $("#semesterformval").val();
	    this.setState({semester: semester});
	    e.preventDefault();
	});
    },
    componentWillUnmount() {
	this.aemterRequest.abort();
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
	      <Semester name={this.state.semester} belegungen={this.state.belegungen} aemter={this.state.aemter} />
	      </div>
	);
    }
});
