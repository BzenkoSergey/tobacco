import * as path from 'path';
import * as fs from 'fs';

import { Observable, Subject } from 'rxjs';
import { Job } from './../job.interface';

export class ImageGetJob implements Job {
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

	run(): Observable<string[]> {
		const subj = new Subject<string[]>();
		fs.readdir(this.getStorePath(), (err, files) => {
			if (err) {
				subj.error(err);
				return;
			}
			subj.next(files);
			subj.complete();
		});
		return subj;
	}

	private getStorePath() {
		return path.resolve(__dirname + './../../../store/');
	}
}