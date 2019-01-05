export class UnitItemDto {
	_id: string;
	itemProcessedId: string;

	constructor(d?: UnitItemDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.itemProcessedId = d.itemProcessedId;
	}
}
