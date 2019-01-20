export function match(value: string, add: string[]) {
    const result = value.match(new RegExp(add[0], 'i'));
	return result ? result[add[1]] : '';
}