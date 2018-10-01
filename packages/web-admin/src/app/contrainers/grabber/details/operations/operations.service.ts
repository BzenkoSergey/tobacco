import { MarketProductDto } from '@rest/market-products';
import { ResultRow, ResultItem } from '@rest/grabber';
import { ProductDto } from '@rest/products';
import { ProductAttributeDto } from '@rest/product-attributes';
import { CompanyDto } from '@rest/companies';

export class OperationsService {
	getUnique(list: ResultItem[]) {
		const uniques: ResultItem[] = [];
		list.forEach(r => {
			const duplicate = uniques.find(i => {
				return i.label === r.label;
			});
			if (!duplicate) {
				uniques.push(r);
			}
		});
		return uniques;
	}

	createMarketProduct(i: ResultItem, marketId: string) {
		const d = new MarketProductDto();
		d.label = i.label;
		d.available = i.available;
		d.price = i.price;
		d.url = i.url;
		d.market = marketId;
		return d;
	}

	matchMarketProducts(grabbed: MarketProductDto[], existing: MarketProductDto[]) {
		const map = new Map<MarketProductDto, MarketProductDto>();
		grabbed.forEach(g => {
			const p = existing.find(e => e.url === g.url);
			map.set(g, p);
		});
		return map;
	}

	getChanges(grabbed: MarketProductDto, existing: MarketProductDto) {
		const available = grabbed.available !== existing.available;
		const price = grabbed.price !== existing.price;
		const label = grabbed.label !== existing.label;
		const attributes = grabbed.attributes.some(a => {
			const existingAttr = existing.attributes.find(e => e.name === a.name);
			return existingAttr ? existingAttr.value !== a.value : true;
		});
		return {
			available: available,
			price: price,
			label: label,
			attributes: attributes
		};
	}

	defineProducts(list: MarketProductDto[], products: ProductDto[], companies: CompanyDto[]) {
		products.forEach(p => {
			const company = companies.find(c => c._id.$oid === p.company);
			list
				.map(i => {
					return <[MarketProductDto, string]>[i, i.label];
				})
				// define company
				.filter(i => {
					let label = i[1];
					const items = company.mappingKeys
						.filter(k => {
							return !!label.match(new RegExp(k.value, 'i'));
						});

					items.forEach(k => {
						label = label.replace(new RegExp(k.value, 'i'), '');
					});
					i[1] = label;
					return items.length;
				})
				// define product
				.filter(i => {
					const label = i[1];
					return p.mappingKeys.some(k => {
						return !!label.match(new RegExp(k.value, 'i'));
					});
				})
				// apply changes
				.forEach(i => {
					i[0].product = p._id.$oid;
				});
		});
	}

	fillAttributes(d: MarketProductDto, product: ProductDto, productAttributes: ProductAttributeDto[]) {
		const attributes = product.productAttributes.map(id => {
			return productAttributes.find(a => a._id.$oid === id);
		});

		if (!attributes.length) {
			return;
		}
		attributes.forEach(a => {
			const values = a.values
				.map(v => {
					const status = v.mappingKeys.some(k => {
						return !!d.label.match(new RegExp(k.value, 'i'));
					});
					return status ? v.value : null;
				})
				.filter(i => !!i);

			d.attributes.push({
				name: a.name,
				value: values[0]
			});
		});
	}
}
