import { DocumentDto } from './../shared';

export class GrabberSettingsDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	amount = 0;

	constructor(d?: GrabberSettingsDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.amount = d.amount;
	}
}
