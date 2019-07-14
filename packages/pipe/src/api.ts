import * as cors from 'cors';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as compression from 'compression';
import * as request from 'request';
import * as url from 'url';
var cluster = require('express-cluster');
import { mergeMap } from 'rxjs/operators';

import { SnapshotPipesCreator3 } from './core/pipe/creator/snapshot-pipes.creator3';
import { Pipe } from './core/pipe/pipe';
import { DI } from './core/di';

import { ObjectId } from 'mongodb';
import { MongoDb } from './core/trash/db';

import { ProcessesJob } from './processes';

function add (d: any, f: any) {}
// debugger;
cluster(function(worker) {

	var app = express();

	app.use(bodyParser.text({limit: '50mb'}));
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	app.use(methodOverride('X-HTTP-Method-Override'));
	app.use(cors({
		origin: ['http://localhost:4100', 'http://localhost:4200', 'http://localhost:4220', 'http://192.168.0.175:4100', 'http://192.168.0.175:4200', 'http://192.168.0.175:4220', 'http://192.168.0.169:4220'],
		optionsSuccessStatus: 200,
		credentials: true
	}));
	app.use(compression());

	app.get('/active/:schemeId', function (req, res) {
		const schemeId = req.params.schemeId;
		console.log(schemeId, '!!!!');
		res.send([]);
	});

	app.get('/active/:schemeId/:processId', function (req, res) {
		const schemeId = req.params.schemeId;
		const processId = req.params.processId;
		res.send(null);
	});

	app.get('/pp', function (req, res) {
		const inst = new ProcessesJob();
		inst.run(req.query).subscribe(d => {
			res.send(d);
		})
	});
	
	app.get('/process/:processId/paths/:paths', function (req, res) {
		const processId = req.params.processId;
		const paths = req.params.paths.split(',');

		const mongoDb = new MongoDb('scheme-processes', true);
			mongoDb
				.findOne({
					_id: ObjectId(processId)
				})
				.pipe(
					mergeMap(snapshot => {
						const pipe = new Pipe(snapshot, false)
							.setSchemeProcessId(snapshot._id ? snapshot._id.toString() : undefined)
							.setRunParts(paths)
							.setDI(new DI());

						return pipe.run(snapshot.input);
					})
				)
				.subscribe(
					d => {
						// console.log(d);
					},
					e => {
						console.log(e);
						res.status(400).send(e);
					},
					() => {
						res.send();
						// console.log('complete');
					}
				);
	});

	app.get('/process/:processId', function (req, res) {
		const processId = req.params.processId;
		const mongoDb = new MongoDb('scheme-processes', true);
			mongoDb
				.findOne({
					_id: ObjectId(processId)
				})
				.pipe(
					mergeMap(snapshot => {
						const pipe = new Pipe(snapshot, false)
							.resetStatus()
							.setSchemeProcessId(snapshot._id ? snapshot._id.toString() : undefined)
							.setDI(new DI());
						const clone = pipe.getScheme();

						return mongoDb
							.updateOne(
								{
									_id: ObjectId(processId)
								},
								{
									$set: clone
								}
							)
							.pipe(
								mergeMap(() => {
									return pipe.run(snapshot.input);
								})
							);
					})
				)
				.subscribe(
					d => {
						console.log('NEXT');
					},
					e => {
						console.error(e);

						console.log('ERROR');
						res.status(400).send(false);
					},
					() => {
						console.log('COMPLETE');
						res.send('')
					}
				);
	});

	app.post('/scheme/:schemeId/options', function (req, res) {
		const schemeId = req.params.schemeId;
		const creator = new SnapshotPipesCreator3(schemeId);
		let body: any = {};
		if (typeof req.body === 'object') {
			Object.keys(req.body)
				.filter(prop => prop !== 'modes')
				.forEach(prop => {
					body[prop] = req.body[prop];
				});
		} else {
			body = req.body;
		}

		let processId: string;
		creator.run(req.body && req.body.modes)
			.pipe(
				mergeMap(snapshot => {
					const pipe = new Pipe(snapshot, true)
						.setSchemeProcessId(snapshot._id ? snapshot._id.toString() : undefined)
						.setDI(new DI());

					processId = snapshot._id ? snapshot._id.toString() : undefined;
					add(schemeId, processId);
					return pipe.run(req.body ? body : req.body);
				})
			)
			.subscribe(
				d => {
					// console.log('NEXTw', d);
					res.send(d)
				},
				e => {
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					// remove(schemeId, processId);
					// console.log('COMPLETEw');
				}
			);
	});

	app.post('/scheme/code/:code/options', function (req, res) {
		const schemeCode = req.params.code;

		const creator = new SnapshotPipesCreator3(null, schemeCode);
		let body = {};
		if (typeof req.body === 'object') {
			Object.keys(req.body)
				.filter(prop => prop !== 'modes')
				.forEach(prop => {
					body[prop] = req.body[prop];
				});
		} else {
			body = req.body;
		}

		let processId: string;
		let schemeId: string;
		creator.run(req.body && req.body.modes)
			.pipe(
				mergeMap(snapshot => {
					// snapshot.options = req.body || snapshot.options;
					// console.log(snapshot.id);

					const pipe = new Pipe(snapshot, true)
						.setSchemeProcessId(snapshot._id ? snapshot._id.toString() : undefined)
						.setDI(new DI());

					processId = snapshot._id ? snapshot._id.toString() : undefined;
					schemeId = snapshot.schemeId;
					add(schemeId, processId);
					return pipe.run(req.body ? body : req.body);
				})
			)
			.subscribe(
				d => {
					// console.log('NEXTw', d);
					res.send(d)
				},
				e => {
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					// remove(schemeId, processId);
					// console.log('COMPLETEw');
				}
			);
	});


	// http://localhost:3330/scheme/code/IMG_DOWMLOAD/options?path=adalya-baku-nights.jpg&isFile=true
	app.get('/scheme/code/:code/options', function (req, res) {
		const schemeCode = req.params.code;
		const options = req.query;

		const creator = new SnapshotPipesCreator3(null, schemeCode);
		let processId: string;
		let schemeId: string;
		creator.run()
			.pipe(
				mergeMap(snapshot => {
					const pipe = new Pipe(snapshot, true)
						.setSchemeProcessId(snapshot._id ? snapshot._id.toString() : undefined)
						.setDI(new DI());

					processId = snapshot._id ? snapshot._id.toString() : undefined;
					schemeId = snapshot.schemeId;
					// add(schemeId, processId);
					return pipe.run(options);
				})
			)
			.subscribe(
				(d: string) => {
					if (options.loadImage) {
						try {
							request.get(d).pipe(res);
						} catch(e) {
							console.log(e);
							res.send('');
						}
						return;
					}
					if (options.isFile) {
						try {
							console.log(d);
							res.sendFile(d);
						} catch(e) {
							console.log(e);
							res.send('');
						}
						
						return;
					}
					res.send(d);
				},
				e => {
					res.status(400).send(e);
				},
				() => {
					// remove(schemeId, processId);
				}
			);
	});

	app.post('/scheme/:schemeId/options', function (req, res) {
		const schemeId = req.params.schemeId;
		const creator = new SnapshotPipesCreator3(schemeId);

		let processId: string;
		creator.run()
			.pipe(
				mergeMap(snapshot => {
					const pipe = new Pipe(snapshot, false)
						.setSchemeProcessId(snapshot._id ? snapshot._id.toString() : undefined)
						.setDI(new DI());

					processId = snapshot._id ? snapshot._id.toString() : undefined;
					add(schemeId, processId);
					return pipe.run(req.body);
				})
			)
			.subscribe(
				d => {
					// console.log('NEXTw', d);
				},
				e => {
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					// console.log('COMPLETEw');
					// remove(schemeId, processId);
					res.send('')
				}
			);
	});

	app.get('/scheme/:schemeId', function (req, res) {
		const schemeId = req.params.schemeId;
		const creator = new SnapshotPipesCreator3(schemeId);
		let processId: string;
		creator.run()
			.pipe(
				mergeMap(snapshot => {
					const pipe = new Pipe(snapshot, false)
						.setSchemeProcessId(snapshot._id ? snapshot._id.toString() : undefined)
						.setDI(new DI());

					processId = snapshot._id ? snapshot._id.toString() : undefined;
					add(schemeId, processId);
					return pipe.run(null);
				})
			)
			.subscribe(
				d => {
					debugger;
					// console.log('NEXTw', d);
				},
				e => {
					debugger;
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					debugger;
					// remove(schemeId, processId);
					// console.log('COMPLETEw');
					res.send('')
				}
			);
	});

	app.get('/images/external/:host*', function (req, response, next) {
		var proxyurl = url.parse(req.url);
		var path = req.params[0];
		if (!!proxyurl.search) {
			path += proxyurl.search;
		}
		var imageURL = req.params.host + path;
		request.get(imageURL).pipe(response);
	});
	function handleEPIPE (err) {
		if (err.errno !== 'EPIPE') throw err
	}

	process.stdout.on('error', handleEPIPE);
	process.stderr.on('error', handleEPIPE);

	process.on('uncaughtException', function (err) {
		console.error(err.stack);
		console.log("Node NOT Exiting...");
	});

	const u = process.argv.indexOf('--port');
	if (!!~u) {
		const p = process.argv[u + 1];
		const port =  p ? +p : 3330;
		app.listen(port, '0.0.0.0', function () {
			console.log('Example app listening on port: ' + port);
		});
	} else {
		const port = 3330;
		app.listen(port, '0.0.0.0', function () {
			console.log('Example app listening on port: ' + port);
		});
	}
}, {count: 2, verbose: false,
	workerListener: function(msg) {
	//   console.log('master with pid', process.pid, 'received', msg, 'from worker');
	}})
