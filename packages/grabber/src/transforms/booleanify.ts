export function booleanify(value: string, falseValue: string) {
	value = value.trim();
	return value !== falseValue;
}