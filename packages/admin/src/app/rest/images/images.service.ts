import { Injectable } from '@angular/core';

import { PipeRestService } from './../pipes/pipes.service';

@Injectable()
export class ImagesRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<string[], any>(
				'IMG_GET',
				{}
			);
	}

	sync(paths: string[]) {
		return this.restService
			.runSchemeOptions<any, any>(
				'IMG_SYNC',
				{
					paths: paths
				}
			);
	}

	resize(paths: string[]) {
		return this.restService
			.runSchemeOptions<any, any>(
				'IMG_RESIZE',
				{
					paths: paths
				}
			);
	}

	upload(d: any) {
		return this.restService
			.runSchemeOptions<any, any>(
				'IMG_UPLOAD',
				d
			);
	}
}
