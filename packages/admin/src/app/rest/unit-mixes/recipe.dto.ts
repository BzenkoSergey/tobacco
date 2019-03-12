export class UnitMixRecipe {
	unit: string;
	company: string;
	line: string;
	percentage: string;
	color: string;

	constructor(d?: UnitMixRecipe) {
		if (!d) {
			return;
		}
		this.unit = d.unit;
		this.company = d.company;
		this.line = d.line;
		this.percentage = d.percentage;
		this.color = d.color;
	}
}
