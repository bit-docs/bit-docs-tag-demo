var QUnit = require("steal-qunit");

QUnit.module("bit-docs-tag-demo", {
  beforeEach: function( assert ) {
    var iframe = document.createElement('iframe');
	iframe.src = 'generated-resizes-test/index.html';
	QUnit.stop();
    var self = this;
	iframe.onload = function() {
		self.docWindow = this.contentWindow;
		QUnit.start();
	};
	document.getElementById('qunit-fixture').appendChild(iframe);
  }
});

QUnit.test("basics", function(assert){
	var demo = this.docWindow.document.querySelector('.demo');
	assert.equal( demo.querySelectorAll('li').length, 3, "there are three tabs" );
});