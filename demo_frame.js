var template = '<ul>' +
		'<li class="tab" data-tab="demo">Demo</li>' +
		'<li class="tab" data-tab="html">HTML</li>' +
		'<li class="tab" data-tab="js" style="display:none;">JS</li>' +
	'</ul>' +
	'<div class="tab-content" data-for="demo">' +
		'<iframe></iframe>' +
	'</div>' +
	'<div class="tab-content" data-for="html">' +
		'<pre class="prettyprint"></pre>' +
	'</div>' +
	'<div class="tab-content" data-for="js">' +
		'<pre class="prettyprint lang-js"></pre>' +
	'</div>';

function render(node, docObject){
	var demoDiv = document.createElement("div");
	demoDiv.className = "demo";
	demoDiv.innerHTML = template;
	var demoSrc = (docObject.pathToRoot || "..") + "/" + (node.dataset ? node.dataset.demoSrc : node.getAttribute("data-demo-src"));
	demoDiv.getElementsByTagName("iframe")[0].src = demoSrc;

	node.innerHTML = "";
	node.appendChild(demoDiv);

	return demoDiv;
}


module.exports = function(node){
	var docObject = window.docObject || {};
	render(node, docObject);

	var iframe = node.getElementsByTagName("iframe")[0];
	iframe.addEventListener("load", process);

	function process(){
		resizeIframe();
		
		var demoEl = this.contentDocument.getElementById('demo-html'),
			sourceEl = this.contentDocument.getElementById('demo-source');

		var html = getHTML.call(this, demoEl);
		var js = getJS.call(this, sourceEl);

		var dataForHtml = node.querySelector("[data-for=html] > pre");
		dataForHtml.innerHTML = prettyify(html);

		var dataForJS = node.querySelector("[data-for=js] > pre");
		dataForJS.innerHTML = prettyify(js.replace(/\t/g,"  "));
		show(node.querySelector("[data-tab=js]"));

		tabs();
	}

	function getHTML(demoEl) {
		var html = demoEl ? demoEl.innerHTML : this.contentWindow.DEMO_HTML;

		if(!html) {
			// try to make from body
			var clonedBody = this.contentDocument.body.cloneNode(true);
			var scripts = [].slice.call(clonedBody.getElementsByTagName("script"));
			scripts.forEach(function(script){
				if(!script.type || script.type.indexOf("javascript") === -1) {
					script.parentNode.removeChild(script);
				}
			});
			var styles = [].slice.call(clonedBody.getElementsByTagName("style"));
			styles.forEach(function(style){
				style.parentNode.removeChild(style);
			});
			html = clonedBody.innerHTML;
		}
		return html;
	}

	function getJS(sourceEl){
		var source = sourceEl ? sourceEl.innerHTML : this.contentWindow.DEMO_SOURCE;
		if(!source){
			var scripts = [].slice.call(this.contentDocument.querySelectorAll("script"));
			// get the first one that is JS
			for(var i =0; i < scripts.length; i++){
				if(!scripts[i].type || (scripts[i].type.indexOf("javascript") >= 0 &&
					!scripts[i].src)){
					source =  scripts[i].innerHTML;
					break;
				}
			}
		}
		return source.trim();
	}

	function resizeIframe(){
		var iframeHeight = iframe.contentWindow.document.body.scrollHeight;
		iframe.style.height = Math.min(iframeHeight, 600) + 'px';
		setTimeout(resizeIframe, 1000);
	}

	function show(el) {
		el.style.display = "block";
	}

	function hide(el) {
		el.style.display = "none";
	}

	function tabs() {
		node.querySelector("ul").addEventListener("click", function(ev){
			var el = ev.target;
			if(el.className === "tab") {
				toggle(el.dataset.tab);
			}
		});
		toggle("demo");

		function toggle(tabName) {
			each(".tab", function(el){
				if(el.classList) {
					el.classList.remove("active");
				} else {
					el.className = "tab";
				}

			});

			each(".tab-content", hide);
			each(".tab[data-tab='" + tabName + "']", function(el){
				if(el.classList) {
					el.classList.add("active");
				} else {
					el.className = "tab active";
				}

			});
			each("[data-for='" + tabName + "']", show);
		}

		function each(selector, cb) {
			var tabs = [].slice.call(node.querySelectorAll(selector));
			tabs.forEach(cb);
		}

	}

	function prettyify(txt){
		txt = txt.replace(/</g, '&lt;');
		return typeof prettyPrintOne !== "undefined" ?
			prettyPrintOne(txt) : txt;
	}

};
