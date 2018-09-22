import { Mongo } from './../shared';
import { MarketDto } from './market.dto';

export class MarketsRestService extends Mongo<MarketDto> {
	constructor() {
		super('markets');
	}

	protected handleResponse(d: MarketDto): MarketDto {
		return new MarketDto(d);
	}
}
