var QUnit = require("steal-qunit");

QUnit.module("bit-docs-tag-demo", {
	beforeEach: function (assert) {
		var iframe = document.createElement('iframe');
		iframe.src = 'generated-resizes-test/index.html';
		QUnit.stop();
		var self = this;
		iframe.onload = function () {
			self.docWindow = this.contentWindow;
			QUnit.start();
		};
		document.getElementById('qunit-fixture').appendChild(iframe);
	}
});

QUnit.test("basics", function () {
	var demo = this.docWindow.document.querySelector('.demo');
	QUnit.equal(demo.querySelectorAll('li.tab').length, 3, "there are three tabs");
	QUnit.equal(demo.querySelectorAll('div.tab-content').length, 3, "there are three tab contents");
});