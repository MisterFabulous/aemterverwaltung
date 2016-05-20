module.exports = function() {
    return {
	connection: {
	    host: "localhost",
	    port: 3000,
	    mongo: 'mongodb://localhost:27017/aemter'
	},
	names: {
	    orgs: ['alania', 'laetitia'],
	    sexs: ['male', 'female'],
	    semesters: ['First half', 'Second half'],
	    vorstand: ['President', 'Vice-President', 'Secretary', 'Treasurer', 'Spokesman'],
	    title: 'Job administration',
	    switch_semester: 'Switch semester',
	    add_person: 'Add person',
	    managements: {
		'alania': 'Management of organization 1',
		'laetitia': 'Management of organization 2'
	    },
	    variings: {
		'alania': 'Dynamic jobs of organization 1',
		'laetitia': 'Dynamic jobs of organization 2'
	    },
	    common: 'Common jobs'
	}
    };
};
