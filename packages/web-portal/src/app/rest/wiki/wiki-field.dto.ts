export class WikiFieldAttrDto {
	value: string;
	name: string;

	constructor(d?: WikiFieldAttrDto) {
		if (!d) {
			return;
		}
		this.value = d.value;
		this.name = d.name;
	}
}

export class WikiFieldDto {
	value: string;
	name: string;
	tag: string;
	adds: WikiFieldAttrDto[] = [];
	visible = true;
	order = 0;

	constructor(d?: WikiFieldDto) {
		if (!d) {
			return;
		}
		this.value = d.value;
		this.name = d.name;
		this.tag = d.tag;
		this.visible = d.visible;
		this.order = d.order || 0;
		if (d.adds) {
			this.adds = d.adds.map(a => new WikiFieldAttrDto(a));
		}
	}
}
