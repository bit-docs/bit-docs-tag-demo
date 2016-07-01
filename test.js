var assert = require("assert");
var generate = require("bit-docs-generate-html/generate");
var path = require("path");

var Browser = require("zombie"),
	connect = require("connect");


var find = function(browser, property, callback, done){
	var start = new Date();
	var check = function(){
		if(browser.window && browser.window[property]) {
			callback(browser.window[property]);
		} else if(new Date() - start < 2000){
			setTimeout(check, 20);
		} else {
			done("failed to find "+property);
		}
	};
	check();
};
var waitFor = function(browser, checker, callback, done){
	var start = new Date();
	var check = function(){
		if(checker(browser.window)) {
			callback(browser.window);
		} else if(new Date() - start < 2000){
			setTimeout(check, 20);
		} else {
			done(new Error("checker was never true"));
		}
	};
	check();
};


var open = function(url, callback, done){
	var server = connect().use(connect.static(path.join(__dirname))).listen(8081);
	var browser = new Browser();
	browser.visit("http://localhost:8081/"+url)
		.then(function(){
			callback(browser, function(){
				server.close();
			})
		}).catch(function(e){
			server.close();
			done(e)
		});
};

describe("bit-docs-tag-demo", function(){
	it("basics works", function(done){
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
					"bit-docs-tag-demo": __dirname
				}
			},
			dest: path.join(__dirname, "temp"),
			parent: "index",
			forceBuild: true,
			debug: true,
			minifyBuild: false
		}).then(function(){

			open("temp/index.html",function(browser, close){
				waitFor(browser, function(window){
					return window.document.getElementsByClassName("demo").length;
				}, function(){
				var doc = browser.window.document;
				var tabs = doc.getElementsByClassName("tab");

				assert.equal(tabs.length, 3, "there are 3 tabs");

				// TODO better testing, click on stuff

				close();
				done();
				});
			},done);
		});
	});
});
