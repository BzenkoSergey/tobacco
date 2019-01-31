import * as path from 'path';
import * as sharp from 'sharp';

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

export class ImageResizeJob implements Job {
	private options: Options;
	private overlay = path.resolve(__dirname + './overlay_white.png');

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
		console.log(data);
		const paths = data.paths;
		const all = paths.map(p => {
			return this.resizeAllSizes(p)
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

	private resizeAllSizes(path: string) {
		const all = Object.keys(this.options)
			.map((prop: SizeCode) => {
				const size = this.options[prop];
				return this.resize(path, size.width, size.height, prop);
			});
		return Promise.all(all);
	}

	private resize(path: string, width: number, height: number, sizeCode: SizeCode) {
		const input = this.getStorePath() + '/' + path;
		const output = this.getResizedStorePath() + '/' + sizeCode + '-' + path;

		if (sizeCode === 'md' || sizeCode === 'lg') {
			return sharp(input)
				.resize({
					width: width,
					height: height
				})
				.overlayWith(this.overlay, {
					gravity: sharp.gravity.southeast
				})
				.sharpen()
				.withMetadata()
				.webp( { quality: 90 } )
				.toFile(output);
		}
		return sharp(input)
			.resize({
				width: width,
				height: height
			})
			.toFile(output);
	}

	private getStorePath() {
		return path.resolve(__dirname + './../../../store/');
	}

	private getResizedStorePath() {
		return path.resolve(__dirname + './../../../store-resized')
	}
}