import { PortalFilterDto } from './filter.dto';

export class PortalSettingsDto {
	_id: string;
	filters: PortalFilterDto[] = [];

	constructor(d?: PortalSettingsDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		if (d.filters) {
			this.filters = d.filters.map(f => new PortalFilterDto(f));
		}
	}
}
