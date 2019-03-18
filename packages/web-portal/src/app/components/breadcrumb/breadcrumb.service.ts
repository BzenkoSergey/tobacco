import { Subject } from 'rxjs';

import { BreadcrumbModel } from './breadcrumb.model';

export class BreadcrumbService {
	private subj = new Subject<BreadcrumbModel[]>();
	private items: BreadcrumbModel[] = [];

	get() {
		setTimeout(() => {
			this.push();
		});
		return this.subj;
	}

	remove(code: string) {
		this.items = this.items.filter(i => i.code !== code);
		this.push();
	}

	add(items: BreadcrumbModel[]) {
		this.items = this.items.concat(items);
		this.push();
	}

	replaceAll(items: BreadcrumbModel[], code: string) {
		this.items = this.items.filter(i => i.code !== code);
		const last = this.items.filter(i => i.last);
		const noLast = this.items.filter(i => !i.last);
		this.items = noLast.concat(items).concat(last);
		this.push();
	}

	private push() {
		this.subj.next(this.items);
	}
}
