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
		if (!!process.env.npm_config_debug) { browser.debug(); }
		return new Promise(function (resolve, reject) {
			server = server.use('/', express.static(__dirname)).listen(3003, resolve);
			server.on('error', reject);
		});
	});

	describe('temp directory', function () {
		before(function (done) {
			if (!!process.env.npm_config_skipGenerate) { this.skip(); }
			rmrf(temp, done);
		});

		it('is generated', function () {
			this.timeout(60000);

			function demo_wrapper(path) {
				return '<div class="demo_wrapper" data-demo-src="test/basics/' + path + '.html"></div>' + "\n"
			}

			var docMap = Promise.resolve({
				withIds: {
					name: "withIds",
					body: demo_wrapper('demo-with-ids')
				}, withoutIds: {
					name: "withoutIds",
					body: demo_wrapper('demo-without-ids')
				}, withoutJs: {
					name: "withoutJs",
					body: demo_wrapper('demo-without-js')
				}, index: {
					name: "index",
					body: demo_wrapper('demo-with-ids') + demo_wrapper('demo-without-ids') + demo_wrapper('demo-without-js')
				}
			});

			var siteConfig = {
				html: {
					dependencies: {
						"bit-docs-tag-demo": 'file://' + __dirname
					}
				},
				dest: temp,
				debug: !!process.env.npm_config_debug,
				devBuild: !!process.env.npm_config_devBuild,
				parent: "index",
				forceBuild: true,
				minifyBuild: false
			};

			return generate(docMap, siteConfig);
		});
	});

	describe('demo widget', function () {
		function basicsWork() {
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
					browser.assert.element('.tab-content:not([style*="none"])', 'only one tab content is visible');
				});

				it('defaults to demo', function () {
					browser.assert.text('.tab.active', 'Demo', 'Demo is active tab text');
					browser.assert.attribute('.tab.active', 'data-tab', 'demo', 'demo is active data-tab');
					browser.assert.style('[data-for="demo"]', 'display', '', 'demo tab content is visible');
				});
			});

			describe('clicking HTML tab', function () {
				before(function () {
					return browser.click('[data-tab="html"]');
				});

				it('changes tab and content', function () {
					browser.assert.attribute('.tab.active', 'data-tab', 'html', 'html is active data-tab');
					browser.assert.style('[data-for="html"]', 'display', '', 'html tab content is visible');
				});
			});
		}

		describe('with ids', function () {
			before(function () {
				return browser.visit('/temp/withIds.html');
			});

			basicsWork();
		});

		describe('without ids', function () {
			before(function () {
				return browser.visit('/temp/withoutIds.html');
			});

			basicsWork();
		});

		describe('without js', function () {
			before(function () {
				return browser.visit('/temp/withoutJs.html');
			});

			basicsWork();

			describe('JS tab', function () {
				it('is hidden', function () {
					browser.assert.style('[data-tab="js"]', 'display', 'none', 'js tab content is hidden');
				});
			});
		});

		describe('multiple instances', function () {
			before(function () {
				return browser.visit('/temp/index.html');
			});

			it('exist on page', function () {
				browser.assert.success();
				browser.assert.elements('.demo_wrapper', 3, 'three wrappers exists');
				browser.assert.elements('.demo_wrapper .demo', 3, 'three injected into wrappers');
			});

			describe('clicking all HTML tabs', function () {
				before(function () {
					var htmlTabs = browser.queryAll('[data-tab="html"]');
					return Promise.all(htmlTabs.map(function(el) {
						browser.click(el);
					}));
				});

				it('changes tabs and contents', function () {
					browser.assert.attribute('.tab.active', 'data-tab', 'html', 'html is active data-tab');
					browser.assert.style('[data-for="html"]', 'display', '', 'html tab content is visible');
				});
			});
		});
	});

	after(function () {
		browser.destroy();
		server.close();
	});
});