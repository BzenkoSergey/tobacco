import { Mongo } from '@rest/shared';
import { PortalSettingsDto } from '@rest/portal-settings/portal-settings.dto';

export class PortalSettingsRestService extends Mongo<PortalSettingsDto> {
	constructor() {
		super('portal-settings');
	}

	protected handleResponse(d: PortalSettingsDto): PortalSettingsDto {
		return new PortalSettingsDto(d);
	}
}
