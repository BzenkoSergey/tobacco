import * as path from 'path';
import * as fs from 'fs';

import { Subject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from './../job.interface';

type Input = {
	files: string[];
	names: string[];
};

type Output = {
	paths: string[];
};

export class ImageUploadOriginJob implements Job {
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
		const names = data.names;
		return this.uploadAll(files, names)
			.pipe(
				map(paths => {
					return {
						paths: paths
					};
				})
			);
	}

	private uploadAll(files: string[], names: string[]) {
		const all = files
			.map((file, i) => {
				return this.upload(file, names[i]);
			});
		return combineLatest(...all);
	}

	private upload(file: string, name: string) {
		const store = this.getStorePath();
		name = name + '.jpg';
		let f = store + '/' + name;
		const str = file;

		var data = str.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');

		const subj = new Subject<string>();
		fs.writeFile(f, buf, e => {
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
		return path.resolve(__dirname + './../../../store-origin/');
	}
}