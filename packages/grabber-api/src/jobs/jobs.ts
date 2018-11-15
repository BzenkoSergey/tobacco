
var express = require('express');
var router = express.Router();
var url = require('url');
var request = require('request');

import { GrabberJob } from '@magz/common';
import { GrabberApi } from '@magz/grabber';

import { SchedulerService } from './../scheduler/scheduler.service';

import { jobs, runned, streams } from './../store';

const schedulerMap = new Map<string, any[]>();

router.get('/image/:host*', function (req, response, next) {
    var proxyurl = url.parse(req.url);
    var path = req.params[0];
    if (!!proxyurl.search) {
        path += proxyurl.search;
	}
	var imageURL = req.params.host + path;
	request.get(imageURL).pipe(response);
});


router.get('/job/scheduler', (req, res) => {
	const l = [];
	schedulerMap.forEach((value, key) => {
		l.push(Array.from(value));
	});
	res.status(200).json(l);
});

router.post('/job/scheduler', (req, res) => {
	res.status(200).json([]);
	new SchedulerService().perform()
		.subscribe(d => {

			// @ts-ignore
			const s = streams.get(d.marketId) || new Map<string, any[]>();
			// @ts-ignore
			s.set(d.data[0], d.data[1]);
			// @ts-ignore
			streams.set(d.marketId, s);

			// @ts-ignore
			const s2 = schedulerMap.get(d.marketId) || new Map<string, any[]>();
			// @ts-ignore
			s2.set(d.data[0], d.data[1]);
			// @ts-ignore
			schedulerMap.set(d.marketId, s2);
	
			console.log(JSON.stringify(d));
		});
});

router.post('/job/:jobId/partially/run', (req, res) => {
	const stream = new Map<string, any[]>();
	new GrabberApi()
		.perform(req.body.config)
		.subscribe(
			d => {
				stream.set(<string>d[0], <any>d[1]);
			},
			err => {
				res.status(400).json([]);
				console.error(err)
			},
			() => {
				res.status(200).json(Array.from(stream));
			}
		);
});

router.post('/job/run', (req, res) => {
	jobs.forEach(job => {
		const jobId = job.id;
		if (runned.get(jobId)) {
			return;
		}
		const stream = streams.get(jobId) || new Map<string, any[]>();
		streams.set(jobId, stream);
		runned.set(jobId, true);
	
		new GrabberApi()
			.perform(job.config)
			.subscribe(
				d => {
					stream.set(<string>d[0], <any>d[1]);
				},
				err => console.error(err),
				() => runned.set(jobId, false)
			);
	});
	res.status(200).json(true);
});



router.post('/job/:jobId', (req, res) => {
	const jobId = req.params.jobId;
	const job = new GrabberJob(req.body);
	job.id = jobId;
	jobs.set(jobId, job);
	res.status(200).json(job);
});

router.post('/job/:jobId/run/parallel', (req, res) => {
	const jobId = req.params.jobId;
	const job = new GrabberJob(req.body);

	console.log(job.config.ignoreLinks);
	const stream = streams.get(jobId) || new Map<string, any[]>();
	streams.set(jobId, stream);
	runned.set(jobId, true);

	new GrabberApi()
		.perform(job.config)
		.subscribe(
			d => {
				stream.set(<string>d[0], <any>d[1]);
			},
			err => console.error(err),
			() => runned.set(jobId, false)
		);

	res.status(200).json(true);
});

router.post('/job/:jobId/run', (req, res) => {
	const jobId = req.params.jobId;
	const job = jobs.get(jobId);
	if (!job || runned.get(jobId)) {
		res.status(200).json(false);
		return;
	}
	const stream = streams.get(jobId) || new Map<string, any[]>();
	streams.set(jobId, stream);
	runned.set(jobId, true);

	new GrabberApi()
		.perform(job.config)
		.subscribe(
			d => {
				stream.set(<string>d[0], <any>d[1]);
			},
			err => console.error(err),
			() => runned.set(jobId, false)
		);

	res.status(200).json(true);
});

router.get('/job/status', (req, res) => {
	const statuses: { id: string, status: boolean }[] = [];
	runned.forEach((value, key) => {
		statuses.push({
			id: key,
			status: value
		});
	});
	res.status(200).json(statuses);
});

router.get('/job/:jobId/stream', (req, res) => {
	const jobId = req.params.jobId;
	const stream = streams.get(jobId);
	if (!stream) {
		res.status(200).json([]);
		return;
	}
	res.status(200).json(Array.from(stream));
});

router.get('/job/stream', (req, res) => {
	const result: { id: string, stream: any }[] = [];
	streams.forEach((value, key) => {
		const stream = value? Array.from(value) : [];
		result.push({
			id: key,
			stream: stream
		});
	});
	res.status(200).json(result);
});

router.get('/job/:jobId/status', (req, res) => {
	const jobId = req.params.jobId;
	const status = runned.get(jobId);
	res.status(200).json(!!status);
});

router.post('/job/:jobId', (req, res) => {
	const jobId = req.params.jobId;
	const job = new GrabberJob(req.body);
	job.id = jobId;
	jobs.set(jobId, job);
	res.status(200).json(job);
});

router.post('/job', (req, res) => {
	const list: GrabberJob[] = [];
	req.body.forEach((d: GrabberJob) => {
		const job = new GrabberJob(req.body);
		jobs.set(job.id, job);
		list.push(job);
	});
	res.status(200).json(list);
});

router.put('/job/:jobId', (req, res) => {
	const jobId = req.params.jobId;
	const job = new GrabberJob(req.body);
	job.id = jobId;
	jobs.set(jobId, job);
	res.status(200).json(job);
});

router.get('/job/:jobId', (req, res) => {
	const jobId = req.params.jobId;
	const job = jobs.get(jobId);
	res.status(200).json(job);
});

router.get('/job', (req, res) => {
	const list: GrabberJob[] = [];
	jobs.forEach(value => {
		list.push(value);
	});
	res.status(200).json(list);
});

export { router };