import * as path from 'path';
import * as fs from 'fs';

import { Subject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from './../job.interface';

type Input = {
	files: any[];
};

type Output = {
	paths: string[];
};

export class ImageUploadJob implements Job {
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

	run(data: Input): Observable<Output> {
		const files = data.files;
		return this.uploadAll(files)
			.pipe(
				map(paths => {
					return {
						paths: paths
					};
				})
			);
	}

	private uploadAll(files: any[]) {
		const all = files
			.map(file => {
				return this.upload(file);
			});
		return combineLatest(...all);
	}

	private upload(file: any) {
		const store = this.getStorePath();
		const name = file.originalname;
		let f = store + '/' + name;

		const subj = new Subject<string>();
		fs.writeFile(f, file.buffer, e => {
			if (e) {
				subj.error(e);
				return;
			}
			subj.next(name);
			subj.complete();
		});
		return subj;
	}

	private getStorePath() {
		return path.resolve(__dirname + './../../store/');
	}
}