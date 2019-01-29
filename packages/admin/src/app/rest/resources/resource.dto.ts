import { ResourceStructureDto } from './resource-structure.dto';

export class ResourceSetingsDto {
	itemsSync = '0 0 * * *';
	interval = 0;
	executionTime = 0;
	schemeType: 'TOBACCO'|'GOOGLE-SEARCH' = 'TOBACCO';

	constructor(d?: ResourceSetingsDto) {
		if (!d) {
			return;
		}
		this.itemsSync = d.itemsSync;
		this.interval = d.interval;
		this.executionTime = d.executionTime;
		this.schemeType = d.schemeType || 'TOBACCO';
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

export class ResourcePage {
	location: {
		host: string, // "www.google.com"
		href: string, // "https://www.google.com/search?q=asd&oq=asd&aqs=chrome..69i57j69i60j69i59l2j69i60l2.360j0j7&sourceid=chrome&ie=UTF-8"
		origin: string, // "https://www.google.com"
		protocol: string, // "https:",
		queries: {
			q: 'asdasd',
			dfdf: ['asdasdsad', 'asdasd']
		};
	};
	head: {
		title: string;
		description: string;
		keywords: string;
		canonical: string;
		properties: [
			{
				property: string,
				content: string
			}
		]
	};
	links: [{
		href: string,
		text: string,
		title: string
	}];
	headlines: [{
		tag: 'h1'|'h2',
		text: string
	}];
	texts: string[];
	p: string[];
	bolded: [{
		tag: 'bold'|'strong',
		text: string
	}];
	images: [
		{
			href: string,
			alt: string,
			title: string
		}
	];
	createdDate: number;
}
