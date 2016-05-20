module.exports = function() {
    return {
	connection: {
	    host: "localhost",
	    port: 3000,
	    mongo: 'mongodb://localhost:27017/aemter'
	},
	names: {
	    orgs: ['alania', 'laetitia', 'haus'],
	    sexs: ['male', 'female'],
	    semesters: ['First half', 'Second half'],
	    vorstand: ['President', 'Vice-President', 'Secretary', 'Treasurer', 'Spokesman'],
	    title: 'Job administration',
	    switch_semester: 'Switch semester',
	    add_person: 'Add person',
	    managements: ['Management of organization 1', 'Management of organization 2'],
	    variings: ['Dynamic jobs of organization 1', 'Dynamic jobs of organization 2'],
	    common: 'Common jobs'
	}

    };
};
