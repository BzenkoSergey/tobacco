export class ResourceStructureDto {
	name: string;
	code: string;
	trigger: string;
	structure: string;

	constructor(d?: ResourceStructureDto) {
		if (!d) {
			return;
		}
		this.name = d.name;
		this.code = d.code;
		this.trigger = d.trigger;
		this.structure = d.structure;
	}
}
