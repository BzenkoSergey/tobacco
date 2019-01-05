export class Store {
	private map = new Map<string, any>();

	set(key: string, value: any) {
		this.map.set(key, value);
	}

	get(key: any) {
		return this.map.get(key);
	}
}