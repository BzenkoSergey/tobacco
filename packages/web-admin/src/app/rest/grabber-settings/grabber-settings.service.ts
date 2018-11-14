import { Mongo } from './../shared';
import { GrabberSettingsDto } from './grabber-settings.dto';

export class GrabberSettingsRestService extends Mongo<GrabberSettingsDto> {
	constructor() {
		super('grabber-settings');
	}

	protected handleResponse(d: GrabberSettingsDto): GrabberSettingsDto {
		return new GrabberSettingsDto(d);
	}
}
