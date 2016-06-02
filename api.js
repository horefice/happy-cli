'use strict';
const driver = require('promise-phantom');
const phantomjs = require('phantomjs-prebuilt');

function init(page, cb) {
	page.evaluate(function () {
		const $ = document.querySelectorAll.bind(document);

		return {
			news: [$('.titlenews')[0].textContent,$('.titlenews')[1].textContent,$('.titlenews')[2].textContent],
			isDone: $('.titlenews').length > 0
		};
	})
	.then(result => {
		if (result.isDone) {
			cb(null, result)
			page.close();
		} else {
			setTimeout(init, 100, page, cb);
		}
	})
	.catch(cb);
}

module.exports = cb => {
	driver.create({path: phantomjs.path})
		.then(phantom => phantom.createPage())
		.then(page => page.open('http://www.sunnyskyz.com/good-news').then(() => {
			init(page, cb);
		}))
		.catch(cb);
};
