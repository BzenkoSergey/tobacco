import { ResourceStructureDto } from './resource-structure.dto';

export class ResourceSetingsDto {
	itemsSync = '0 0 * * *';
	interval = 0;
	executionTime = 0;

	constructor(d?: ResourceSetingsDto) {
		if (!d) {
			return;
		}
		this.itemsSync = d.itemsSync;
		this.interval = d.interval;
		this.executionTime = d.executionTime;
	}
}

export class ResourceDto {
	_id: string;
	name: string;
	logo: string;
	code: string;
	path: string;
	created: string;
	settings = new ResourceSetingsDto();
	schemes: string[] = [];
	ignoreLinks: string[] = [];
	structures: ResourceStructureDto[] = [];

	constructor(d?: ResourceDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.logo = d.logo;
		this.code = d.code;
		this.path = d.path;
		this.created = d.created;
		this.ignoreLinks = d.ignoreLinks || [];
		this.schemes = d.schemes || [];

		this.settings = new ResourceSetingsDto(d.settings);

		if (d.structures) {
			this.structures = d.structures.map(s => new ResourceStructureDto(s));
		}
	}
}
