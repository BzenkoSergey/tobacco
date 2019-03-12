import { UnitSeoDto } from './seo.dto';
import { UnitMixRecipe } from './recipe.dto';

export class UnitMixDto {
	_id: string;
	readableName: string;
	name: string;
	image: string;
	image2: string;
	description: string;
	short: string;
	recipes: UnitMixRecipe[] = [];
	visible = false;
	seo = new UnitSeoDto();

	constructor(d?: UnitMixDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.readableName = d.readableName;
		this.name = d.name;
		this.image = d.image;
		this.image2 = d.image2;
		this.description = d.description || '';
		this.short = d.short || '';
		this.visible = d.visible;
		this.seo = new UnitSeoDto(d.seo);

		if (d.recipes) {
			this.recipes = d.recipes.map(m => new UnitMixRecipe(m));
		}
	}
}
