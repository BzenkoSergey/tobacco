import * as path from 'path';
import * as cloudinary from 'cloudinary';

import { Subject, Observable } from 'rxjs';
import { Job } from './../job.interface';

type Size = {
	width: number;
	height: number;
};

type Options = {
	origin: Size;
	sm: Size;
	md: Size;
	lg: Size;
};

type SizeCode = keyof Options;

type Input = {
	paths: string[];
};

export class ImageSyncJob implements Job {
	private options: Options;

	constructor(options: Options) {
		this.options = options;
	}

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

	run(data: Input): Observable<Input> {
		const paths = data.paths;
		const all = paths.map(p => {
			return this.syncAllSizes(p)
		});

		const subj = new Subject<Input>();
		Promise.all([].concat.apply([], all))
			.then(() => {
				subj.next(data);
				subj.complete();
			})
			.catch(e => {
				subj.error(e);
			});

		return subj;
	}

	private syncAllSizes(path: string) {
		const all = Object.keys(this.options)
			.map((prop: SizeCode) => {
				return this.sync(path, prop);
			});
		return Promise.all(all);
	}

	private sync(path: string, sizeCode: SizeCode) {
		const filePath = this.getResizedStorePath() + '/' + sizeCode + '-' + path;
		const publicIp = sizeCode + '-' + path;

		const subj = new Subject<string>();
		cloudinary.v2.uploader.upload(
			filePath, 
			{
				public_id: publicIp
			},
			function(error) {
				if(error) {
					subj.error(error);
					return;
				}
				subj.next();
				subj.complete();
			}
		);
		return subj;
	}

	private getResizedStorePath() {
		return path.resolve(__dirname + './../../store-resized')
	}
}