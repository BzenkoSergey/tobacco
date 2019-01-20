export function replace(value: string, add: string[]) {
	console.log(value, add[0], add[1]);
	return value.replace(add[0], add[1]);
}