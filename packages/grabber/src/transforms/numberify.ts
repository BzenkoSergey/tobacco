export function numberify(value: string) {
	if (value.includes('.') && value.includes(',')) {
		value = value.replace(/,/g, '');
	}
	return +value.replace(/\,/gi, '.').replace(/[^0-9\.]/gi, '');
}