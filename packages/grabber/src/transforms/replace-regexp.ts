export function replaceRegexp(value: string, add: string[]) {
	return value.replace(new RegExp(add[0], 'ig'), add[1]);
}