import { DocumentDto } from './../shared';
import { PortalFilterDto } from './portal-filter.dto';

export class PortalSettingsDto implements DocumentDto {
	_id?: {
		$oid: string
	};
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
