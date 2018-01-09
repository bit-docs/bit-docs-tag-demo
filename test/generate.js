var path = require("path");
var generate = require("bit-docs-generate-html/generate");

function makeWrapper(path) {
	return (
		'<div class="demo_wrapper" data-demo-src="demos/' +
		path +
		'.html"></div>' +
		"\n"
	);
}

function allDemos() {
	return [
		"demo-with-ids",
		"demo-without-ids",
		"demo-without-js",
		"demo-complex"
	]
		.map(function(demo) {
			return "<h2>" + demo + "</h2>" + makeWrapper(demo);
		})
		.join("<br>");
}

var docMap = Promise.resolve({
	withIds: {
		name: "withIds",
		body: makeWrapper("demo-with-ids")
	},
	withoutIds: {
		name: "withoutIds",
		body: makeWrapper("demo-without-ids")
	},
	withoutJs: {
		name: "withoutJs",
		body: makeWrapper("demo-without-js")
	},
	complex: {
		name: "complex",
		body: makeWrapper("demo-complex")
	},
	index: {
		name: "index",
		body: allDemos()
	}
});

var siteConfig = {
	html: {
		dependencies: {
			"bit-docs-tag-demo": "file://" + path.join(__dirname, "..")
		}
	},
	dest: path.join(__dirname, "temp"),
	debug: !!process.env.npm_config_debug,
	devBuild: !!process.env.npm_config_devBuild,
	parent: "index",
	forceBuild: true,
	minifyBuild: false
};

generate(docMap, siteConfig)
	.then(function() {
		console.log("DONE!");
	})
	.catch(function(e) {
		console.log("FAILED: \n", e);
	});
