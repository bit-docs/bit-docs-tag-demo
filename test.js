var path = require('path'),
	rmrf = require('rimraf'),
	assert = require('assert'),
	Browser = require('zombie'),
	express = require('express'),
	generate = require('bit-docs-generate-html/generate');

Browser.localhost('*.example.com', 3003);

describe('bit-docs-tag-demo', function () {
	var server = express(),
		browser = new Browser(),
		temp = path.join(__dirname, 'temp');

	before(function () {
		return new Promise(function (resolve, reject) {
			server = server.use('/', express.static(__dirname)).listen(3003, resolve);
			server.on('error', reject);
		});
	});

	describe('temp directory', function () {
		before(function (done) {
			if (process.env.npm_config_generate == false) { this.skip(); }
			rmrf(temp, done);
		});

		it('is generated', function () {
			this.timeout(60000);

			var docMap = Promise.resolve({
				index: {
					name: "index",
					body: "<div class='demo_wrapper' data-demo-src='test/basics/demo.html'></div>\n"
				}
			});

			var siteConfig = {
				html: {
					dependencies: {
						"bit-docs-tag-demo": 'file://' + __dirname
					}
				},
				dest: temp,
				debug: process.env.npm_config_debug,
				devBuild: process.env.npm_config_devBuild,
				parent: "index",
				forceBuild: true,
				minifyBuild: false
			};

			return generate(docMap, siteConfig);
		});
	});

	describe('demo widget', function () {
		before(function () {
			return browser.visit('/temp/index.html');
		});

		it('exists on page', function () {
			browser.assert.success();
			browser.assert.element('.demo_wrapper', 'wrapper exists');
			browser.assert.element('.demo_wrapper .demo', 'injected into wrapper');
		});

		describe('tabs and contents', function () {
			it('has three', function () {
				browser.assert.elements('.tab', 3, 'there are three tabs');
				browser.assert.elements('.tab-content', 3, 'there are three tab contents');
			});

			it('only one active', function () {
				browser.assert.element('.tab.active', 'only one tab is active');
				browser.assert.element('.tab-content[style*="block"]', 'only one tab content is visible');
			});

			it('defaults to demo', function () {
				browser.assert.text('.tab.active', 'Demo', 'Demo is active tab text');
				browser.assert.attribute('.tab.active', 'data-tab', 'demo', 'demo is active data-tab');
				browser.assert.style('[data-for="demo"]', 'display', 'block', 'demo tab content is visible');
			});
		});

		describe('clicking HTML tab', function () {
			before(function () {
				return browser.click('[data-tab="html"]');
			});

			it('changes active tab and content', function () {
				browser.assert.attribute('.tab.active', 'data-tab', 'html', 'html is active data-tab');
				browser.assert.style('[data-for="html"]', 'display', 'block', 'html tab content is visible');
			});
		});
	});

	after(function () {
		browser.destroy();
		server.close();
	});
});

	// it.only("client basics work", function(done) {
	// 	this.timeout(60000);

	// 	var docMap = Promise.resolve({
	// 		index: {
	// 			name: "index",
	// 			demo: "path/to/demo.html",
	// 			body: "<div class='demo_wrapper' data-demo-src='../basics/demo.html'></div>\n"
	// 		}
	// 	});

	// 	generate(docMap, {
	// 		html: {
	// 			dependencies: {
	// 				"bit-docs-tag-demo": 'file:' + __dirname,
	// 			}
	// 		},
	// 		dest: path.join(__dirname, "test/resizes/generated-resizes-test"),
	// 		parent: "index",
	// 		forceBuild: true,
	// 		debug: true,
	// 		minifyBuild: false
	// 	}).then(function(){
	// 		testee.test(['test/resizes/resizes-test.html'], 'firefox', {
	// 			reporter: 'Spec'
	// 		}).then(function(results) {
	// 			console.log('123 results');
	// 			console.dir(results);
	// 			console.dir(results[0].tests);
	// 			results.forEach(function(result) {
	// 				assert.ok(result.passed, result.message);
	// 			});
	// 			done();
	// 		}, done);
	// 	}, done);
	// });