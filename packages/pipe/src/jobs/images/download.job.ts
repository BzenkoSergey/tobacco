import * as path from 'path';

import { Observable } from 'rxjs';
import { Job } from './../job.interface';
import { async } from './../../async';

type Input = {
	path: string;
};

export class ImageDownloadJob implements Job {
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

	run(data: Input): Observable<string> {
		const path = this.getStorePath() + '/' + data.path;
		return async(path);
	}

	private getStorePath() {
		return path.resolve(__dirname + './../../../store/');
	}
}