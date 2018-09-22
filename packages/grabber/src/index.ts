// import "module-alias/register";

// var fs = require('fs');

// import { Transforms } from './transforms/transforms.service';
// export { GrabberApi } from './grabber-api';

// const grabberApi = new GrabberApi();

// const hookahLovers: Input = {
// 	pageLimit: 50,
// 	host: 'https://hookah-lovers.com.ua',
// 	path: '/tabak/afza/', 
// 	protocol: 'HTTPS',
// 	mapping: {
// 		selector: '.card-item__wrapper',
// 		attributes: [
// 			{
// 				name: 'label',
// 				selector: '.card-item__name',
// 				transforms: [
// 					[Transforms.TRIM, '']
// 				]
// 			},
// 			{
// 				name: 'image',
// 				selector: '.card-item__img-holder img',
// 				type: 'ATTR',
// 				attrName: 'src',
// 				transforms: []
// 			},
// 			{
// 				name: 'price',
// 				selector: '.card-item__price-cost',
// 				transforms: [
// 					[Transforms.NUMBERIFY, '']
// 				]
// 			},
// 			{
// 				name: 'url',
// 				selector: '.card-item__wrapper a:first-of-type',
// 				type: 'ATTR',
// 				attrName: 'href',
// 				transforms: []
// 			},
// 			{
// 				name: 'available',
// 				selector: '.card-item__buy__text',
// 				transforms: [
// 					[Transforms.BOOLEANIFY, 'Нет в наличии']
// 				]
// 			}
// 		]
// 	}
// };

// const zaycev: Input = {
// 	pageLimit: null,
// 	host: 'http://zaycev.net',
// 	path: '/', 
// 	protocol: 'HTTP',
// 	mapping: {
// 		additions: [
// 			{
// 				name: 'artist',
// 				selector: '.artist-page__title .artist-page__name',
// 				transforms: [
// 					[Transforms.TRIM, '']
// 				]
// 			},
// 			{
// 				name: '',
// 				selector: '.artist-page .block__image img',
// 				type: 'ATTR',
// 				attrName: 'src',
// 				transforms: [
// 					[Transforms.TRIM, '']
// 				]
// 			},
// 			{
// 				name: 'artistId',
// 				selector: '.artist-page',
// 				type: 'ATTR',
// 				attrName: 'data-artist-id',
// 				transforms: [
// 					[Transforms.TRIM, ''],
// 					[Transforms.NUMBERIFY, '']
// 				]
// 			}
// 		],
// 		selector: '.musicset-track',
// 		attributes: [
// 			{
// 				name: 'label',
// 				selector: '.musicset-track__artist .musicset-track__link, .musicset-track__track-dash, .musicset-track__track-name .musicset-track__link',
// 				transforms: [
// 					[Transforms.TRIM, '']
// 				]
// 			},
// 			{
// 				name: 'artist',
// 				selector: '.musicset-track__artist .musicset-track__link',
// 				transforms: [
// 					[Transforms.TRIM, '']
// 				]
// 			},
// 			{
// 				name: 'artistId',
// 				selector: '.musicset-track__artist .musicset-track__link',
// 				type: 'ATTR',
// 				attrName: 'href',
// 				transforms: [
// 					[Transforms.TRIM, ''],
// 					[Transforms.REPLACE, ['/artist/', '']],
// 					[Transforms.NUMBERIFY, '']
// 				]
// 			},
// 			{
// 				name: 'trackId',
// 				selector: '.musicset-track__artist .musicset-track__link',
// 				type: 'ATTR',
// 				attrName: 'data-id',
// 				root: true,
// 				transforms: [
// 					[Transforms.TRIM, ''],
// 					[Transforms.NUMBERIFY, '']
// 				]
// 			},
// 			{
// 				name: 'duration',
// 				selector: '.musicset-track__duration',
// 				transforms: []
// 			},
// 			{
// 				name: 'url',
// 				selector: '.musicset-track__download-link',
// 				type: 'ATTR',
// 				attrName: 'href',
// 				transforms: []
// 			},
// 			{
// 				name: 'mp3',
// 				selector: '',
// 				root: true,
// 				type: 'ATTR',
// 				attrName: 'data-dkey',
// 				transforms: [
// 					[Transforms.REPLACE, ['.mp3', '']],
// 					[Transforms.PREFIX, 'http://cdndl.zaycev.net'],
// 					[Transforms.POSTFIX, '/track.mp3']
// 				]
// 			}
// 		]
// 	}
// };

// const result = [];

// grabberApi
// 	.perform(hookahLovers)
// 	.subscribe(
// 		d => {
// 			console.log('next =>');
// 			result.push(d);
// 		},
// 		err => console.error(err),
// 		() => {
// 			var stream = fs.createWriteStream('result.json');
// 			stream.once('open', function(fd) {
// 				stream.write(JSON.stringify(result));
// 				stream.end();
// 				console.log("The file was saved!");
// 			});
// 			console.log('complete');
// 		}
// 	);