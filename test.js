var assert = require("assert"),
	generate = require("bit-docs-generate-html/generate"),
	path = require("path");

var Browser = require("zombie"),
	express = require('express'),
	testee = require('testee');

Browser.localhost('127.0.0.1', 8081);

var open = function(url, callback, done){
	var server = express().use('/', express.static(__dirname + '/')).listen(8081);
	var browser = new Browser();
	browser.visit(url)
		.then(function(){
			callback(browser, function(){
				server.close();
			});
		}).catch(function(e){
			server.close();
			done(e)
		});
};

describe("bit-docs-tag-demo", function(){

	it("basics works", function (done) {
		this.timeout(60000);

		var docMap = Promise.resolve({
			index: {
				name: "index",
				demo: "path/to/demo.html",
				body: "<div class='demo_wrapper' data-demo-src='test/basics/demo.html'></div>\n"
			}
		});

		generate(docMap, {
			html: {
				dependencies: {
					"bit-docs-tag-demo": 'file:' + __dirname
				}
			},
			dest: path.join(__dirname, "temp"),
			parent: "index",
			forceBuild: true,
			debug: true,
			minifyBuild: false
		}).then(function () {

			open("temp/index.html", function (browser, close) {
				browser.assert.success();
				browser.assert.element('section.body');

				// https://github.com/stealjs/steal/issues/1177
				// browser.assert.element('.demo');
				// var doc = browser.window.document;
				// var tabs = doc.getElementsByClassName("tab");
				// assert.equal(tabs.length, 3, "there are 3 tabs");
				// TODO better testing, click on stuff

				close();
				done();
			}, done);

		}, done);
	});

	it.only("client basics work", function(done) {
		this.timeout(60000);

		var docMap = Promise.resolve({
			index: {
				name: "index",
				demo: "path/to/demo.html",
				body: "<div class='demo_wrapper' data-demo-src='../basics/demo.html'></div>\n"
			}
		});

		generate(docMap, {
			html: {
				dependencies: {
					"bit-docs-tag-demo": 'file:' + __dirname,
				}
			},
			dest: path.join(__dirname, "test/resizes/generated-resizes-test"),
			parent: "index",
			forceBuild: true,
			debug: true,
			minifyBuild: false
		}).then(function(){
			testee.test(['test/resizes/resizes-test.html'], 'firefox', {
				reporter: 'Spec'
			}).then(function(results) {
				console.log('123 results');
				console.dir(results);
				console.dir(results[0].tests);
				results.forEach(function(result) {
					assert.ok(result.passed, result.message);
				});
				done();
			}, done);
		}, done);
	});
});