import { PipeStatus } from './pipe-status.enum';

export interface Process {
	createdTime: number,
	startDate: number,
	endDate: number,
	error: string,
	status: PipeStatus,
	input: any,
	output: any
}
