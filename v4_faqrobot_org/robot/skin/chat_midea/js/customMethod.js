//过滤标签
function $xss(str, type) {
	//空过滤
	if (!str) {
		return str === 0 ? "0": "";
	}
	switch (type) {
		case "none":
			//过度方案
			return str + "";
		case "html":
			//过滤html字符串中的XSS
			return str.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g,
				function(r) {
					return "&#" + r.charCodeAt(0) + ";";
				}).replace(/ /g, " ").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
		case "htmlEp":
			//过滤DOM节点属性中的XSS
			return str.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g,
				function(r) {
					return "&#" + r.charCodeAt(0) + ";";
				});
		case "url":
			//过滤url
			return escape(str).replace(/\+/g, "%2B");
		case "miniUrl":
			return str.replace(/%/g, "%25");
		case "script":
			return str.replace(/[\\"']/g,
				function(r) {
					return "\\" + r;
				}).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
		case "reg":
			return str.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g,
				function(a) {
					return "\\" + a;
				});
		default:
			return escape(str).replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g,
				function(r) {
					return "&#" + r.charCodeAt(0) + ";";
				}).replace(/ /g, " ").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
	}
}

