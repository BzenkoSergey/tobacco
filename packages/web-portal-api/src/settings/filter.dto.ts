export enum PortalFilterType {
	PRODUCT_ATTRIBUTE = 'PRODUCT_ATTRIBUTE',
	CATEGORY = 'CATEGORY',
	COMPANIES = 'COMPANIES',
	PRODUCT_LINES = 'PRODUCT_LINES',
	MARKETS = 'MARKETS'
}

export class PortalFilterDto {
	type = PortalFilterType.PRODUCT_ATTRIBUTE;
	label: string;
	attribute: string;
	parentCategory: string;
	companies = false;
	productLines = false;
	markets = false;

	constructor(d?: PortalFilterDto) {
		if (!d) {
			return;
		}
		this.type = d.type;
		this.label = d.label;
		this.attribute = d.attribute;
		this.parentCategory = d.parentCategory;
		this.companies = d.companies;
		this.productLines = d.productLines;
		this.markets = d.markets;
	}
}
