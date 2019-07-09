export enum PipeMode {
	DB_NO_SYNC = 'DB_NO_SYNC',
	DB_SYNC_ON_ERROR = 'DB_SYNC_ON_ERROR',
	DB_SYNC_ON_IN_PROCESS = 'DB_SYNC_IN_PROCESS',
	DB_SYNC_ON_DONE = 'DB_SYNC_ON_DONE',
	DB_BRANCHES_SYNC_ON_DONE = 'DB_BRANCHES_SYNC_ON_DONE',
	RUN_ONCE = 'RUN_ONCE',
	SCHEME_TO_CLONE = 'SCHEME_TO_CLONE',
	AVOID_OUTPUT = 'AVOID_OUTPUT'
}