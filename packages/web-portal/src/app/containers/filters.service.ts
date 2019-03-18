import { Subject } from 'rxjs';

export class FiltersService {
	private d: any = {};
	private subj = new Subject();
	private code: string;

	setCode(code: string) {
		this.code = code;
	}

	getCode() {
		return this.code;
	}

	push(d: any) {
		this.d = d;
		this.subj.next(d);
	}

	get() {
		setTimeout(() => {
			this.subj.next(this.d);
		});
		return this.subj;
	}
}
