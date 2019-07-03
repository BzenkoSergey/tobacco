import { from, Subject, BehaviorSubject } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from '../../core/services/ext.service';

export class CompanyJob implements Job {
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
		const ext = this.di.get<ExtService>(this.pipePath, DIService.EXT);

		return ext.getCompanies()
			.pipe(
				mergeMap(companies => {
					const item = Array.isArray(data) ? data[0] : data;
					let label = Array.isArray(data) ? data[1] : (item.title || '');
					let mappingKeys = [];

					// Sort companies by names
					const sortedCompanies = companies.sort((a, b) => {
						return b.name.length - a.name.length;
					});

					// Define company
					const company = sortedCompanies.find(c => {
						const results = c.mappingKeys.filter(k => {
							return new RegExp(k.value, 'i').test(label);
						});

						if (results.length) {
							mappingKeys = results;
							return true;
						}
						return false;
					});

					if (!company) {
						return async({
							...info,
							data: [item, label]
						});
					}

					mappingKeys.forEach(k => {
						const text = label.replace(new RegExp(k.value, 'i'), '');
						label = text || label;
					});

					item.companyId = company._id.toString();
					return async({
						...info,
						data: [item, label]
					});
				})
			);
	}
}