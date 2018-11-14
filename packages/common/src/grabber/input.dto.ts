import { GrabberMappingDto } from './mapping.dto';

export class GrabberInputDto {
	pageLimit?: number;
	mapping = new GrabberMappingDto();
	protocol: string;
	host: string;
	path: string;
	ignoreLinks: string[] = [];
	links: string[] = [];
	onlyDefinedLinks = false;
	testMode = false;

	constructor(d?: GrabberInputDto) {
		if (!d) {
			return;
		}
		this.pageLimit = d.pageLimit;
		this.mapping = new GrabberMappingDto(d.mapping);
		this.protocol = d.protocol;
		this.host = d.host;
		this.path = d.path;
		this.ignoreLinks = d.ignoreLinks || [];
		this.links = d.links || [];
		this.onlyDefinedLinks = d.onlyDefinedLinks;
		this.testMode = d.testMode;
	}
}
