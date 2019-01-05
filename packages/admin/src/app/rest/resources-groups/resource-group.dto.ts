export class ResourceGroupDto {
	_id: string;
	name: string;
	resources: string[] = [];
	created: string;

	constructor(d?: ResourceGroupDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.resources = d.resources;
		this.created = d.created;
	}
}
