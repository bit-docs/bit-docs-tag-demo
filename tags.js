
exports.demo = {
	add: function(  line, curData, scope, objects, currentWrite ) {
		console.log("DOING IT");

		var m = line.match(/^\s*@demo\s*([\w\.\/\-\$]*)\s*([\w]*)/)
		if ( m ) {
			var src = m[1] ? m[1].toLowerCase() : '';
			var heightAttr = m[2].length > 0 ? " data-demo-height='" + m[2] + "'" : '';
			
			

			var cd =  ( curData && curData.length !== 2),
				cw = (currentWrite || "body"),
				html = "<div class='demo_wrapper' data-demo-src='" + src + "'" + heightAttr + "></div>\n";
			
			
			// use curData if it is not an array
			var useCurData = cd && (typeof curData.description === "string") && !curData.body;

			if(useCurData) {
				
				curData.description += html;
			} else {
				this.body += html;
			}
			
		}
	}
};
