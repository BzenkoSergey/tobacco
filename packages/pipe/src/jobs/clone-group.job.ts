import { async } from '../async';
import { PipeInjector } from './../core/pipe-injector.interface';
import { Messager } from './../core/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from '../core/di';
import { Navigator } from '../core/services/navigator';

export class CloneGroupJob implements Job {
	private options: any;
	private di: DI;
	private pipePath: string;
	private navigator: Navigator;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
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

	run(input) {
		this.navigator = this.di.get<Navigator>(this.pipePath, DIService.NAVIGATOR);

		const group = this.navigator.getParentGroup(this.pipePath);
		const parent = this.navigator.getParentOf(group.getPath());
		return parent.cloneChild(group.getPath(), input, true);
	}
}