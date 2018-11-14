import { combineLatest, Subject, Observable } from 'rxjs';

import { GrabberJob, GrabberInputDto } from '@magz/common';
import { GrabberApi } from '@magz/grabber';

import { MarketProductDto, GrabberSettingsDto, MarketDto } from '@magz/common';

import { MarketProductsService } from './rest/market-products';
import { GrabberSettingsService } from './rest/grabber-settings';
import { MarketsService } from './rest/markets';


type Row = (string | [{
	[key: string]: string;
}[], {
	[key: string]: string;
}])[];

export type ResultItem = {
	available: boolean;
	image: string;
	label: string;
	price: number;
	url: string;
};

export type ResultRow = [string, [ResultItem[], any]];


export class SchedulerService {
	marketProductsService = new MarketProductsService();
	grabberSettingsService = new GrabberSettingsService();
	marketsService = new MarketsService();

	settings: GrabberSettingsDto;
	items: MarketProductDto[] = [];
	markets: MarketDto[] = [];
	itemsMap = new Map<string, MarketProductDto[]>();
	day = ((1000 * 60) * 60) * 24;

	perform() {
		const subj = new Subject<{ data: Row, marketId: string}>();
		combineLatest(
			this.fetchSettings(),
			this.fetchMarketProducts(),
			this.fetchMarkets()
		)
		.subscribe(d => {
			this.settings = d[0][0] || new GrabberSettingsDto();
			this.items = d[1];
			this.markets = d[2];
			this.prepare();
			this.markets.forEach(m => {
				const items = this.itemsMap.get(m._id.toString());
				if(items.length) {
					this.performMarket(items, m.grabber)
						.subscribe(d => {
							subj.next({
								marketId: m._id.toString(),
								data: d
							});
						});
				}
			});
		});
		return subj;
	}

	performMarket(items: MarketProductDto[], config: GrabberInputDto) {
		const subj = new Subject<Row>();
		const delay = this.day / items.length;
		console.log(delay, items.length);
		let i = 0;
		setInterval(() => {
			i = i + 1;
			if (items.length - 1 < i) {
				i = 0;
			}
			const item = items[i];
			this.grabb(item.url, config)
				.subscribe(d => {
					subj.next(d);
				});
		}, delay);
		return subj;
	}

	prepare() {
		this.markets.forEach(m => {
			const items = this.items.filter(i => i.market === m._id.toString());
			this.itemsMap.set(m._id.toString(), items);
		});
	}

	private grabb(url: string, config: GrabberInputDto) {
		const clone = new GrabberInputDto(config);
		clone.onlyDefinedLinks = true;
		clone.links = [url];
		return new GrabberApi().perform(clone);
	}

	private fetchMarketProducts() {
		return this.marketProductsService.list();
	}

	private fetchSettings() {
		return this.grabberSettingsService.list();
	}

	private fetchMarkets() {
		return this.marketsService.list();
	}
}