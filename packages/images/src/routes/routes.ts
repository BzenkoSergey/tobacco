
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var url = require('url');
let multer = require('multer');
let upload = multer();
var request = require('request');
var sharp = require('sharp');
var rimraf = require('rimraf');
const fsExtra = require('fs-extra');
const cloudinary = require('cloudinary');

cloudinary.config({ 
	cloud_name: 'dwkakr4wt', 
	api_key: '513693319966298', 
	api_secret: 'IVqT7p5HgvhjJN5W5pmmtfET24M' 
  });

const configPath = path.resolve(__dirname + './../../store/config.json');

import { Subject, combineLatest } from 'rxjs';
import { createImage } from './gdrive.service';

router.get('/images/external/:host*', function (req, response, next) {
    var proxyurl = url.parse(req.url);
    var path = req.params[0];
    if (!!proxyurl.search) {
        path += proxyurl.search;
	}
	var imageURL = req.params.host + path;
	request.get(imageURL).pipe(response);
});

router.get('/images', (request, respond) => {
	fs.readdir(path.resolve(__dirname + './../../store/'), (err, files) => {
		const names = files.filter(n => {
			return n.endsWith('.jpeg') || n.endsWith('.jpg') || n.endsWith('.png');
		});
		respond.send(names);
	});
});

router.get('/images/file/:filePath', (request, respond) => {
	respond.sendFile(path.resolve(__dirname + './../../store/', request.params.filePath));
});

router.post('/images/file/sync', (request, respond) => {
	const tmp = path.resolve(__dirname + './../../store-resized');

	if (!fs.existsSync(tmp)) {
		fs.mkdirSync(tmp);
	}

	fs.readdir(path.resolve(__dirname + './../../store/'), (err, files) => {
		const names = files.filter(n => {
			return n.endsWith('.jpeg') || n.endsWith('.jpg') || n.endsWith('.png');
		});
		if (!names.length) {
			respond.send(false);
		}
		const ps = names.map(n => {
			const store = path.resolve(__dirname + './../../store/', n);

			const s = sharp(store)
				.jpeg({quality: 70, progressive: true })
				.toFile(tmp + '/origin-' + n);

			const s50 = sharp(store)
				.resize({ width: 50 })
				.toFile(tmp + '/sm-' + n);
		
			const s100 = sharp(store)
				.resize({ width: 100 })
				.toFile(tmp + '/md-' + n);
		
			const s200 = sharp(store)
				.resize({ width: 200 })
				.toFile(tmp + '/lg-' + n);
		
			return [s, s50, s100, s200];
		});
	
		Promise.all([].concat.apply([], ps))
			.then(() => {
				const subjs = names.map(a => {

					const origin = new Subject();
					const lg = new Subject();
					const sm = new Subject();
					const md = new Subject();
		
					cloudinary.v2.uploader.upload(
						tmp + '/origin-' + a, 
						{
							public_id: 'origin-' + a
						},
						function(error, result) {
							if(error) {
								console.error(result, tmp + '/origin-' + a);
								console.error(error);
							}
							origin.next();
							origin.complete();
						}
					);
		
					cloudinary.v2.uploader.upload(
						tmp + '/lg-' + a, 
						{
							public_id: 'lg-' + a
						},
						function(error, result) {
							if(error) {
								console.error(result, tmp + '/origin-' + a);
								console.error(error);
							}
							lg.next();
							lg.complete();
						}
					);
					cloudinary.v2.uploader.upload(
						tmp + '/md-' + a, 
						{
							public_id: 'md-' + a
						},
						function(error, result) {
							if(error) {
								console.error(result, tmp + '/origin-' + a);
								console.error(error);
							}
							md.next();
							md.complete();
						}
					);
					cloudinary.v2.uploader.upload(
						tmp + '/sm-' + a, 
						{
							public_id: 'sm-' + a
						},
						function(error, result) {
							if(error) {
								console.error(result, tmp + '/origin-' + a);
								console.error(error);
							}
							sm.next();
							sm.complete();
						}
					);
					return combineLatest(origin, lg, md, sm);	
				});
				combineLatest(subjs)
					.subscribe(
						() => {},
						() => {},
						() => {
							respond.send(true);
						}
					);
				

			})
			.catch((e) => {
				console.log(e);
				respond.send(false);
			});
	});
});

router.post('/images/file/:filePath/sync', (request, respond) => {
	const tmp = path.resolve(__dirname + './../../store-resized');
	const store = path.resolve(__dirname + './../../store/', request.params.filePath);

	if (!fs.existsSync(tmp)) {
		fs.mkdirSync(tmp);
	}

	const s = sharp(store)
		.resize({ width: null, height: null })
		.toFile(tmp + '/origin-' + request.params.filePath);

	const s50 = sharp(store)
		.resize({ width: 50 })
		.toFile(tmp + '/sm-' + request.params.filePath);

	const s100 = sharp(store)
		.resize({ width: 100 })
		.toFile(tmp + '/md-' + request.params.filePath);

	const s200 = sharp(store)
		.resize({ width: 200 })
		.toFile(tmp + '/lg-' + request.params.filePath);

	Promise.all([s, s50, s100, s200])
		.then(() => {

			const origin = new Subject();
			const lg = new Subject();
			const sm = new Subject();
			const md = new Subject();

			cloudinary.v2.uploader.upload(
				tmp + '/origin-' + request.params.filePath, 
				{
					public_id: 'origin-' + request.params.filePath
				},
				function(error, result) {
					console.log(result, error);
					origin.next();
					origin.complete();
				}
			);

			cloudinary.v2.uploader.upload(
				tmp + '/lg-' + request.params.filePath, 
				{
					public_id: 'lg-' + request.params.filePath
				},
				function(error, result) {
					console.log(result, error);
					lg.next();
					lg.complete();
				}
			);
			cloudinary.v2.uploader.upload(
				tmp + '/md-' + request.params.filePath, 
				{
					public_id: 'md-' + request.params.filePath
				},
				function(error, result) {
					console.log(result, error);
					md.next();
					md.complete();
				}
			);
			cloudinary.v2.uploader.upload(
				tmp + '/sm-' + request.params.filePath, 
				{
					public_id: 'sm-' + request.params.filePath
				},
				function(error, result) {
					console.log(result, error);
					sm.next();
					sm.complete();
				}
			);
			combineLatest(origin, lg, md, sm)
				.subscribe(
					() => {},
					() => {},
					() => {
						respond.send(true);
					}
				)
			
		})
		.catch(() => {
			respond.send(false);
		});
});

router.get('/images/:productId', (request, respond) => {
	fetchConfig()
		.subscribe(d => {
			const fileName = d[request.params.productId];
			respond.sendFile(path.resolve(__dirname + './../../store/', fileName));
		});
});

router.post('/images/:productId', upload.any(), function (request, respond) {
	const dir = path.resolve(__dirname + './../../store');

	fetchConfig()
		.subscribe(d => {
			request.files.forEach(file => {
				const name = file.originalname;
				let f = dir + '/' + name;
				d[request.params.productId] = name;
				saveConfig(d);
				fs.writeFile(f, file.buffer, function(e) {
					if (e) {
						console.error(e);
					}
					respond.end();
				});
			});
		})
});


function fetchConfig() {
	const subj = new Subject<{[key: string]: string}>();
	fs.readFile(configPath, 'utf8', (err, data: string) => {
		if (err) {
			subj.next({});
			subj.complete();
			return console.error(err);
		}
		subj.next(JSON.parse(data || '{}'));
		subj.complete();
	})
	return subj;
}

function saveConfig(config) {
	fs.writeFileSync(configPath, JSON.stringify(config));
}

export { router };