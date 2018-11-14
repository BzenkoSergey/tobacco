import { GrabberInputDto } from './input.dto';

export class GrabberJob {
	id: string;
	config: GrabberInputDto;
	cron: string;

	constructor(d?: GrabberJob) {
		if (!d) {
			return;
		}
		this.id = d.id;
		this.config = new GrabberInputDto(d.config);
		this.cron = d.cron;
	}
}