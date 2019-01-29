export class Session {
	private session: string|null = null;

	get() {
		if (!this.session) {
			this.session = Date.now().toString();
		}
		return this.session;
	}
}