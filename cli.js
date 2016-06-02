#!/usr/bin/env node
'use strict';
/* eslint-disable prefer-template */
const dns = require('dns');
const meow = require('meow');
const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const api = require('./api');

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

let data = {};
const spinner = ora();

const news = () => chalk.cyan('* ' + data.news[0] + '\n* ' + data.news[1] + '\n* ' + data.news[2]);

function exit() {
	logUpdate('\n' + news() + '\n' + chalk.cyan.dim('Source: http://www.sunnyskyz.com/good-news\n'));
	process.exit();
}

setInterval(() => {
	const pre = '\n ' + chalk.gray.dim(spinner.frame()) + chalk.cyan(' Getting lastest happy news!');

	if (!data.isDone) {
		logUpdate(pre + '\n');
		return;
	} else {
		logUpdate('\n' + news() + '\n' + chalk.cyan.dim('Source: http://www.sunnyskyz.com/good-news\n'));
	}
}, 50);

let timeout;

api((err, result) => {
	if (err) {
		throw err;
	}

	data = result;

	// exit after the speed has been the same for 3 sec
	// needed as sometimes `isDone` doens't work for some reason
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		data.isDone = true;
		exit();
	}, 5000);

	if (data.isDone) {
		exit();
	}
});
