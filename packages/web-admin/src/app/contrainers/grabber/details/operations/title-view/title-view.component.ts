import { Component, Input, OnChanges } from '@angular/core';

import { ProductDto } from '@rest/products';
import { ProductLineDto } from '@rest/product-lines';
import { ProductAttributeDto } from '@rest/product-attributes';
import { CompanyDto } from '@rest/companies';

@Component({
	selector: 'title-view',
	templateUrl: './title-view.html',
	styleUrls: ['./title-view.scss']
})

export class TitleViewComponent implements OnChanges {
	@Input() title: string;
	@Input() product: ProductDto;
	@Input() company: CompanyDto;
	@Input() productLine: ProductLineDto;
	@Input() productAttributes: ProductAttributeDto[] = [];

	text = '';
	render: string[] = [];

	ngOnChanges() {
		this.text = this.title;
		if (this.company) {
			this.processCompany();
		}
		if (this.productLine) {
			this.processProductLine();
		}
		if (this.product) {
			this.processProduct();
		}

		this.render = this.text.split('||');
		// if (this.productAttributes) {
		// 	this.productAttributes.forEach(a => this.processProductAtribute(a));
		// }
	}

	isCompany(text: string) {
		return text.startsWith('<<');
	}

	isProductLine(text: string) {
		return text.startsWith('<<<');
	}

	isHighlighted(text: string) {
		return text.startsWith('<');
	}

	getText(text: string) {
		if (this.isProductLine(text)) {
			return text.replace('<<<', '');
		}
		if (this.isCompany(text)) {
			return text.replace('<<', '');
		}
		return text.replace('<', '');
	}

	private processCompany() {
		const results = this.company.mappingKeys
			.map(mk => {
				return this.title.match(new RegExp(mk.value, 'i'));
			})
			.filter(r => !!r)
			.sort((a, b) => {
				return b[0].length - a[0].length;
			});

		if (!results.length) {
			return;
		}
		let result = results[0][0];
		if (result === this.text) {
			result = this.text.replace(this.company.name, '||<<' + this.company.name + '||');
		} else {
			result = this.text.replace(result, '||<<' + result + '||');
		}
		this.text = result;
	}

	private processProductLine() {
		const results = this.productLine.mappingKeys
			.map(mk => {
				return this.text.match(new RegExp(mk.value, 'i'));
			})
			.filter(r => !!r)
			.sort((a, b) => {
				return b[0].length - a[0].length;
			});

		if (!results.length) {
			return;
		}

		let result = results[0][0];
		if (result === this.text) {
			result = this.text.replace(this.productLine.name, '||<<<' + this.productLine.name + '||');
		} else {
			result = this.text.replace(result, '||<<<' + result + '||');
		}
		this.text = result;
	}

	private processProduct() {
		const results = this.product.mappingKeys
			.map(mk => {
				return this.title.match(new RegExp(mk.value, 'i'));
			})
			.filter(r => !!r)
			.sort((a, b) => {
				return b[0].length - a[0].length;
			});

		if (!results.length) {
			return;
		}
		let result = results[0][0];
		if (result === this.text) {
			result = this.text.replace(this.product.name, '||<' + this.product.name + '||');
		} else {
			result = this.text.replace(result, '||<' + result + '||');
		}
		this.text = result;
	}

	private processProductAtribute(attribute: ProductAttributeDto) {
		attribute.values.forEach(value => {
			const results = value.mappingKeys
				.map(mk => {
					return this.title.match(new RegExp(mk.value, 'i'));
				})
				.filter(r => !!r)
				.sort((a, b) => {
					return b.length - a.length;
				});

			if (!results.length) {
				return;
			}
			let result = results[0][0];
			if (result === this.text) {
				result = this.text.replace(value.value, '<' + value.value + '>');
			} else {
				result = this.text.replace(result, '<' + result + '>');
			}
			this.text = result;
		});
	}
}
