export type DBQueries = {
	query: any;
	modifiers?: {
		limit?: number;
		skip?: number;
		sort?: string;
	}
};
