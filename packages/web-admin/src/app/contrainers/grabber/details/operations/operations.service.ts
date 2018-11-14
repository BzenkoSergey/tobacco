import { MarketProductDto } from '@rest/market-products';
import { ResultRow, ResultItem } from '@rest/grabber';
import { ProductDto } from '@rest/products';
import { ProductAttributeDto } from '@rest/product-attributes';
import { CompanyDto } from '@rest/companies';
import { MappingKeyDto } from '@rest/shared';
import { ProductLineDto } from '@rest/product-lines';

import { MarketProductItemModel } from './market-product-item.model';

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

	defineQuality(list: MarketProductItemModel[], productAttributes: ProductAttributeDto[]) {
		list
			.filter(i => !!i.companyDto && !!i.productDto)
			.forEach(item => {
				let label = item.label;
				if (!!~label.indexOf('Табак Fusion Premium Burley Черностив')) {
					debugger;
				}
				// if (!!~label.indexOf('Табак Starbuzz Классическая Кола')) {
				// 	debugger;
				// }
				// if (!!~label.indexOf('Табак Starbuzz Классический Мохито')) {
				// 	debugger;
				// }
				item.companyDto.mappingKeys.forEach(m => {
					const d = label.replace(new RegExp(m.value, 'i'), '');
					label = d ? d : label.replace(item.companyDto.name, '');
				});

				if (item.productLineDto) {
					item.productLineDto.mappingKeys.forEach(m => {
						const d = label.replace(new RegExp(m.value, 'i'), '');
						label = d ? d : label.replace(item.productLineDto.name, '');
					});
				}
				if (item.productDto.productAttributes && item.attributes.length) {
					item.productDto.productAttributes
						.map(pa => {
							return productAttributes.find(a => a._id.$oid === pa);
						})
						.forEach(a => {
							const itemAttribute = item.attributes.find(f => f.name === a.name);
							a.values
								.filter(v => {
									if (!itemAttribute) {
										return true;
									}
									return v.value === itemAttribute.value;
								})
								.forEach(v => {
									v.mappingKeys
										.sort((f, b) => {
											return b.value.length - f.value.length;
										})
										.forEach(m => {
											label = label.replace(new RegExp(m.value, 'ig'), '');
										});
								});
						});
				}

				label = label.trim();
				label = label.replace(/«|»/g, '');
				label = label.replace(/"|'|№/g, '');
				label = label.replace(/(?<=[A-z])(с){1,}/ig, 'c');
				label = label.replace(/(?<=[ЁёА-я])(c){1,}/ig, 'с');
				label = label.replace(/(?<=[ЁёА-я] )(c){1,}/ig, 'с');
				label = label.replace(/(?<=[^ЁёА-я])(с)(?=[A-z])/ig, 'c');

				let eng = label;
				let ru = label;

				if (/[A-z]/.test(eng)) {
					eng = eng.replace(/((?<=[ЁёА-я])|^)(\-)|\-$/ig, ''); // remove - from cirilycs 'asdad-asdad'
					eng = eng.replace(/([ЁёА-я]+[ ]+[0-9]+)/i, '');
					eng = eng.replace(/[ЁёА-я]/g, '');
					eng = eng.replace(/(\)+[ ]+[0-9]+)/i, '');
				}
				if (/[ЁёА-я]/.test(ru)) {
					// ru = ru.replace(/((?<=[A-z])|^)(\-)|\-$/ig, ''); // remove - from cirilycs 'asdad-asdad'
					['Табак', 'Уголь кокосовый', 'Чаша'].forEach(s => {
						ru = ru.replace(s, '');
					});
					ru = ru.replace(/([A-z]+[ ]+[0-9]+)/i, '');
					ru = ru.replace(/[A-z]/g, '');
					ru = ru.replace(/(\)+[ ]+[0-9]+)/i, '');
				}

				// if (!!~label.indexOf('Кола')) {
				// 	debugger;
				// }

				const tr = (str: string) => {
					str = str.trim();
					str = str.replace(/[(),+]/g, '');
					str = str.replace(/(((?<=[^0-9])|^)(\.)|\.$)/ig, ''); // remove all . but not in 2.2
					str = str.replace(/\s{2,}/g, '');
					str = str.replace(/- /g, '');
					str = str.replace(/ -/g, '');
					str = str.trim();
					return str;
				};

				eng = tr(eng);
				ru = tr(ru);

				const info = [eng, ru]
					.map(str => {
						const results = item.productDto.mappingKeys
							.map(m => {
								return str.match(new RegExp(m.value, 'i'));
							})
							.filter(r => !!r);

						const segments = str.split(' ');
						const absolute = +segments.length + 1;
						str = '(' + segments.join('){0,}(?: ){0,}(') + '){0,}';
						const matches = results.map(r => r[0].match(new RegExp(str, 'i')));
						const values = matches
							.filter(r => !!r)
							.map(r => {
								return r.filter(i => !!i);
							})
							.map(r => {
								return (+r.length) / (absolute / 100);
							})
							.sort((a, b) => {
								return b - a;
							});
						return values[0] || 0;
					})
					.sort((a, b) => {
						return b - a;
					});

				if (info[0] !== 100) {
					console.log(info[0], item.label, item.productDto.name);
				}
				item.quality = info[0] || 0;
			});
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

	hasChanges(grabbed: MarketProductDto, existing: MarketProductDto) {
		const changes = this.getChanges(grabbed, existing);
		return Object.keys(changes).some(prop => changes[prop]);
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

	defineCompanies(list: MarketProductItemModel[], companies: CompanyDto[]) {
		const itemsLabels = new Map<MarketProductItemModel, string>();
		const sortedCompanies = companies.sort((a, b) => {
			return b.name.length - a.name.length;
		});
		list.forEach(item => {
			let label = item.label || '';
			let mappingKeys = [];

			const company = sortedCompanies.find(c => {
				const results = c.mappingKeys.filter(k => {
					// return !!label.match(new RegExp(k.value, 'i'));
					return new RegExp(k.value, 'i').test(label);
				});
				if (results.length) {
					mappingKeys = results;
					return true;
				}
				return false;
			});

			// if (!!~label.indexOf('Starbuzz Serpent After')) {
			// 	debugger;
			// }
			if (!company) {
				return false;
			}

			item.companyDto = company;
			mappingKeys.forEach(k => {
				const text = label.replace(new RegExp(k.value, 'i'), '');
				label = text || label;
			});

			itemsLabels.set(item, label);
		});
		return itemsLabels;
	}

	defineAliases(list: MarketProductItemModel[], marketProducts: MarketProductDto[]) {
		const urls = new Map<string, MarketProductDto>();
		marketProducts.forEach(i => urls.set(i.url, i));
		list.forEach(i => {
			i.alias = urls.get(i.url);
		});
	}

	defineProductLine(list: MarketProductItemModel[], companies: CompanyDto[], productLines: ProductLineDto[]) {
		const companyProductLinesMap = new Map<string, ProductLineDto[]>();
		companies.forEach(c => {
			const productLine = productLines.filter(pl => pl.company === c._id.$oid);
			if (!productLine) {
				return;
			}
			companyProductLinesMap.set(c._id.$oid, productLine);
		});

		list
			.filter(i => i.companyDto)
			.forEach(item => {
				const label = item.label || '';
				const companyProductLines = companyProductLinesMap.get(item.companyDto._id.$oid) || [];
				const productLine = companyProductLines.find(pl => {
					return pl.mappingKeys.some(k => {
						// return !!label.match(new RegExp(k.value, 'i'));
						return new RegExp(k.value, 'i').test(label);
					});
				});
				item.productLineDto = productLine;
			});
	}

	defineProducts(list: MarketProductItemModel[], products: ProductDto[], companies: CompanyDto[]) {
		console.log(Date.now(), 'defineProducts 1');
		const companyProductsMap = new Map<string, ProductDto[]>();
		products
			.filter(p => p.company)
			.forEach(p => {
				const company = companies.find(c => c._id.$oid === p.company);
				const productslist = companyProductsMap.get(company._id.$oid) || [];
				productslist.push(p);
				companyProductsMap.set(company._id.$oid, productslist.sort((a, b) => {
					return b.name.length - a.name.length;
				}));
			});

		console.log(Date.now(), 'defineProducts 2');
		list = list.filter(l => l.companyDto);
		list
			.filter(i => i.alias)
			.forEach(i => {
				i.productDto = products.find(p => p._id.$oid === i.alias.product);
				i.product = i.alias.product;
			});
		list = list.filter(i => !i.productDto);

		companies.forEach(c => {
			const companyProducts = companyProductsMap.get(c._id.$oid);

			// setTimeout(() => {

			list
				.filter(l => l.companyDto._id.$oid === c._id.$oid)
				.map(i => {
					const label = i.label || '';
					let productsList = companyProducts;
					if (i.productLineDto) {
						productsList = productsList.filter(p => p.productLine === i.productLineDto._id.$oid);
					}
					// if (!!~label.indexOf('PHOBOS')) {
					// 	debugger;
					// }
					const results = productsList
						.map(p => {
							const result = p.mappingKeys.filter(k => {
								// return !!label.match(new RegExp(k.value, 'i'));
								return new RegExp(k.value, 'i').test(label);
							});


							// if (!!~label.indexOf('Черника Малина Ежевика') && p.name === 'Orange Pie') {
							// 	debugger;
							// }
							return <[ProductDto, MappingKeyDto[]]>[p, result];
						})
						.filter(r => {
							const result = r[1];
							return !!result.length;
						})
						.sort((a, b) => {
							const aKey = a[1].sort((f, v) => v.value.length - f.value.length)[0];
							const bKey = b[1].sort((f, v) => v.value.length - f.value.length)[0];
							return bKey.value.length - aKey.value.length;
						})
						// .sort((a, b) => {
						// 	return b[0].name.length - a[0].name.length;
						// });

					// if (!!~label.indexOf('Fumari Plum')) {
					// 	debugger;
					// }
					if (results.length) {
						const product = results[0][0];
						i.product = product._id.$oid;
						i.productDto = product;
						return true;
					}
				});
			// });
		});

		// list
		// 	.filter(i => i.companyDto)
		// 	.map(i => {
		// 		const label = i.label || '';
		// 		let companyProducts = companyProductsMap.get(i.companyDto._id.$oid);
		// 		if (i.productLineDto) {
		// 			companyProducts = companyProducts.filter(p => p.productLine === i.productLineDto._id.$oid);
		// 		}
		// 		const results = companyProducts
		// 			.map(p => {
		// 				const result = p.mappingKeys.filter(k => {
		// 					return !!label.match(new RegExp(k.value, 'i'));
		// 				});
		// 				return <[ProductDto, MappingKeyDto[]]>[p, result];
		// 			})
		// 			.filter(r => {
		// 				const result = r[1];
		// 				return !!result.length;
		// 			})
		// 			.sort((a, b) => {
		// 				return b[0].name.length - a[0].name.length;
		// 			});

		// 		if (results.length) {
		// 			const product = results[0][0];
		// 			i.product = product._id.$oid;
		// 			i.productDto = product;
		// 			return true;
		// 		}
		// 	});
	}

	defineProducts2(list: MarketProductDto[], products: ProductDto[], companies: CompanyDto[], productLines: ProductLineDto[], marketProducts: MarketProductDto[]) {
		const productsLineMap = new Map<ProductDto, ProductLineDto>();
		const companyProductsMap = new Map<CompanyDto, ProductDto[]>();
		const marketProductUrls = new Map<string, MarketProductDto>();

		marketProducts.forEach(p => {
			marketProductUrls.set(p.url, p);
		});

		console.log(Date.now(), 'inner start 0');
		products.forEach(p => {
			const company = companies.find(c => c._id.$oid === p.company);
			const productLine = productLines.find(c => c._id.$oid === p.productLine);
			productsLineMap.set(p, productLine);

			const productslist = companyProductsMap.get(company) || [];
			productslist.push(p);
			companyProductsMap.set(company, productslist.sort((a, b) => {
				return b.name.length - a.name.length;
			}));
		});

		console.log(Date.now(), '====0');
		const companyMarketProducts = new Map<CompanyDto, MarketProductDto[]>();

		const sortedCompanies = companies.sort((a, b) => {
			return b.name.length - a.name.length;
		});
		console.log(Date.now(), '====00');

		const marketProductsLabels = new Map<MarketProductDto, string>();
		list
			.filter(marketProduct => {
				const exists = marketProductUrls.get(marketProduct.url);
				if (!exists) {
					return true;
				}
				if (this.hasChanges(marketProduct, exists)) {
					return true;
				}
				marketProduct.product = exists.product;
				return false;
			})
			.forEach(marketProduct => {
				let label = marketProduct.label || '';
				let mappingKeys = [];

				const company = sortedCompanies
					.find(c => {
						const results = c.mappingKeys.filter(k => {
							return !!label.match(new RegExp(k.value, 'i'));
						});
						if (results.length) {
							mappingKeys = results;
							return true;
						}
						return false;
					});

				if (!company) {
					return false;
				}

				// if (!!~label.indexOf('Апельсин (Orange)')) {
				// 	debugger;
				// }
				mappingKeys.forEach(k => {
					const text = label.replace(new RegExp(k.value, 'i'), '');
					label = text || label;
				});

				marketProductsLabels.set(marketProduct, label);

				const marketProducts = companyMarketProducts.get(company) || [];
				marketProducts.push(marketProduct);
				companyMarketProducts.set(company, marketProducts);
			});
			console.log(Date.now(), '====1');

		companyMarketProducts.forEach((marketProducts, company) => {
			const companyProducts = companyProductsMap.get(company)
				.sort((a, b) => {
					return b.name.length - a.name.length;
				});

			marketProducts.forEach(marketProduct => {
				const label = marketProductsLabels.get(marketProduct) || '';
				// console.log(marketProduct.label);

				const res = companyProducts
					.map(p => {
						const results = p.mappingKeys.filter(k => {
							return !!label.match(new RegExp(k.value, 'i'));
						});

						// if (!!~label.indexOf('Апельсин (Orange)') && p.name === 'Orange') {
						// 	debugger;
						// }
						const productProductLines = productsLineMap.get(p);
						let hasProductLine = false;
						if (productProductLines) {
							hasProductLine = productProductLines.mappingKeys.some(k => {
								return !!label.match(new RegExp(k.value, 'i'));
							});
							if (!hasProductLine) {
								return <[ProductDto, MappingKeyDto[], boolean]>[p, [], false];
							}
						}
						const a: [ProductDto, MappingKeyDto[], boolean] = [p, results, hasProductLine];
						return a;
					})
					.filter(r => {
						const results = r[1];
						return !!results.length;
					})
					.sort((a, b) => {
						return b[0].name.length - a[0].name.length;
					})
					.sort((a, b) => {
						return (a[2] === b[2]) ? 0 : a[2] ? -1 : 1;
					});

				if (res.length) {
					const product = res[0][0];
					marketProduct.product = product._id.$oid;
					return true;
				}
			});
		});

		console.log(Date.now(), '====11');
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
