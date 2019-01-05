import { JobRegister } from './../job-register';
import { PipeType } from './pipe-type.enum';
import { Process } from './pipe-process.interface';
import { DIService } from './di';

export interface PipeInput {
	id: string,
	options: any,
	input: any;
	entityId: string,
	schemeId: string,
	processId?: string,
	type: PipeType,
	jobName: JobRegister;
	label: string;
	process: Process,
	children: PipeInput[],
	services: DIService[],
	path: string;
}