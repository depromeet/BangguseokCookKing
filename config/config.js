'use strict';

// required environment variables
	[
		'NODE_ENV'
	].forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environment variable ${name} is missing`)
	}
});
const config = {};

if(process.env.NODE_ENV === "dev") {
	config.mongodb = {
		"DATABASE": 'Bangguseok',
		"PORT": '27017',
		"HOST": 'localhost'
	};
	config.server = {
		PORT: 3000
	}
} else if(process.env.NODE_ENV === "prod") {
	config.mongodb = {
		"DATABASE": 'Bangguseok',
		"PORT": '27017',
		"HOST": 'localhost'
	};
	config.server = {
		PORT: 80
	}
}

module.exports = config;