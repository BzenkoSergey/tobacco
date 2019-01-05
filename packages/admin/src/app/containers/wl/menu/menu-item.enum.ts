export enum MenuItem {
	CATEGORY = 'CATEGORY',
	LINE = 'LINE',
	ATTRIBUTE = 'ATTRIBUTE',
	COMPANY = 'COMPANY',
	RESOURCE = 'RESOURCE'
}

export namespace MenuItem {
	export const list = [
		MenuItem.CATEGORY,
		MenuItem.LINE,
		MenuItem.ATTRIBUTE,
		MenuItem.COMPANY,
		MenuItem.RESOURCE
	];
}
