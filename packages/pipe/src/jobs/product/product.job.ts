import { from, Subject, BehaviorSubject } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from './../../core/ext.service';

export class ProductJob implements Job {
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

	destroy() {
		return this;
	}

	run(info: any) {
		const data = info.data;
		const item = Array.isArray(data) ? data[0] : data;
		let label = Array.isArray(data) ? data[1] : (item.title || '');
		const companyId = item.companyId;
		item.productId = null;
		if (!companyId) {
			item.productId = null;
			return async({
				...info,
				data: [item, label]
			});
		}

		const productLineId = item.productLineId;
		const ext = this.di.get<ExtService>(this.pipePath, DIService.EXT);

		return ext.getProducts()
			.pipe(
				mergeMap(products => {
					let companyProducts = products.filter(p => p.company === companyId);
					if (productLineId) {
						companyProducts = companyProducts.filter(p => p.productLine === productLineId);
					}
					const results = companyProducts
						.map(p => {
							const result = p.mappingKeys.filter(k => {
								return new RegExp(k.value, 'i').test(label);
							});
							return <[any, any[]]>[p, result];
						})
						.filter(r => {
							const result = r[1];
							return !!result.length;
						})
						.sort((a, b) => {
							const aKey = a[1].sort((f, v) => v.value.length - f.value.length)[0];
							const bKey = b[1].sort((f, v) => v.value.length - f.value.length)[0];
							return bKey.value.length - aKey.value.length;
						});

					if (results.length) {
						const product = results[0][0];
						item.productId = product._id.toString();
					}
					return async({
						...info,
						data: [item, label]
					});
				})
			);
	}
}