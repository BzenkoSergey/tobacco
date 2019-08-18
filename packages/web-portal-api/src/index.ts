import * as cors from 'cors';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import * as compression from 'compression';

// import { MarketsRouting } from './markets';
// import { CompaniesRouting } from './companies';
// import { CategoriesRouting } from './categories';
import { ProductsRouting } from './products';
import { SitemapRouting } from './sitemap';
// import { ProductLinesRouting } from './product-lines';
// import { ProductAttributesRouting } from './product-attributes';
// import { MarketProductsRouting } from './market-products';
import { SearchRouting } from './search';
import { router } from './settings/settings.service';
import { MenuRouting } from './menu/menu.service';
import { WikiRouting } from './wiki/wiki-routing';
import { MixesRouting } from './mixes/mixes-routing';
import { AnalyticsRouting } from './analytics/analytics-routing';
import { ReviewsRouting } from './reviews/reviews-routing';

var app = express();
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors({
	origin: [
		'http://localhost:4200',
		'http://localhost:2000',
		'http://localhost:3000',
		'http://104.248.47.42:2000',
		'http://hoogle.com.ua',
		'http://www.hoogle.com.ua',
		'https://hoogle.com.ua',
		'https://www.hoogle.com.ua'
	],
	optionsSuccessStatus: 200,
	credentials: true
}));
app.use(compression());

// app.use(new MarketsRouting().getRouter());
// app.use(new CompaniesRouting().getRouter());
// app.use(new CategoriesRouting().getRouter());
app.use(new MenuRouting().getRouter());
app.use(new ProductsRouting().getRouter());
// app.use(new ProductLinesRouting().getRouter());
// app.use(new ProductAttributesRouting().getRouter());
// app.use(new MarketProductsRouting().getRouter());
app.use(new SearchRouting().getRouter());
app.use(new SitemapRouting().getRouter());
app.use(new WikiRouting().getRouter());
app.use(new MixesRouting().getRouter());
app.use(new AnalyticsRouting().getRouter());
app.use(new ReviewsRouting().getRouter());

app.use(router);

app.listen(5000, '0.0.0.0', function () {
	console.log('Example app listening on port 5000!');
});