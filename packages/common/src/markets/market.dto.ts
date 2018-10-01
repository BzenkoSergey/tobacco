import { GrabberInputDto } from './../grabber';

import { DocumentDto } from './../shared';

export class MarketDto extends DocumentDto {
	name: string;
	logo: string;
	grabber = new GrabberInputDto();

	constructor(d?: MarketDto) {
		super(d);
		if (!d) {
			return;
		}
		this.name = d.name;
		this.logo = d.logo;
		this.grabber = new GrabberInputDto(d.grabber);
	}
}
