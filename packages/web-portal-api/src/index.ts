import * as cors from 'cors';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { MarketsRouting } from './markets';
import { CompaniesRouting } from './companies';
import { CategoriesRouting } from './categories';
import { ProductsRouting } from './products';
import { ProductLinesRouting } from './product-lines';
import { ProductAttributesRouting } from './product-attributes';
import { MarketProductsRouting } from './market-products';
import { SearchRouting } from './search';
import { router } from './settings/settings.service';

var app = express();
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors({
	origin: ['http://localhost:4200', 'http://localhost:2000'],
	optionsSuccessStatus: 200,
	credentials: true
}));


app.use(new MarketsRouting().getRouter());
app.use(new CompaniesRouting().getRouter());
app.use(new CategoriesRouting().getRouter());
app.use(new ProductsRouting().getRouter());
app.use(new ProductLinesRouting().getRouter());
app.use(new ProductAttributesRouting().getRouter());
app.use(new MarketProductsRouting().getRouter());
app.use(new SearchRouting().getRouter());
app.use(router);

app.listen(5000, function () {
	console.log('Example app listening on port 3000!');
});