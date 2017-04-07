var tags = require("./tags");

/**
 * @module {function} bit-docs-tag-demo
 * @parent plugins
 *
 * @description Provides an `@demo` tag for embedding HTML, CSS, and JS in an iframe.
 *
 * @body
 *
 * TBD
 */
module.exports = function(bitDocs){
	var pkg = require("./package.json");
	var deps = {};

	deps[pkg.name] = pkg.version;

	bitDocs.register("html", {
		dependencies: deps
	});

	bitDocs.register("tags", tags);
};
