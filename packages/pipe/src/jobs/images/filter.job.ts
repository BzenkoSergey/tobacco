import { Observable } from 'rxjs';

import { Job } from './../job.interface';
import { async } from './../../async';

type Input = {
	paths: string[];
};

export class ImageFilterJob implements Job {
	setSchemeId() {
		return this;
	}

	setDI() {
		return this;
	}

	setPipePath() {
		return this;
	}

	setStaticOptions() {
		return this;
	}

	destroy() {
		return this;
	}

	run(paths: string[]): Observable<string[]> {
		const list = paths.filter(p => {
			return p.endsWith('.jpeg') || 
				p.endsWith('.jpg') || 
				p.endsWith('.png');
		})
		return async(list);
	}
}