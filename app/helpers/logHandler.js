'use strict';

const winston = require('winston');
const chalk = require('chalk');
const {printf} = winston.format;

// 로그 출력 포맷 지정
const myFormat = printf(info => {
	let time;
	if (process.env.NODE_ENV === 'dev')
		time = chalk.grey(info.timestamp);
	return `${time}--${info.level}: ${info.message}`
});
// winston NODE_ENV에 따른 다른 로그 출력 설정
/*
if(process.env.NODE_ENV === 'prod') {
	ConsoleTransport.level = 'info';
} else if(process.env.NODE_ENV === 'dev') {

}
*/

// logger를 전역 변수로 지정
global.logger = winston.createLogger({
	transports: [
		/*
		new winston.transports.File({
			level: 'info',
			filename: './logs/all-logs.log',
			handleExceptions: true,
			json: true,
			maxsize: 5242880, //5MB
			maxFiles: 5,
			colorize: false
		}),
		*/
		new winston.transports.Console({
			level: 'debug',
			timestamp: true,
			showLevel: true,
			json: false,
			colorize: true
		})
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		myFormat
	),
	exitOnError: false
});