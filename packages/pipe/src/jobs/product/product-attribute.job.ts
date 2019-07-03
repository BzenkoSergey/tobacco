import { from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from '../../core/services/ext.service';

export class ProductAttributesJob implements Job {
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
		let label = Array.isArray(data) ? data[1] : (item.title || '');
		const productId = item.productId;
		item.attributes = [];
		if (!productId) {
			return async({
				...info,
				data: [item, label]
			});
		}

		const ext = this.di.get<ExtService>(this.pipePath, DIService.EXT);

		return combineLatest(
				ext.getProductAttributes(),
				ext.getProducts()
			)
			.pipe(
				mergeMap(d => {
					// debugger;
					const productAttributes = d[0];
					const products = d[1];
					const product = products.find(p => p._id.toString() === productId);

					const attributes = product.productAttributes.map(id => {
						return productAttributes.find(a => a._id.toString() === id);
					});

					if (!attributes.length) {
						return async({
							...info,
							data: [item, label]
						});
					}

					attributes.forEach(a => {
						const values = a.values
							.map(v => {
								const status = v.mappingKeys.some(k => {
									return !!item.title.match(new RegExp(k.value, 'i'));
								});
								return status ? v : null;
							})
							.filter(i => !!i);
						if (!values.length) {
							return;
						}

						item.attributes.push({
							name: a.name,
							code: values[0].code,
							value: values[0].value
						});
					});
					return async({
						...info,
						data: [item, label]
					});
				})
			);
	}
}