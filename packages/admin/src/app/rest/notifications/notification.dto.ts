export class NotificationDto {
	_id: string;
	code: string;
	data: string;
	read = false;
	readDate: string;
	createdDate: string;

	constructor(d?: NotificationDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.code = d.code;
		this.data = d.data;
		this.read = d.read;
		this.readDate = d.readDate;
		this.createdDate = d.createdDate;
	}
}
