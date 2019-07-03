export interface ProcessPipeInput {
	_id?: string,
	entityId?: string,
	id: string,
	children: ProcessPipeInput[],
	createdDate: string
}