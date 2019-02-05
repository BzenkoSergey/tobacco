export class CustomFieldDto {
	label: string;
	value: string;
	code: string;
	inheritance = true;

	constructor(d?: CustomFieldDto) {
		if (!d) {
			return;
		}
		this.label = d.label;
		this.value = d.value;
		this.code = d.code;
		this.inheritance = d.inheritance;
	}
}
