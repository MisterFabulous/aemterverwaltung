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

var createAemter = (hausaemter) =>
    _.mapObject(hausaemter, (persons,amt) => <Amt description={amt} name={_.flatten([persons]).join(', ')} />);

var Aemteraufstellung = React.createClass({
    render() {
	return (
	    <div className={"panel panel-default " + this.props.frat}>
  	      <div className="panel-heading">
		{this.props.title}
	      </div>
	      <table className="table">
		{createAemter(this.props.aemter)}
	      </table>
	    </div>
	);
    }
});

export var Semester = React.createClass({
    getInitialState() {
	return {
	    semester: {
		name: '',
		alania: {
		    vorstand: {
			X: '',
			FM: '',
			VX: '',
			XX: '',
			XXX: ''
		    },
		    klein: {
			Vereinsgericht: [],
			DCA: []
		    }
		},
		laetitia: {
		    vorstand: {
			X: '',
			FM: '',
			VX: '',
			XX: '',
			XXX: ''
		    },
		    klein: {
			Homepage: []
		    }
		},
		haus: {
		    Bier: [],
		    BA: []
		}
	    }
	};
    },
    componentDidMount() {
	this.serverRequest = $.get("http://localhost:3000/semester?name=" + this.props.name, (result) => {
	    this.setState({semester: result});
	}.bind(this));
    },
    componentWillUnmount() {
	this.serverRequest.abort();
    },
    render() {
	return (
	    <div className="panel panel-default semester">
	      <div className="panel-heading">{this.state.semester.name}</div>
	      <div className="panel-body">
		<div className="row">
		  <div className="col-xs-6">
		    <Aemteraufstellung title="Alanenvorstand" aemter={this.state.semester.alania.vorstand} frat="aln" />
		    <Aemteraufstellung title="Alanenämter" aemter={this.state.semester.alania.klein} frat="aln" />
		  </div>
		  <div className="col-xs-6">
		    <Aemteraufstellung title="Laetizenvorstand" aemter={this.state.semester.laetitia.vorstand} frat="lae" />
		    <Aemteraufstellung title="Laetizenämter" aemter={this.state.semester.laetitia.klein} frat="lae" />
		  </div>
		</div>
		<Aemteraufstellung title="Hausämter" aemter={this.state.semester.haus} frat="haus" />
	      </div>
	    </div>
	);
    }
});
