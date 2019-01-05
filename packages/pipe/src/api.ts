import * as cors from 'cors';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as compression from 'compression';
import * as request from 'request';
import * as url from 'url';
var cluster = require('express-cluster');

import { Subject } from 'rxjs';
import { tap, mergeMap, catchError, map } from 'rxjs/operators';

import { PipesLine } from './pipes/pipes-line';
import { SnapshotCreator } from './core/snapshot.creator';
import { SnapshotPipesCreator } from './core/snapshot-pipes.creator';
import { Pipe } from './core/pipe';
import { DI } from './core/di';

import { ObjectId } from 'mongodb';
import { MongoDb } from './core/db';
cluster(function(worker) {
var app = express();

app.use(bodyParser.text({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors({
	origin: ['http://localhost:4100', 'http://localhost:4200', 'http://localhost:4220', 'http://192.168.0.175:4100', 'http://192.168.0.175:4200', 'http://192.168.0.175:4220'],
	optionsSuccessStatus: 200,
	credentials: true
}));
app.use(compression());

app.get('/pipes-line/:id/process/:processId/pipe-process/:pipeProcessId', function (req, res) {
	const pipesLineId = req.params.id;
	const processId = req.params.processId;
	const pipeProcessId = req.params.pipeProcessId;

	const pipesLine = new PipesLine(pipesLineId, true, {
		pipeLineProcessId: processId,
		pipeGroupProcessId: null,
		pipeProcessId: pipeProcessId
	});
	pipesLine.run()
		.subscribe(
			d => {
				// console.log('FULL NEXT processId => pipe-process');
			},
			e => {
				console.log(e);
				res.json(e);
			},
			() => {
				// console.log('FULL COMPLETED processId => pipe-process');
				res.json({});
			}
		)
});

app.get('/pipes-line/:id/process/:processId/group/:groupId/group-process/:groupProcessId', function (req, res) {
	const pipesLineId = req.params.id;
	const processId = req.params.processId;
	const groupId = req.params.groupId;
	const groupProcessId = req.params.groupProcessId;
	const pipesLine = new PipesLine(pipesLineId, true, {
		pipeLineId: pipesLineId,
		pipeLineProcessId: processId,
		pipeGroupId: groupId,
		pipeGroupProcessId: groupProcessId,
		pipeProcessId: null
	});
	
	pipesLine.run()
		.subscribe(
			d => {
				// console.log('FULL NEXT processId => group-process');
			},
			e => {
				console.log('FULL ERRROR processId => group-process');
				res.send(e.toString());
			},
			() => {
				// console.log('FULL COMPLETED processId => group-process');
				res.json({});
			}
		)
});

app.get('/pipes-line/:id/process/:processId', function (req, res) {
	const pipesLineId = req.params.id;
	const processId = req.params.processId;
	const pipesLine = new PipesLine(pipesLineId, true, {
		pipeLineId: pipesLineId,
		pipeLineProcessId: processId,
		pipeGroupProcessId: null,
		pipeProcessId: null
	});
	pipesLine.run()
		.subscribe(
			d => {
				// console.log('FULL NEXT processId');
			},
			e => {
				res.json(e);
			},
			() => {
				// console.log('FULL COMPLETED processId');
				res.json({});
			}
		)
});

app.get('/pipes-line/:id', function (req, res) {
	const pipesLineId = req.params.id;
	const pipesLine = new PipesLine(pipesLineId, false, null);
	pipesLine.run()
		.subscribe(
			d => {
				// console.log('FULL NEXT');
			},
			e => {
				res.json(e);
			},
			() => {
				// console.log('FULL COMPLETED');
				res.json({});
			}
		)
});

app.get('/pipes-line', function (req, res) {
	const mongoDb = new MongoDb('pipes-line');
	mongoDb.find({})
		.subscribe(
			d => res.send(d),
			e => res.status(400).send(e)
		);
});

app.get('/pipes-group', function (req, res) {
	const mongoDb = new MongoDb('pipes-group');
	mongoDb.find({})
		.subscribe(
			d => res.send(d),
			e => res.status(400).send(e)
		);
});

app.get('/pipes', function (req, res) {
	const mongoDb = new MongoDb('pipes');
	mongoDb.find({})
		.subscribe(
			d => res.send(d),
			e => res.status(400).send(e)
		);
});


app.get('/process/:processId/paths/:paths', function (req, res) {
	const processId = req.params.processId;
	const paths = req.params.paths.split(',');

	const mongoDb = new MongoDb('scheme-processes');
		mongoDb
			.findOne({
				_id: ObjectId(processId)
			})
			.pipe(
				mergeMap(snapshot => {
					const pipe = new Pipe(snapshot, false)
						.setSchemeProcessId(snapshot._id)
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
	const mongoDb = new MongoDb('scheme-processes');
		mongoDb
			.findOne({
				_id: ObjectId(processId)
			})
			.pipe(
				mergeMap(snapshot => {
					const pipe = new Pipe(snapshot, false)
						.resetStatus()
						.setSchemeProcessId(snapshot._id)
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


app.get('/get/process/:processId', function (req, res) {
	const processId = req.params.processId;
	const mongoDb = new MongoDb('scheme-processes', true);
		mongoDb
			.findOne({
				_id: ObjectId(processId)
			})
			.subscribe(
				d => {
					res.send(d);
					// console.log('NEXT');
				},
				e => {
					// console.log(e);
					res.status(400).send(e);
				},
				() => {
					console.log('COMPLETE');
					// res.send('')
				}
			);
});


// app.get('/get/process-data/:dataId', function (req, res) {
// 	const dataId = req.params.dataId;
// 	const mongoDb = new MongoDb('scheme-processes-data');
// 		mongoDb
// 			.findOne({
// 				_id: ObjectId(dataId)
// 			})
// 			.pipe(map(d => {
// 				return d.content;
// 			}))
// 			.subscribe(
// 				d => {
// 					res.send(d);
// 					// console.log('NEXT');
// 				},
// 				e => {
// 					// console.log(e);
// 					res.status(400).send(e);
// 				},
// 				() => {
// 					console.log('COMPLETE');
// 					// res.send('')
// 				}
// 			);
// });

app.get('/get/scheme/:schemeId/processes', function (req, res) {
	const schemeId = req.params.schemeId;
	const mongoDb = new MongoDb('scheme-processes', true);
		mongoDb
			.find({
				entityId: schemeId
			})
			.subscribe(
				d => {
					res.send(d);
					// console.log('NEXT');
				},
				e => {
					// console.log(e);
					res.status(400).send(e);
				},
				() => {
					// console.log('COMPLETE');
					// res.send('')
				}
			);
});

app.get('/get/scheme', function (req, res) {
	const mongoDb = new MongoDb('scheme', true);
		mongoDb
			.find({})
			.subscribe(
				d => {
					res.send(d);
					// console.log('NEXT');
				},
				e => {
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					// console.log('COMPLETE');
					// res.send('')
				}
			);
});

app.post('/get/scheme/:schemeId', function (req, res) {
	const schemeId = req.params.schemeId;
	let ob: any = {};
	Object.keys(req.body)
		.forEach(p => {
			if (p === '_id') {
				return;
			}
			ob[p] = req.body[p];
		})
	const mongoDb = new MongoDb('scheme', true);
		mongoDb
			.updateOne(
				{
					_id: ObjectId(schemeId)
				},
				{
					$set: ob
				}
			)
			.subscribe(
				d => {
					res.send(d);
					// console.log('NEXT');
				},
				e => {
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					// console.log('COMPLETE');
					// res.send('')
				}
			);
});


app.post('/get/scheme', function (req, res) {
	const mongoDb = new MongoDb('scheme', true);
		mongoDb
			.insertOne(
				req.body
			)
			.subscribe(
				d => {
					res.send(d);
					// console.log('NEXT');
				},
				e => {
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					// console.log('COMPLETE');
					// res.send('')
				}
			);
});


app.get('/get/scheme/:schemeId', function (req, res) {
	const schemeId = req.params.schemeId;
	const mongoDb = new MongoDb('scheme', true);
		mongoDb
			.findOne({
				_id: ObjectId(schemeId)
			})
			.subscribe(
				d => {
					res.send(d);
					// console.log('NEXT');
				},
				e => {
					console.log(e);
					res.status(400).send(e);
				},
				() => {
					// console.log('COMPLETE');
					// res.send('')
				}
			);
});


app.post('/scheme/:schemeId/options', function (req, res) {
	const schemeId = req.params.schemeId;
	const creator = new SnapshotPipesCreator(schemeId);

	creator.run()
		.pipe(
			mergeMap(snapshot => {
				const pipe = new Pipe(null, true)
					.setSchemeProcessId(snapshot._id)
					.setDI(new DI());

				return pipe.init(snapshot)
					.pipe(
						mergeMap(() => {
							return pipe.run(req.body);
						})
					);
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
				// console.log('COMPLETEw');
			}
		);
});

app.post('/scheme/code/:code/options', function (req, res) {
	const schemeCode = req.params.code;

	const creator = new SnapshotPipesCreator(null, schemeCode);
	creator.run()
		.pipe(
			mergeMap(snapshot => {
				// snapshot.options = req.body || snapshot.options;
				// console.log(snapshot.id);

				const pipe = new Pipe(null, true)
					.setSchemeProcessId(snapshot._id)
					.setDI(new DI());

				return pipe.init(snapshot)
					.pipe(
						mergeMap(() => {
							return pipe.run(req.body);
						})
					);
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
				// console.log('COMPLETEw');
			}
		);
});


// http://localhost:3330/scheme/code/IMG_DOWMLOAD/options?path=adalya-baku-nights.jpg&isFile=true
app.get('/scheme/code/:code/options', function (req, res) {
	const schemeCode = req.params.code;
	const options = req.query;

	const creator = new SnapshotPipesCreator(null, schemeCode);
	creator.run()
		.pipe(
			mergeMap(snapshot => {
				const pipe = new Pipe(null, true)
					.setSchemeProcessId(snapshot._id)
					.setDI(new DI());

				return pipe.init(snapshot)
					.pipe(
						mergeMap(() => {
							return pipe.run(options);
						})
					);
			})
		)
		.subscribe(
			(d: string) => {
				if (options.isFile) {
					res.sendFile(d);
					return;
				}
				res.send(d);
			},
			e => {
				res.status(400).send(e);
			},
			() => {}
		);
});

app.post('/scheme/:schemeId/options', function (req, res) {
	const schemeId = req.params.schemeId;
	const creator = new SnapshotPipesCreator(schemeId);

	creator.run()
		.pipe(
			mergeMap(snapshot => {
				const pipe = new Pipe(null, false)
					.setSchemeProcessId(snapshot._id)
					.setDI(new DI());

				return pipe.init(snapshot)
					.pipe(
						mergeMap(() => {
							return pipe.run(req.body);
						})
					);
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
				res.send('')
			}
		);
});

app.get('/scheme/:schemeId', function (req, res) {
	const schemeId = req.params.schemeId;
	const creator = new SnapshotPipesCreator(schemeId);
	creator.run()
		.pipe(
			mergeMap(snapshot => {
				debugger;
				const pipe = new Pipe(null, false)
					.setSchemeProcessId(snapshot._id)
					.setDI(new DI());

				return pipe.init(snapshot)
					.pipe(
						mergeMap(() => {
							// return pipe.run(snapshot.options);
							return pipe.run(null);
						})
					);
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
// function handleEPIPE (err) {
// 	if (err.errno !== 'EPIPE') throw err
// }
// process.stdout.on('error', handleEPIPE);
// process.stderr.on('error', handleEPIPE);

// process.on('uncaughtException', function (err) {
// 	console.error(err.stack);
// 	console.log("Node NOT Exiting...");
// });

app.listen(3330, '0.0.0.0', function () {
	console.log('Example app listening on port 3330!');
});
}, {count: 5})