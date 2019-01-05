import { from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from './../../core/ext.service';

export class ProcessedQualityJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
		this.messager = messager;
	}

	destroy() {
		return this;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setStaticOptions(options: any) {
		return this;
	}

	setDI(di: DI) {
		this.di = di;
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	run(info: any) {
		const data = info.data;
		const item = Array.isArray(data) ? data[0] : data;
		let label = item.title;
		const companyId = item.companyId;
		const productId = item.productId;
		const productLineId = item.productLineId;
	
		item.processedQuality = 0;
		if (!productId || !companyId) {
			return async({
				...info,
				data: [item, label]
			});
		}

		const ext = this.di.get<ExtService>(this.pipePath, DIService.EXT);

		return combineLatest(
				ext.getProducts(),
				ext.getCompanies(),
				ext.getProductAttributes(),
				ext.getProductLines()
			)
			.pipe(
				mergeMap(data => {
					const products = data[0];
					const companies = data[1];
					const productAttributes = data[2];
					const productLines = data[3];

					const product = products.find(p => p._id.toString() === productId);
					const productLine = productLines.find(pl => pl._id.toString() === productLineId);
					const company = companies.find(c => c._id.toString() === companyId);

					company.mappingKeys.forEach(m => {
						const d = label.replace(new RegExp(m.value, 'i'), '');
						label = d ? d : label.replace(company.name, '');
					});
					if (productLine) {
						productLine.mappingKeys.forEach(m => {
							const d = label.replace(new RegExp(m.value, 'i'), '');
							label = d ? d : label.replace(productLine.name, '');
						});
					}
					if (product.productAttributes && item.attributes.length) {
						product.productAttributes
							.map(pa => {
								return productAttributes.find(a => a._id.toString() === pa);
							})
							.forEach(a => {
								// debugger;
								const itemAttribute = item.attributes.find(f => f.name === a.name);
								a.values
									.filter(v => {
										if (!itemAttribute) {
											return true;
										}
										return v.value === itemAttribute.value;
									})
									.forEach(v => {
										v.mappingKeys
											.sort((f, b) => {
												return b.value.length - f.value.length;
											})
											.forEach(m => {
												label = label.replace(new RegExp(m.value, 'ig'), '');
											});
									});
							});
					}

					label = label.trim();
					label = label.replace(/«|»/g, '');
					label = label.replace(/"|'|№/g, '');
					label = label.replace(/(?<=[A-z])(с){1,}/ig, 'c');
					label = label.replace(/(?<=[ЁёА-я])(c){1,}/ig, 'с');
					label = label.replace(/(?<=[ЁёА-я] )(c){1,}/ig, 'с');
					label = label.replace(/(?<=[^ЁёА-я])(с)(?=[A-z])/ig, 'c');

					let eng = label;
					let ru = label;
					if (/[A-z]/.test(eng)) {
						eng = eng.replace(/((?<=[ЁёА-я])|^)(\-)|\-$/ig, ''); // remove - from cirilycs 'asdad-asdad'
						eng = eng.replace(/([ЁёА-я]+[ ]+[0-9]+)/i, '');
						eng = eng.replace(/[ЁёА-я]/g, '');
						eng = eng.replace(/(\)+[ ]+[0-9]+)/i, '');
					}
					if (/[ЁёА-я]/.test(ru)) {
						// ru = ru.replace(/((?<=[A-z])|^)(\-)|\-$/ig, ''); // remove - from cirilycs 'asdad-asdad'
						['Табак', 'Уголь кокосовый', 'Чаша'].forEach(s => {
							ru = ru.replace(s, '');
						});
						ru = ru.replace(/([A-z]+[ ]+[0-9]+)/i, '');
						ru = ru.replace(/[A-z]/g, '');
						ru = ru.replace(/(\)+[ ]+[0-9]+)/i, '');
					}

					const tr = (str: string) => {
						str = str.trim();
						str = str.replace(/[(),+]/g, '');
						str = str.replace(/(((?<=[^0-9])|^)(\.)|\.$)/ig, ''); // remove all . but not in 2.2
						str = str.replace(/\s{2,}/g, '');
						str = str.replace(/- /g, '');
						str = str.replace(/ -/g, '');
						str = str.trim();
						return str;
					};
	
					eng = tr(eng);
					ru = tr(ru);
					const info = [eng, ru]
						.map(str => {
							const results = product.mappingKeys
								.map(m => {
									return str.match(new RegExp(m.value, 'i'));
								})
								.filter(r => !!r);
	
							const segments = str.split(' ');
							const absolute = +segments.length + 1;
							str = '(' + segments.join('){0,}(?: ){0,}(') + '){0,}';
							const matches = results.map(r => r[0].match(new RegExp(str, 'i')));
							const values = matches
								.filter(r => !!r)
								.map(r => {
									return r.filter(i => !!i);
								})
								.map(r => {
									return (+r.length) / (absolute / 100);
								})
								.sort((a, b) => {
									return b - a;
								});
							return values[0] || 0;
						})
						.sort((a, b) => {
							return b - a;
						});
	
					if (info[0] !== 100) {
						// console.log(info[0], item.label, item.productDto.name);
					}
					item.processedQuality = info[0] || 0;
					return async({
						...info,
						data: [item, label]
					});
				})
			);
	}
}