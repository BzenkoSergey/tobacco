import * as cors from 'cors';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { CategoriesRoute } from './routes/categories/categories.route';
import { CompaniesRoute } from './routes/companies/companies.route';
import { GrabberSettingsRoute } from './routes/grabber-settings/grabber-settings.route';
import { MarketProductsRoute } from './routes/market-products/market-products.route';
import { MarketsRoute } from './routes/markets/markets.route';
import { ProductAttributesRoute } from './routes/product-attributes/product-attributes.route';
import { ProductLinesRoute } from './routes/product-lines/product-lines.route';
import { ProductsRoute } from './routes/products/products.route';

var app = express();
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors({
	origin: ['http://localhost:4100', 'http://192.168.0.175:4100'],
	optionsSuccessStatus: 200,
	credentials: true
}));

app.use(new CategoriesRoute().getRouter());
app.use(new CompaniesRoute().getRouter());
app.use(new GrabberSettingsRoute().getRouter());
app.use(new MarketProductsRoute().getRouter());
app.use(new MarketsRoute().getRouter());
app.use(new ProductAttributesRoute().getRouter());
app.use(new ProductLinesRoute().getRouter());
app.use(new ProductsRoute().getRouter());

app.listen(3320, '0.0.0.0', function () {
	console.log('Example app listening on port 3300!');
});