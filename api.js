'use strict';

const driver = require('promise-phantom');
const phantomjs = require('phantomjs-prebuilt');

function init(page, cb) {
    page.evaluate(function () {
        const $ = document.querySelectorAll.bind(document);

        var arr = [];
        while(arr.length < 3) {
            var randomnumber = Math.ceil(Math.random()*8)
            if(arr.indexOf($('.titlenews')[randomnumber].textContent) > -1) continue;
            arr[arr.length] = $('.titlenews')[randomnumber].textContent;
        }
        return {
            news: arr,
            isDone: arr.length > 0
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
