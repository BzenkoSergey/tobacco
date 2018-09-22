import { GrabberMappingDto } from './mapping.dto';

export class GrabberInputDto {
	pageLimit?: number;
	mapping = new GrabberMappingDto();
	protocol: string;
	host: string;
	path: string;

	constructor(d?: GrabberInputDto) {
		if (!d) {
			return;
		}
		this.pageLimit = d.pageLimit;
		this.mapping = new GrabberMappingDto(d.mapping);
		this.protocol = d.protocol;
		this.host = d.host;
		this.path = d.path;
	}
}
