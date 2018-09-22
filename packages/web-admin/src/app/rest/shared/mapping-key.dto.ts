export class MappingKeyDto {
	value: string;

	constructor(d?: MappingKeyDto) {
		if (!d) {
			return;
		}
		this.value = d.value;
	}
}
