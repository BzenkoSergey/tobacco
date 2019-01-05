import * as request from 'request';

import { Observable } from 'rxjs';
import { Job } from './../job.interface';

type Input = {
	path: string;
};

export class ImageExternlDownloadJob implements Job {
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
		return request.get(data.path);
	}
}