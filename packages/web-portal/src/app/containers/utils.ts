export class Utils {
	static genPathUrl(queriesMap: Map<string, string[]>, isMixPage = false): string[] {
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
		if (isMixPage) {
			return ['mixes', companyLine, unitLineLine]
				.filter(d => !!d);
		}
		return ['products', resourceLine, categoryLine, companyLine, unitLineLine, weightLine]
			.filter(d => !!d);
	}

	static isNotEmptyArray(d: any) {
		return Array.isArray(d) && d.length;
	}
}
