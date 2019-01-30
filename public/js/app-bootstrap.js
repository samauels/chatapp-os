var c = ['bootstrap.4.1.3.min.css', 'open-iconic-bootstrap.min.css', 'widget.css'];
for (var i in c) {
	var e = document.createElement('link');
	e.rel = 'stylesheet';
	e.href = 'css/' + c[i];
	document.head.appendChild(e);
}
var e = document.createElement('script');
e.src = 'js/app-bundle.js';
document.body.append(e);
