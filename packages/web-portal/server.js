const express = require('express')
const compression = require('compression')
const app = express()
const port = 2000;

app.use(compression());
app.use(express.static(__dirname + '/dist'))


const allowedExt = [
	'.js',
	'.ico',
	'.css',
	'.png',
	'.jpg',
	'.woff2',
	'.woff',
	'.ttf',
	'.svg',
  ];

app.use("*", function(req, res) {
	console.log(req.url);
	if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
		res.sendFile(path.resolve(`/dist/${req.url}`));
	} else {
		res.sendFile(__dirname + '/dist/index.html');
	}
	// resp.sendFile(__dirname + '/dist/web-portal/index.html');
});

app.listen(port, '0.0.0.0', function () {
	console.log('Example app listening on port 3000!');
});
