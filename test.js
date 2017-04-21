var assert = require("assert");
var generate = require("bit-docs-generate-html/generate");
var path = require("path");

var Browser = require("zombie"),
	connect = require("connect"),
	http = require('http'),
	serveStatic = require('serve-static');

var open = function(url, callback, done){
	var app = connect().use(serveStatic(__dirname));
	var server = http.createServer(app).listen(8081, "127.0.0.1");
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

Browser.localhost('127.0.0.1', 8081);

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
				//browser.on('loaded', function(document) {
					browser.assert.success();
					browser.assert.element('section.body');
					browser.assert.element('.demo');

					var doc = browser.window.document;
					var tabs = doc.getElementsByClassName("tab");

					assert.equal(tabs.length, 3, "there are 3 tabs");

					// TODO better testing, click on stuff

					close();
					done();
				//});
			}, done);

		}, done);
	});

	it("client basics work", function(done) {
		this.timeout(120000);

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
			done();
			// testee("generated-resizes-test.html").then(function(results) {
			// 	results.forEach(function(result) {
			// 		asset.ok(result.passed, result.message);
			// 	});
			// });
		}, function(err) {
			done(err);
		});
	});
});
