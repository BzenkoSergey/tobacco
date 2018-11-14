import { Injectable } from '@angular/core';
import { combineLatest, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoriesRestService } from '@rest/categories';
import { ProductLinesRestService } from '@rest/product-lines';
import { ProductsRestService } from '@rest/products';
import { ProductAttributesRestService } from '@rest/product-attributes';
import { CompaniesRestService } from '@rest/companies';
import { MarketsRestService } from '@rest/markets';
import { MarketProductsRestService } from '@rest/market-products';
import {
	AggregatedProductsRestService,
	AggregatedProductDto,
	AggregatedProductItemDto,
	AggregatedBaseDto,
	AggregatedProductAttributeDto
} from '@rest/aggregated-products';

@Injectable()
export class AggregatedProductsService {
	constructor(
		private productsRestService: ProductsRestService,
		private productLinesRestService: ProductLinesRestService,
		private productAttributesRestService: ProductAttributesRestService,
		private categoriesRestService: CategoriesRestService,
		private companiesRestService: CompaniesRestService,
		private marketsRestService: MarketsRestService,
		private marketProductsRestService: MarketProductsRestService,
		private aggregatedProductsRestService: AggregatedProductsRestService
	) {}

	aggregate(productId: string) {
		this.fetchAll(productId);
	}

	remove(productId: string) {
		this.aggregatedProductsRestService
			.list({
				productId: productId
			})
			.pipe(map(list => list[0]))
			.subscribe(d => {
				if (!d) {
					console.log('cant remove');
					return;
				}
				this.aggregatedProductsRestService.remove(d)
					.subscribe(() => {
						console.log('removed');
					});
			});
	}

	private create(item: AggregatedProductDto) {
		return this.aggregatedProductsRestService.create(item);
	}

	private update(item: AggregatedProductDto) {
		return this.aggregatedProductsRestService.update(item);
	}

	private fetchAll(productId: string) {
		combineLatest(
			this.productsRestService.get(productId),
			this.aggregatedProductsRestService
				.list({
					productId: productId
				})
				.pipe(map(list => list[0]))
		)
		.subscribe(list => {
			const product = list[0];
			const aggregated = list[1];
			const companyId = product.company;
			const categoriesIds = product.categories;
			const productAttributesIds = product.productAttributes;
			const productLineId = product.productLine;

			combineLatest(
				this.getProductItems(productId),
				this.getCompany(companyId),
				this.getCategories(categoriesIds),
				this.getAttributes(productAttributesIds),
				this.getProductLine(productLineId)
			).subscribe(data => {
				// console.log(product, data);

				const item = new AggregatedProductDto();
				if (aggregated) {
					item._id = aggregated._id;
				}

				let name = product.name;
				if (product.translate) {
					name = product.translate + ' / ' + product.name;
				}
				item.name = name; // need update
				item.readableName = product.name
					.toLowerCase()
					.replace(/ /g, '-')
					.replace(/[^\w-]+/g, '');

				item.productId = productId;
				item.logo = product.logo;
				item.visible = product.visible;
				item.company = data[1];
				item.items = data[0][0];
				item.search = data[0][1] + ' ' + name;
				item.productLine = data[4];
				if (item.productLine) {
					item.search = item.search + ' ' + item.productLine.name;
				}
				item.categories = data[2];
				if (item.categories.length) {
					item.categories.forEach(c => {
						item.search = item.search + ' ' + c.name;
					});
				}
				if (item.company) {
					item.search = item.search + ' ' + item.company.name;
				}
				item.productAttributes = data[3];

				if (item._id) {
					this.update(item);
				} else {
					this.create(item);
				}
			});
		});
	}

	private getCompany(companyId: string) {
		return this.companiesRestService.get(companyId)
			.pipe(
				map(d => {
					const item = new AggregatedBaseDto();
					item.id = d._id.$oid;
					item.logo = d.logo;
					item.name = d.name;
					return item;
				})
			);
	}

	private getCategories(categoriesIds: string[]) {
		return this.categoriesRestService
			.list({
				_id: {
					$in: categoriesIds.map(i => {
						return { $oid: i };
					})
				}
			})
			.pipe(
				map(list => {
					return list.map(i => {
						const item = new AggregatedBaseDto();
						item.id = i._id.$oid;
						item.logo = i.logo;
						item.name = i.name;
						return item;
					});
				})
			);
	}

	private getAttributes(productAttributesIds: string[]) {
		return this.productAttributesRestService
			.list({
				_id: {
					$in: productAttributesIds.map(i => {
						return { $oid: i };
					})
				}
			})
			.pipe(
				map(list => {
					return list.map(i => {
						const item = new AggregatedProductAttributeDto();
						item.id = i._id.$oid;
						item.name = i.name;
						item.values = i.values.map(v => v.value);
						return item;
					});
				})
			);
	}

	private getProductLine(productLineId: string) {
		if (!productLineId || typeof productLineId !== 'string') {
			return of(null);
		}
		if (productLineId === 'null') {
			return of(null);
		}

		console.log(productLineId);
		return this.productLinesRestService.get(productLineId)
			.pipe(
				map(d => {
					const item = new AggregatedBaseDto();
					item.id = d._id.$oid;
					item.logo = d.logo;
					item.name = d.name;
					return item;
				})
			);
	}

	private getProductItems(productId: string) {
		const subj = new Subject<[AggregatedProductItemDto[], string]>();
		this.marketProductsRestService.list({ product: productId })
			.subscribe(d => {
				const marketsIds = [];
				d.forEach(i => {
					if (!marketsIds.includes(i.market)) {
						marketsIds.push(i.market);
					}
				});

				this.marketsRestService
					.list({
						_id: {
							$in: marketsIds.map(i => {
								return { $oid: i };
							})
						}
					})
					.subscribe(markets => {
						const items = d.map(i => {
							const market = markets.find(m => m._id.$oid === i.market);
							const item = new AggregatedProductItemDto();
							item.market = new AggregatedBaseDto();
							item.market.id = market._id.$oid;
							item.market.logo = market.logo;
							item.market.name = market.name;

							item.id = i._id.$oid;
							item.available = i.available;
							item.price = i.price;
							item.url = i.url;

							item.productAttributes = i.attributes
								.filter(a => a.value)
								.map(a => {
									const attr = new AggregatedProductAttributeDto();
									attr.name = a.name;
									attr.values = [a.value];
									return attr;
								});
							return item;
						});
						const search = d
							.map(i => {
								const attrs = i.attributes.map(a => {
									return a.value;
								});
								return i.label + ' ' + attrs.join(' ');
							})
							.join(' ');

						subj.next([items, search]);
						subj.complete();
					});
			});
		return subj;
	}
}
