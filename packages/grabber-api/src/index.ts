import * as cors from 'cors';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { router } from './jobs/jobs';

var app = express();
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors({
	origin: ['http://localhost:4100', 'http://192.168.0.175:4100'],
	optionsSuccessStatus: 200,
	credentials: true
}));

app.use(router);

setTimeout(() => {
	app.listen(3300, '0.0.0.0', function () {
		console.log('Example app listening on port 3300!');
	});
})