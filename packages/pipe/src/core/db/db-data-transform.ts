export abstract class DBDataTransform {
	abstract fromDb(d: any): any;
	abstract toDb(d: any): any;
}