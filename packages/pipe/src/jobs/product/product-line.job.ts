import { from, Subject, BehaviorSubject } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from '../../core/services/ext.service';

export class ProductLineJob implements Job {
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
		const companyId = item.companyId;

		if (!companyId) {
			item.productLineId = null;
			return async({
				...info,
				data: [item, label]
			});
		}

		const ext = this.di.get<ExtService>(this.pipePath, DIService.EXT);

		return ext.getProductLines()
			.pipe(
				mergeMap(productLines => {
					const companyProductLines = productLines.filter(pl => pl.company === companyId);
					if (!companyProductLines.length) {
						item.productLineId = null;
						return async({
							...info,
							data: [item, label]
						});
					}
					const productLine = companyProductLines.find(pl => {
						return pl.mappingKeys.some(k => {
							return new RegExp(k.value, 'i').test(label);
						});
					});
					if (productLine) {
						item.productLineId = productLine._id.toString();
					}
					return async({
						...info,
						data: [item, label]
					});
				})
			);
	}
}