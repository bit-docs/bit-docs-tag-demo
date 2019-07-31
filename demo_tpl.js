// Leaving the content the of the <pre> empty is significant
// <code> element will be appended when processing the code highlighting
// this prevent PrismJS to register "Copy" button for demos at bit-docs-prettify step


module.exports = `
	<ul>
		<li class="tab" data-tab="demo">Demo</li>
		<li class="tab" data-tab="html" style="display:none">HTML</li>
		<li class="tab" data-tab="js" style="display:none;">JS</li>
	</ul>
	<div class="tab-content" data-for="demo">
		<iframe></iframe>
	</div>
	<div class="tab-content" data-for="html">
		<pre class="line-numbers language-html"></pre>
	</div>
	<div class="tab-content" data-for="js">
		<pre class="line-numbers language-js"></pre>
	</div>
`;
