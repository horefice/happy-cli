'use strict';
const api = require('./api');
const chalk = require('chalk');
const dns = require('dns');
const logUpdate = require('log-update');
const meow = require('meow');
const ora = require('ora');

// help
meow(`
	Usage
	  $ happy
`);

// check connection
dns.lookup('fast.com', err => {
	if (err && err.code === 'ENOTFOUND') {
		console.log(chalk.red('\n Please check you internet connection.\n'));
		process.exit(1);
	}
});

// variables and functions
let data = {};
const spinner = ora();

const news = () => chalk.cyan('* ' + data.news[0] + '\n* ' + data.news[1] + '\n* ' + data.news[2]);

function exit() {
	logUpdate('\n' + news() + '\n' + chalk.cyan.dim('Source: http://www.sunnyskyz.com/good-news\n'));
	process.exit();
}

// update value
setInterval(() => {
	const pre = '\n ' + chalk.gray.dim(spinner.frame()) + chalk.cyan(' Getting latest happy news!');

	if (!data.isDone) {
		logUpdate(pre + '\n');
		return;
	} else {
		exit();
	}
}, 100);

// api
api((err, result) => {
	if (err) {
		throw err;
	}

	data = result;

	if (data.isDone) {
		exit();
	}
});
