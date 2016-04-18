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
var amtspersonen = (belegungen, amt) => {
    let tmp = _.groupBy(belegungen, 'amt');
    let list = _.has(tmp, amt) ? tmp[amt] : [];
    return list.map(fullname).join(', ');
};
var createBelegungen = (belegungen, aemter) =>
	aemter.map(amt => <Amt description={amt.name} name={amtspersonen(belegungen, amt.name)} />);

var Aemteraufstellung = props => {
    return (
	<div className={props.frat + ' well'}>
  	  <h3>
	    {props.title}
	  </h3>
	  <table className="table">
	    <tbody>
	      {createBelegungen(props.belegungen, props.aemter)}
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
	      <Aemteraufstellung title="Alanenvorstand" frat="aln"
				 aemter={props.aemter.filter(a => a.frat == 'alania' && isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'alania' && isVorstand(b.amt))} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenvorstand" frat="lae"
				 aemter={props.aemter.filter(a => a.frat == 'laetitia' && isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'laetitia' && isVorstand(b.amt))} />
	    </div>
	  </div>
	  <div className="row">
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Alanenämter" frat="aln"
				 aemter={props.aemter.filter(a => a.frat == 'alania' && !isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'alania' && !isVorstand(b.amt))} />
	    </div>
	    <div className="col-sm-6">
	      <Aemteraufstellung title="Laetizenämter" frat="lae"
				 aemter={props.aemter.filter(a => a.frat == 'laetitia' && !isVorstand(a.name))}
				 belegungen={props.belegungen.filter(b => b.frat == 'laetitia' && !isVorstand(b.amt))} />
	    </div>
	  </div>
	  <Aemteraufstellung title="Hausämter" frat="haus"
			     aemter={props.aemter.filter(a => a.frat == 'haus')}
			     belegungen={props.belegungen.filter(b => b.frat == 'haus')} />
	</div>
    );
};

var serverURL = "http://localhost:3000/";

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
    request(query, state) {
	return $.get(serverURL + query, (result => {
	    this.setState({
		[state]: result
	    });
	}));
    },
    componentDidMount() {
	this.belegungsRequest = this.request("belegungen?semester=" + this.state.semester, "belegungen");
	this.aemterRequest = this.request("aemter", "aemter");
	this.semesterRequest = this.request("semester", "availableSemester");
	$("#semesterform").submit(e => {
	    var semester = $("#semesterformval").val();
	    this.setState({semester: semester});
	    this.belegungsRequest = this.request("belegungen?semester=" + this.state.semester, "belegungen");
	    e.preventDefault();
	});
    },
    componentWillUnmount() {
	this.aemterRequest.abort();
	this.belegungsRequest.abort();
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
