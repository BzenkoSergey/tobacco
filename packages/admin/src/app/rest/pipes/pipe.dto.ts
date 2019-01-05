export class PipeDto {
	_id: string;
	id: string;
	jobName: string;
	options: string;
	services: string[] = [];
	label: string;
	type: string;
	code: string;
	children: PipeDto[] = [];

	constructor(d?: PipeDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.jobName = d.jobName;
		this.services = d.services;
		this.label = d.label;
		this.id = d.id;
		this.options = d.options;
		this.type = d.type;
		this.code = d.code;
		if (d.children && d.children.length) {
			this.children = d.children.map(c => new PipeDto(c));
		}
	}
}
