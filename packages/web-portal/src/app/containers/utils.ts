import { BreadcrumbModel } from '@components/breadcrumb';

export class Utils {
	static genPathUrl(queriesMap: Map<string, string[]>, isMixPage = false): string[] {
		if (isMixPage) {
			return Utils.genMixesUrl(queriesMap);
		}
		return Utils.genProductsUrl(queriesMap);
	}

	static genProductsUrl(queriesMap: Map<string, string[]>) {
		const resource = queriesMap.get('resource');
		const category = queriesMap.get('category');
		const company = queriesMap.get('company');
		const unitLine = queriesMap.get('unit-line');
		const weight = queriesMap.get('WEIGHT');

		let resourceLine = Utils.isNotEmptyArray(resource) ? resource.join(',') : '';
		let categoryLine = Utils.isNotEmptyArray(category) ? category.join(',') : '';
		let companyLine = Utils.isNotEmptyArray(company) ? company.join(',') : '';
		let unitLineLine = Utils.isNotEmptyArray(unitLine) ? unitLine.join(',') : '';
		const weightLine = Utils.isNotEmptyArray(weight) ? weight.join(',') : '';

		if (weightLine && !unitLineLine) {
			unitLineLine = 'all';
		}
		if (unitLineLine && !companyLine) {
			companyLine = 'all';
		}
		if (companyLine && !categoryLine) {
			categoryLine = 'all';
		}
		if (categoryLine && !resourceLine) {
			resourceLine = 'all';
		}

		return ['/products', resourceLine, categoryLine, companyLine, unitLineLine, weightLine]
			.filter(d => !!d);
	}

	static genMixesUrl(queriesMap: Map<string, string[]>) {
		const company = queriesMap.get('company');
		const unitLine = queriesMap.get('unit-line');

		let companyLine = Utils.isNotEmptyArray(company) ? company.join(',') : '';
		const unitLineLine = Utils.isNotEmptyArray(unitLine) ? unitLine.join(',') : '';

		if (!companyLine && unitLineLine) {
			companyLine = 'all';
		}

		return ['/mixes', companyLine, unitLineLine]
			.filter(d => !!d);
	}

	static isNotEmptyArray(d: any) {
		return Array.isArray(d) && d.length;
	}

	static genBreadcrumbs(queriesMap: Map<string, string[]>, menu: any, isMixes = false, isMobile = false) {
		const pageCode = isMixes ? 'mixes' : 'products';
		const baseLabel = isMixes ? 'Миксы' : 'Продукты';

		const list = [];

		function setDefault() {
			list.push(new BreadcrumbModel({
				title: baseLabel,
				url: isMixes ? ['/mixes'] : ['/products'],
				code: pageCode
			}));
		}

		const menuItems = menu.menu;
		if (!menuItems || !menuItems.length) {
			setDefault();
			return list;
		}

		const titles = [];
		queriesMap.forEach((v, k) => {
			if (!v) {
				return;
			}

			const labels = Utils.getMenuOptionsLabels(menuItems, k, v);
			if (labels.length) {
				titles.push({
					code: k,
					labels: labels
				});
			}
		});

		if (!titles.length) {
			setDefault();
			return list;
		}

		if (!isMobile) {
			setDefault();
		}
		const items = isMobile ? 2 : 6;
		const showItems = Math.ceil(items / titles.length);
		titles.forEach(d => {
			const code = d.code;
			const labels = d.labels;
			const map = new Map(queriesMap);

			if (!!~['resource'].indexOf(code)) {
				map.set('category', []);
			}
			if (!!~['category', 'resource'].indexOf(code)) {
				map.set('company', []);
			}
			if (!!~['company', 'category', 'resource'].indexOf(code)) {
				map.set('unit-line', []);
			}
			if (!!~['company', 'unit-line', 'category', 'resource'].indexOf(code)) {
				map.set('WEIGHT', []);
			}

			const length = labels.length;
			const text = labels.slice(0, showItems).join(', ');

			list.push(new BreadcrumbModel({
				title: text + (length > showItems ? '...' : ''),
				url: isMixes ? Utils.genMixesUrl(map) : Utils.genProductsUrl(map),
				code: pageCode
			}));
		});

		return list;
	}

	static getMenuOptionsLabels(menuItems: any[], itemCode: string, values: string[]) {
		const item = menuItems.find(m => m.code === itemCode);
		if (!item) {
			return [];
		}
		return item.options
			.filter(o => !!~values.indexOf(o.code))
			.map(o => o.label);
	}
}
