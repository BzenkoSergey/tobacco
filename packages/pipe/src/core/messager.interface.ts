export interface Messager {
	(code: string, info: any): any;
}