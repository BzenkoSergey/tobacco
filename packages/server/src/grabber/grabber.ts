
var express = require('express');
var router = express.Router();

import { GrabberTransform, GrabberInputDto, GrabberMappingAttributeType } from '@magz/common';
import { GrabberApi } from '@magz/grabber';

const runned = new Map<string, boolean>();
const map = new Map<string, Map<string, any[]>>();

router.get('/grabber/:host', (req, res, next) => {
	const m = map.get(encodeURIComponent(req.params.host));

	if (!m) {
		res.status(200).json([]);
		return;
	}

	res.status(200).json(Array.from(m));
});

router.get('/grabber/status/:host', (req, res, next) => {
	const m = runned.get(encodeURIComponent(req.params.host));

	res.status(200).json(!!m);
});

router.post('/grabber', (req, res, next) => {
	req.setTimeout(500000);
	const result = [];
	const host = encodeURIComponent(req.body.host);
	const m = map.get(host) || new Map<string, any[]>();
	map.set(host, m);

	console.log(host);
	runned.set(host, true);
	new GrabberApi()
		.perform(req.body)
		.subscribe(
			d => {
				// console.log('next =>');
				m.set(<string>d[0], <any>d[1]);
				result.push(d);
			},
			err => console.error(err),
			() => {
				runned.set(host, false);
				res.status(200).json(result);
				console.log('/////////================');
				console.log('/////////================');
				console.log('/////////================');
				console.log('/////////================');
				console.log('complete', result.length);
				console.log('/////////================');
				console.log('/////////================');
				console.log('/////////================');
				console.log('/////////================');
			}
		);
});

export { router };

