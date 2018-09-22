import * as cors from 'cors';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { router } from './grabber/grabber';

var app = express();
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors({
	origin: ['http://localhost:4200', 'http://localhost:2020'],
	optionsSuccessStatus: 200,
	credentials: true
}));


app.use(router);

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});