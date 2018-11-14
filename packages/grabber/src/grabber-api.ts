import { map } from 'rxjs/operators';

import { GrabberInputDto } from '@magz/common';

import { LinksService } from './links.service';
import { EntitiesHandlerService } from './entities-handler.service';

export class GrabberApi {
	perform(input: GrabberInputDto) {
		const entitiesHandlerService = new EntitiesHandlerService(input.mapping);
		
		const linksService = new LinksService(
			input.pageLimit,
			input.host,
			input.path,
			input.protocol,
			input.ignoreLinks,
			input.links,
			input.onlyDefinedLinks,
			input.testMode
		);

		return linksService.perform()
			.pipe(
				map(d => {
					const result = entitiesHandlerService.handle(d[1], d[0]);
					return [d[0], result];
				})
			);
	}
}