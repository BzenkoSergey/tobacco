export function match(value: string, add: string[]) {
    const result = value.match(new RegExp(add[0], 'i'));
	return result ? result[add[1]] : '';
}


// var a = 'https://www.google.com.ua/search?q=%D1%82%D0%B0%D0%B1%D0%B0%D0%BA+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%B0%D0%BB%D1%8C%D1%8F%D0%BD%D0%B0&start=90'
// var b = 'https://www.google.com.ua/search?q=%D1%82%D0%B0%D0%B1%D0%B0%D0%BA+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%B0%D0%BB%D1%8C%D1%8F%D0%BD%D0%B0'
// a.match(new RegExp('(q=)(.*)+&'))
// b.match(new RegExp('(q=)(.*)+&'))