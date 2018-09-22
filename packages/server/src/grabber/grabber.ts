
var express = require('express');
var router = express.Router();

import { GrabberTransform, GrabberInputDto, GrabberMappingAttributeType } from '@magz/common';
import { GrabberApi } from '@magz/grabber';

const hookahLovers = new GrabberInputDto({
	pageLimit: 50,
	host: 'https://hookah-lovers.com.ua',
	path: '/tabak/afza/', 
	protocol: 'HTTPS',
	mapping: {
		selector: '.card-item__wrapper',
		attributes: [
			{
				name: 'label',
				selector: '.card-item__name',
				transforms: [
					[GrabberTransform.TRIM, '']
				]
			},
			{
				name: 'image',
				selector: '.card-item__img-holder img',
				type: GrabberMappingAttributeType.ATTR,
				attrName: 'src',
				transforms: []
			},
			{
				name: 'price',
				selector: '.card-item__price-cost',
				transforms: [
					[GrabberTransform.NUMBERIFY, '']
				]
			},
			{
				name: 'url',
				selector: '.card-item__wrapper a:first-of-type',
				type: GrabberMappingAttributeType.ATTR,
				attrName: 'href',
				transforms: []
			},
			{
				name: 'available',
				selector: '.card-item__buy__text',
				transforms: [
					[GrabberTransform.BOOLEANIFY, 'Нет в наличии']
				]
			}
		]
	}
});

router.post('/grabber', (req, res, next) => {
	const result = [];

	new GrabberApi()
		.perform(req.body)
		.subscribe(
			d => {
				console.log('next =>');
				result.push(d);
			},
			err => console.error(err),
			() => {
				res.status(200).json(result);
				console.log('complete');
			}
		);
});

export { router };

