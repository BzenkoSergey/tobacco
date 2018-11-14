import { DocumentDto } from './../shared';

export class ProductSearchDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	query: string;
	product: string;

	constructor(d?: ProductSearchDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.query = d.query;
		this.product = d.product;
	}
}
