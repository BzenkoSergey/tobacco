import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { CompanyDto, CompaniesRestService } from '@rest/companies';
import { CategoryDto, CategoriesRestService } from '@rest/categories';
import { ProductDto, ProductsRestService } from '@rest/products';
import { ProductAttributeDto, ProductAttributesRestService } from '@rest/product-attributes';
import { ProductLineDto, ProductLinesRestService } from '@rest/product-lines';
import { MarketProductDto, MarketProductsRestService } from '@rest/market-products';
import { MarketDto, MarketsRestService } from '@rest/markets';
import { ImagesRestService } from '@rest/images';



var f =
[
	{
	   "title":"Acid Gold",
	   "img":"https://dontabak.com.ua/246-home_default/tabak-starbuzz-acid-gold-250-gramm.jpg"
	},
	{
	   "title":"Cantaloupe",
	   "img":"https://dontabak.com.ua/247-home_default/tabak-starbuzz-muskusnaya-dynya-cantaloupe-250-gramm.jpg"
	},
	{
	   "title":"Pumpkin Pie",
	   "img":"https://dontabak.com.ua/248-home_default/tabak-starbuzz-tykvennyj-pirog-pumpkin-pie-250-gramm.jpg"
	},
	{
	   "title":"Pink Lady",
	   "img":"https://dontabak.com.ua/249-home_default/tabak-starbuzz-rozovaya-ledi-pink-lady-250-gramm.jpg"
	},
	{
	   "title":"Queen of Sex",
	   "img":"https://dontabak.com.ua/250-home_default/tabak-starbuzz-koroleva-seksa-queen-of-sex-250-gramm.jpg"
	},
	{
	   "title":"Code 69",
	   "img":"https://dontabak.com.ua/251-home_default/tabak-starbuzz-kod-69-code-69-250-gramm.jpg"
	},
	{
	   "title":"Passion Kiss",
	   "img":"https://dontabak.com.ua/252-home_default/tabak-starbuzz-strastnyj-poceluj-passion-kiss-250-gramm.jpg"
	},
	{
	   "title":"Sex On The Beach",
	   "img":"https://dontabak.com.ua/253-home_default/tabak-starbuzz-seks-na-plyazhe-sex-on-the-beach-250-gramm.jpg"
	},
	{
	   "title":"Blackberry",
	   "img":"https://dontabak.com.ua/255-home_default/tabak-starbuzz-ezhevika-blackberry-250-gramm.jpg"
	},
	{
	   "title":"White Peach",
	   "img":"https://dontabak.com.ua/256-home_default/tabak-starbuzz-belyj-persik-white-peach-250-gramm.jpg"
	},
	{
	   "title":"Tropicool",
	   "img":"https://dontabak.com.ua/257-home_default/tabak-starbuzz-multifrukt-myata-tropicool-250-gramm.jpg"
	},
	{
	   "title":"Tangerine Dream",
	   "img":"https://dontabak.com.ua/258-home_default/tabak-starbuzz-mandarinovaya-mechta-tangerine-dream-250-gramm.jpg"
	},
	{
	   "title":"Simply Mint",
	   "img":"https://dontabak.com.ua/259-home_default/tabak-starbuzz-myata-simply-mint-250-gramm.jpg"
	},
	{
	   "title":"Royal Grape",
	   "img":"https://dontabak.com.ua/261-home_default/tabak-starbuzz-korolevskij-vinograd-royal-grape-250-gramm.jpg"
	},
	{
	   "title":"Marlette",
	   "img":"https://dontabak.com.ua/263-home_default/tabak-starbuzz-marlette-250-gramm.jpg"
	},
	{
	   "title":"Citrus mist",
	   "img":"https://dontabak.com.ua/1120-home_default/tabak-starbuzz-myagkaya-ekzotika-citrus-mist-250-gramm.jpg"
	},
	{
	   "title":"Chocolate Strawberry",
	   "img":"https://dontabak.com.ua/431-home_default/tabak-starbuzz-shokolad-s-klubnikoj-chocolate-strawberry-250g.jpg"
	},
	{
	   "title":"Cosmo Power",
	   "img":"https://dontabak.com.ua/432-home_default/tabak-starbuzz-kosmicheskaya-energiya-cosmo-power-250-gramm.jpg"
	},
	{
	   "title":"Kiwi Strawberry",
	   "img":"https://dontabak.com.ua/435-home_default/tabak-starbuzz-kivi-i-klubnika-kiwi-strawberry-250-gramm.jpg"
	},
	{
	   "title":"Peach Queen",
	   "img":"https://dontabak.com.ua/437-home_default/tabak-starbuzz-koroleva-persikov-peach-queen-250-gramm.jpg"
	},
	{
	   "title":"Simply Mango",
	   "img":"https://dontabak.com.ua/438-home_default/tabak-starbuzz-mango-simply-mango-250-gramm.jpg"
	},
	{
	   "title":"Sweet Melon",
	   "img":"https://dontabak.com.ua/439-home_default/tabak-starbuzz-sladkaya-dynya-sweet-melon-250-gramm.jpg"
	},
	{
	   "title":"Tequila Sunrise",
	   "img":"https://dontabak.com.ua/440-home_default/tabak-starbuzz-tekila-tequila-sunrise-250-gramm.jpg"
	},
	{
	   "title":"Tropical Fruit",
	   "img":"https://dontabak.com.ua/441-home_default/tabak-starbuzz-tropicheskie-frukty-tropical-fruit-250-gramm.jpg"
	},
	{
	   "title":"UFO",
	   "img":"https://dontabak.com.ua/1119-home_default/tabak-starbuzz-nlo-ufo-250-gramm.jpg"
	},
	{
	   "title":"Exotic Coconut",
	   "img":"https://dontabak.com.ua/443-home_default/tabak-starbuzz-kokos-exotic-coconut-250-gramm.jpg"
	},
	{
	   "title":"Guava",
	   "img":"https://dontabak.com.ua/444-home_default/tabak-starbuzz-guava-guava-250-gramm.jpg"
	},
	{
	   "title":"Apple Cinnamon",
	   "img":"https://dontabak.com.ua/632-home_default/tabak-starbuzz-yabloko-s-koricej-apple-cinnamon-250-gramm.jpg"
	},
	{
	   "title":"Apple Martini",
	   "img":"https://dontabak.com.ua/633-home_default/tabak-starbuzz-martini-s-yablokom-apple-martini-250-gramm.jpg"
	},
	{
	   "title":"Citrus Mint",
	   "img":"https://dontabak.com.ua/853-home_default/tabak-starbuzz-citrus-i-myata-citrus-mint-250-gramm.jpg"
	},
	{
	   "title":"Strawberry Margarita",
	   "img":"https://dontabak.com.ua/855-home_default/tabak-starbuzz-klubnichnaya-margarita-strawberry-margarita-250-gramm.jpg"
	},
	{
	   "title":"Grape Freeze",
	   "img":"https://dontabak.com.ua/856-home_default/tabak-starbuzz-ledyanoj-vinograd-grape-freeze-250-gramm.jpg"
	},
	{
	   "title":"Classic Mojito",
	   "img":"https://dontabak.com.ua/858-home_default/tabak-starbuzz-klassicheskij-mokhito-classic-mojito-250-gramm.jpg"
	},
	{
	   "title":"Orange",
	   "img":"https://dontabak.com.ua/859-home_default/tabak-starbuzz-apelsin-orange-250-gramm.jpg"
	},
	{
	   "title":"Apple Americano",
	   "img":"https://dontabak.com.ua/860-home_default/tabak-starbuzz-amerikanskoe-yabloko-apple-americano-250-gramm.jpg"
	},
	{
	   "title":"Pina Colada",
	   "img":"https://dontabak.com.ua/861-home_default/tabak-starbuzz-pina-kolada-pina-colada-250-gramm.jpg"
	},
	{
	   "title":"Sweet Apple",
	   "img":"https://dontabak.com.ua/862-home_default/tabak-starbuzz-sladkoe-yabloko-sweet-apple-250-gramm.jpg"
	},
	{
	   "title":"White Grape",
	   "img":"https://dontabak.com.ua/863-home_default/tabak-starbuzz-belyj-vinograd-white-grape-250-gramm.jpg"
	},
	{
	   "title":"Rose",
	   "img":"https://dontabak.com.ua/972-home_default/tabak-starbuzz-roza-rose-250-gramm.jpg"
	},
	{
	   "title":"Lemon Mint",
	   "img":"https://dontabak.com.ua/973-home_default/tabak-starbuzz-limon-s-myatoj-lemon-mint-250-gramm.jpg"
	},
	{
	   "title":"Wild Mint",
	   "img":"https://dontabak.com.ua/974-home_default/tabak-starbuzz-dikaya-myata-wild-mint-250-gramm.jpg"
	},
	{
	   "title":"Apple Doppio",
	   "img":"https://dontabak.com.ua/975-home_default/tabak-starbuzz-dvojnoe-yabloko-bez-anisa-apple-doppio-250-gramm.jpg"
	},
	{
	   "title":"Lebanese bomb shell",
	   "img":"https://dontabak.com.ua/1028-home_default/tabak-starbuzz-pikhta-lebanese-bomb-shell-250-gramm.jpg"
	},
	{
	   "title":"Grapefruit",
	   "img":"https://dontabak.com.ua/1106-home_default/tabak-starbuzz-grejpfrut-grapefruit-250-gramm.jpg"
	},
	{
	   "title":"Lady in Red",
	   "img":"https://dontabak.com.ua/1107-home_default/tabak-starbuzz-ledi-v-krasnom-lady-in-red-250-gramm.jpg"
	},
	{
	   "title":"French Orange",
	   "img":"https://dontabak.com.ua/1111-home_default/tabak-starbuzz-apelsinovyj-ssherbet-french-orange-250-gramm.jpg"
	},
	{
	   "title":"Geisha",
	   "img":"https://dontabak.com.ua/1114-home_default/tabak-starbuzz-gejsha-geisha-250-gramm.jpg"
	},
	{
	   "title":"Cosmopolitan",
	   "img":"https://dontabak.com.ua/1115-home_default/tabak-starbuzz-kosmopolitan-cosmopolitan-100-gramm.jpg"
	},
	{
	   "title":"Blue Surfer",
	   "img":"https://dontabak.com.ua/1197-home_default/tabak-starbuzz-sinij-syorfer-blue-surfer-250-gramm.jpg"
	},
	{
	   "title":"Margarita",
	   "img":"https://dontabak.com.ua/1198-home_default/tabak-starbuzz-margarita-margarita-250-gramm.jpg"
	},
	{
	   "title":"Peach Mist",
	   "img":"https://dontabak.com.ua/1199-home_default/tabak-starbuzz-persikovyj-tuman-peach-mist-250-gramm.jpg"
	},
	{
	   "title":"Watermelon Freeze",
	   "img":"https://dontabak.com.ua/1200-home_default/tabak-starbuzz-ledyanoj-arbuz-watermelon-freeze-250-gramm.jpg"
	},
	{
	   "title":"Winter Fresh",
	   "img":"https://dontabak.com.ua/1201-home_default/tabak-starbuzz-zimnyaya-svezhest-winter-fresh-250-gramm.jpg"
	},
	{
	   "title":"Blueberry",
	   "img":"https://dontabak.com.ua/1239-home_default/tabak-starbuzz-chernika-blueberry-250-gramm.jpg"
	},
	{
	   "title":"Flower Power",
	   "img":"https://dontabak.com.ua/1240-home_default/tabak-starbuzz-cvetochnaya-sila-flower-power-250-gramm.jpg"
	},
	{
	   "title":"Honey Berry",
	   "img":"https://dontabak.com.ua/1241-home_default/tabak-starbuzz-medovye-yagody-honey-berry-250-gramm.jpg"
	},
	{
	   "title":"Apricot",
	   "img":"https://dontabak.com.ua/1308-home_default/tabak-starbuzz-abrikos-apricot-250-gramm.jpg"
	},
	{
	   "title":"Banana",
	   "img":"https://dontabak.com.ua/1310-home_default/tabak-starbuzz-banan-banana-250-gramm.jpg"
	},
	{
	   "title":"Black Grape",
	   "img":"https://dontabak.com.ua/1311-home_default/tabak-starbuzz-chernyj-vinograd-black-grape-250-gramm.jpg"
	},
	{
	   "title":"Blueberry Grape",
	   "img":"https://dontabak.com.ua/1312-home_default/tabak-starbuzz-vinograd-s-chernikoj-blueberry-grape-250-gramm.jpg"
	},
	{
	   "title":"Black Mint",
	   "img":"https://dontabak.com.ua/1313-home_default/tabak-starbuzz-chernaya-myata-black-mint-250-gramm.jpg"
	},
	{
	   "title":"Golden Grape",
	   "img":"https://dontabak.com.ua/1314-home_default/tabak-starbuzz-zolotoj-vinograd-golden-grape-250-gramm.jpg"
	},
	{
	   "title":"Grapefruit Mint",
	   "img":"https://dontabak.com.ua/1315-home_default/tabak-starbuzz-grejpfrut-s-myatoj-grapefruit-mint-250-gramm.jpg"
	},
	{
	   "title":"Mint Colussus",
	   "img":"https://dontabak.com.ua/1316-home_default/tabak-starbuzz-mint-kolossus-mint-colossus-250-gramm.jpg"
	},
	{
	   "title":"Gum",
	   "img":"https://dontabak.com.ua/1318-home_default/tabak-starbuzz-zhvachka-gum-250-gramm.jpg"
	},
	{
	   "title":"Caramel Apple",
	   "img":"https://dontabak.com.ua/1319-home_default/tabak-starbuzz-karamelnoe-yabloko-caramel-apple-250-gramm.jpg"
	},
	{
	   "title":"Caramel Macchiato",
	   "img":"https://dontabak.com.ua/1320-home_default/tabak-starbuzz-karamel-makiato-caramel-macchiato-250-gramm.jpg"
	},
	{
	   "title":"Cherry",
	   "img":"https://dontabak.com.ua/1321-home_default/tabak-starbuzz-vishnya-cherry-250-gramm.jpg"
	},
	{
	   "title":"Classic Cola",
	   "img":"https://dontabak.com.ua/1322-home_default/tabak-starbuzz-klassicheskaya-kola-classic-cola-250-gramm.jpg"
	},
	{
	   "title":"Double Apple",
	   "img":"https://dontabak.com.ua/1323-home_default/tabak-starbuzz-dvojnoe-yabloko-double-apple-250-gramm.jpg"
	},
	{
	   "title":"Fruit Sensation",
	   "img":"https://dontabak.com.ua/1324-home_default/tabak-starbuzz-fruktovaya-sensaciya-fruit-sensation-250-gramm.jpg"
	},
	{
	   "title":"Fuzzy Lemonade",
	   "img":"https://dontabak.com.ua/1325-home_default/tabak-starbuzz-myagkij-limonad-fuzzy-lemonade-250-gramm.jpg"
	},
	{
	   "title":"Passion Fruit Mojito",
	   "img":"https://dontabak.com.ua/1328-home_default/tabak-starbuzz-fruktovyj-mokhito-passion-fruit-mojito-250-gramm.jpg"
	},
	{
	   "title":"Peaches N Cream",
	   "img":"https://dontabak.com.ua/1329-home_default/tabak-starbuzz-slivochnyj-persik-peaches-n-cream-250-gramm.jpg"
	},
	{
	   "title":"Pineapple",
	   "img":"https://dontabak.com.ua/1330-home_default/tabak-starbuzz-ananas-pineapple-250-gramm.jpg"
	},
	{
	   "title":"Raspberry",
	   "img":"https://dontabak.com.ua/1332-home_default/tabak-starbuzz-malina-raspberry-250-gramm.jpg"
	},
	{
	   "title":"Pomegranate",
	   "img":"https://dontabak.com.ua/1333-home_default/tabak-starbuzz-granat-pomegranate-250-gramm.jpg"
	},
	{
	   "title":"Sour Apple",
	   "img":"https://dontabak.com.ua/1334-home_default/tabak-starbuzz-kisloe-yabloko-sour-apple-250-gramm.jpg"
	},
	{
	   "title":"Strawberry",
	   "img":"https://dontabak.com.ua/1335-home_default/tabak-starbuzz-klubnika-strawberry-250-gramm.jpg"
	},
	{
	   "title":"Strawberry Daiquiri",
	   "img":"https://dontabak.com.ua/1336-home_default/tabak-starbuzz-klubnichnyj-dajkiri-strawberry-daiquiri-250-gramm.jpg"
	},
	{
	   "title":"Vanilla",
	   "img":"https://dontabak.com.ua/1337-home_default/tabak-starbuzz-vanil-vanilla-250-gramm.jpg"
	},
	{
	   "title":"Watermelon",
	   "img":"https://dontabak.com.ua/1338-home_default/tabak-starbuzz-arbuz-watermelon-250-gramm.jpg"
	},
	{
	   "title":"Wild Berry",
	   "img":"https://dontabak.com.ua/1339-home_default/tabak-starbuzz-dikie-yagody-wild-berry-250-gramm.jpg"
	},
	{
	   "title":"Misty Apple",
	   "img":"https://dontabak.com.ua/1874-home_default/tabak-starbuzz-yablochnyj-tuman-misty-apple-250-gramm.jpg"
	},
	{
	   "title":"Peach ice Tea",
	   "img":"https://dontabak.com.ua/2907-home_default/tabak-starbuzz-kholodnyj-persikovyj-chaj-peach-ice-tea-250-gramm.jpg"
	},
	{
	   "title":"White Chai",
	   "img":"https://dontabak.com.ua/3182-home_default/tabak-starbuzz-belyj-chaj-white-chai-250-gramm.jpg"
	}
 ]

import { AggregatedProductsRestService } from '@rest/aggregated-products/aggregated-products.service';
import { AggregatedProductsService } from './../../shared/aggregated-products.service';

import { NgxImageEditorComponent } from '@components/ngx-image-editor/ngx-image-editor.component';

@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		ProductsRestService,
		CompaniesRestService,
		CategoriesRestService,
		ProductAttributesRestService,
		ProductLinesRestService,
		MarketProductsRestService,
		MarketsRestService,
		AggregatedProductsRestService,
		AggregatedProductsService,
		ImagesRestService
	]
})

export class DetailsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	@ViewChild(NgxImageEditorComponent) imageEditor: NgxImageEditorComponent;

	categories: CategoryDto[] = [];
	companies: CompanyDto[] = [];
	productLines: ProductLineDto[] = [];
	productAttributes: ProductAttributeDto[] = [];
	marketProducts: MarketProductDto[] = [];
	markets: MarketDto[] = [];

	showEditor = true;

	externalUrl = '';
	loading = false;
	item = new ProductDto();

	imageConfig = {
		ImageName: 'Some image',
		AspectRatios: ['4:3', '16:9'],
		ImageUrl: '',
		ImageType: 'image/jpeg'
	};

	constructor(
		private service: ProductsRestService,
		private companiesService: CompaniesRestService,
		private categoriesService: CategoriesRestService,
		private productAttributesService: ProductAttributesRestService,
		private productLinesService: ProductLinesRestService,
		private marketProductsService: MarketProductsRestService,
		private marketsService: MarketsRestService,
		private aggregatedProductsService: AggregatedProductsService,
		private imagesRestService: ImagesRestService,
		route: ActivatedRoute
	) {
		this.fetchCategories();
		this.fetchCompanies();
		this.fetchProductLines();
		this.fetchProductAttributes();
		this.fetchMarkets();

		this.sub = route.params.subscribe(params => {
			this.itemId = params.companyId;
			this.fetch();
			this.fetchMarketProducts();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	updateImageUrl() {
		this.showEditor = false;
		setTimeout(() => {
			this.showEditor = true;
		}, 100);
	}

	save() {
		this.imageEditor.getFile()
			.subscribe((file: any) => {
				this.imagesRestService.create(this.itemId, file)
					.subscribe(() => {
						this.item.logo = file.name;
						this.loading = true;
						this.service.update(this.item)
							.subscribe(
								d => {
									this.loading = false;
									this.item = d;
									this.aggregatedProductsService.aggregate(d._id.$oid);
								},
								e => this.loading = false
							);
					});
			});



		// f.map(i => {
		// 	const item = new ProductDto();
		// 	item.logo = i.img;
		// 	item.name = i.title;
		// 	item.mappingKeys = [{ value: i.title }];
		// 	item.categories = ['5ba762851f6e4f632c1409cc'];
		// 	item.company = '5bcdc2615d0e653d7ea675cc';
		// 	item.productLine = '5bcdc6111f6e4f697817b27b';
		// 	item.productAttributes = ['5ba7f2e95d0e654f94e44036'];
		// 	return item;
		// })
		// .forEach(i => {
		// 	console.log(i);
		// 	this.service.create(i)
		// 		.subscribe(
		// 			d => {},
		// 			e => this.loading = false
		// 		);
		// });


	}

	getProductLine(company: CompanyDto) {
		return this.productLines.filter(p => p.company === company._id.$oid);
	}

	getMarket(id: string) {
		return this.markets.find(p => p._id.$oid === id);
	}

	fetchMarkets() {
		this.marketsService.list()
			.subscribe(d => this.markets = d);
	}

	filterBySelected(companyId: string) {
		return this.companies.filter(c => c._id.$oid === companyId);
	}

	imageEditer(a: any) {
		console.log(a);

		this.imagesRestService.create(this.itemId, a)
			.subscribe(d => {
				console.log(d);
			});
	}

	getConfigs() {
		const company = this.companies.find(c => c._id.$oid === this.item.company);
		const productLine = this.productLines.find(pl => pl._id.$oid === this.item.productLine);

		let fileName = '';
		if (company) {
			fileName += this.makeR(company.name);
		}
		if (productLine) {
			fileName += '-' + this.makeR(productLine.name);
		}
		fileName += '-' + this.makeR(this.item.name);
		fileName += this.item.logo.match(/\.[A-z]{1,}$/g)[0];

		this.imageConfig.ImageName = encodeURI(fileName);
		this.imageConfig.ImageUrl = this.getImageUrl();
		return this.imageConfig;
	}

	makeR(str: string) {
		return str.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '');
	}

	private getImageUrl() {
		let url = this.externalUrl || this.item.logo;
		if (url.includes('http')) {
			url = 'http://localhost:3310/images/external/' + url;
		} else {
			url = 'http://localhost:3310/images/' + this.item._id.$oid;
		}
		return url;
	}

	private fetchMarketProducts() {
		this.marketProductsService
			.list({
				product: this.itemId
			})
			.subscribe(d => this.marketProducts = d);
	}

	private fetchCategories() {
		this.categoriesService.list()
			.subscribe(d => this.categories = d);
	}

	private fetchCompanies() {
		this.companiesService.list()
			.subscribe(d => this.companies = d);
	}

	private fetchProductLines() {
		this.productLinesService.list()
			.subscribe(d => this.productLines = d);
	}

	private fetchProductAttributes() {
		this.productAttributesService.list()
			.subscribe(d => this.productAttributes = d);
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
					// https://www.tornado-hs.com.ua/image/cache/data/Adalya/adalya%202/BAKU%20NIGHTS-140x150.jpg
					// this.item.name = '';
					// // this.item.logo = 'https://www.tornado-hs.com.ua/image/cache/data/Arkan/Arkan%20logo-140x150.jpg';
					// this.item.mappingKeys = [{ value: '' }];
					// this.item.categories = ['5ba762851f6e4f632c1409cc'];
					// this.item.company = '5bd30aec5d0e65692eda6bdf';
					// // this.item.productLine = '5bcdb4165d0e653d7ea65559';
					// this.item.productAttributes = ['5ba7f2e95d0e654f94e44036'];
				},
				e => this.loading = false
			);
	}
}
