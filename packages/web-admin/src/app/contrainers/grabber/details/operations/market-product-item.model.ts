import { MarketDto } from '@rest/markets';
import { ProductDto } from '@rest/products';
import { ProductLineDto } from '@rest/product-lines';
import { CompanyDto } from '@rest/companies';
import { ProductAttributeDto } from '@rest/product-attributes';
import { MarketProductDto } from '@rest/market-products';

export class MarketProductItemModel extends MarketProductDto {
	marketDto: MarketDto;
	alias: MarketProductDto;
	companyDto: CompanyDto;
	productDto: ProductDto;
	productLineDto: ProductLineDto;
	productAttributesDtos: ProductAttributeDto[] = [];
	quality = 0;

	constructor(d?: MarketProductItemModel) {
		super(d);
		if (!d) {
			return;
		}
		this.quality = d.quality || 0;
		this.marketDto = new MarketDto(d.marketDto);
		this.alias = new MarketProductDto(d.alias);
		this.companyDto = new CompanyDto(d.companyDto);
		this.productDto = new ProductDto(d.productDto);
		this.productLineDto = new ProductLineDto(d.productLineDto);
		if (d.productAttributesDtos) {
			this.productAttributesDtos = d.productAttributesDtos.map(i => {
				return new ProductAttributeDto(i);
			});
		}
	}
}
