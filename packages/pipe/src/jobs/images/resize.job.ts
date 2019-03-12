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
	private overlay = path.resolve(__dirname + '/overlay_black.png');

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
				debugger;
				console.log(e);
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

		// console.log(input, sizeCode);
		if (sizeCode === 'origin' || sizeCode === 'lg') {
			// console.log(width, height);
			let w = 0;
			let h = 0;
			let l = 0;
			let t = 0;

			// 230/65
			const imgs = sharp(input)
				.resize({
					width: width,
					height: height
				})
				.jpeg({quality : 100, force : false})

			return imgs
				.metadata()
				.then(function(metadata) {
					l = (metadata.width - (230 + 40));
					t = (metadata.height - (65 + 40));

					return imgs.webp()
						.toBuffer();
				})
				.then((imgs) => {

					console.log(this.overlay);
					return sharp(imgs)
						.overlayWith(this.overlay, {
							top: t,
							left: l
						})
						.sharpen()

						.toFile(output)
						.catch(e => {
							console.log(input, sizeCode);
							console.log(e, input, sizeCode);
						})
				})
				
		}
		return sharp(input)
			.resize({
				width: width,
				height: height
			})
			.jpeg({quality : 100, force : false})

			.toFile(output);
	}

	private getStorePath() {
		return path.resolve(__dirname + './../../../store/');
	}

	private getResizedStorePath() {
		return path.resolve(__dirname + './../../../store-resized')
	}
}