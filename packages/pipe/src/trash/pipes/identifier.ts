export class Identifier {
	static lastId = 10;

	static generate() {
		Identifier.lastId = Identifier.lastId + 1;
		return Date.now().toString() + '_' + Identifier.lastId;
	}
}