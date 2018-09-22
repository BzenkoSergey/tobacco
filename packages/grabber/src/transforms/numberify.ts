export function numberify(value: string) {
	return +value.replace(/\,/gi, '.').replace(/[^0-9\.]/gi, '');
}