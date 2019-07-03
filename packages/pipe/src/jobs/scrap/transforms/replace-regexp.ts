export function replaceRegexp(value: string, add: string[]) {
	const r = value.replace(new RegExp(add[0], 'ig'), add[1]);
	return r;
}