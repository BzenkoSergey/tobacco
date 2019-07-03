import { async } from './../../async';
import { PipeInjector } from './../../core/pipe-injector.interface';
import { Messager } from './../../core/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class ResourceSettingsStructureQueryJob implements Job {
	private options: any;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	run(d: {settings: any}) {
		let pageUrl = d.settings.path;
		const segments = this.options.segments || [];
		pageUrl = pageUrl + segments.join('/');
		const params = this.options.query;

		const urlInfo = new URL(pageUrl);
		const urlQueries = urlInfo.searchParams;
		params.forEach(p => {
			urlQueries.append(p.key, p.value);
		});

		return async({
			...d,
			url: urlInfo.href
		});
	}

	destroy() {
		return this;
	}
	
	setStaticOptions(options: any) {
		return this;
	}

	setDI(di: DI) {
		return this;
	}

	setPipePath(path: string) {
		return this;
	}

	setSchemeId(schemeId: string) {
		return this;
	}
}