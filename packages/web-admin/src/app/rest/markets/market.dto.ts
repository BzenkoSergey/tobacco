import { GrabberInputDto } from '@magz/common';

import { DocumentDto } from './../shared';

export class MarketDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	name: string;
	logo: string;
	grabber = new GrabberInputDto();

	constructor(d?: MarketDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.logo = d.logo;
		this.grabber = new GrabberInputDto(d.grabber);
	}
}
