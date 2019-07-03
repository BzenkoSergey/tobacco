const months = [
	{
		k: 1,
		v: 'янв'// январь
	},
	{
		k: 2,
		v: 'фев'
	},
	{
		k: 3,
		v: 'мар' // Март
	},
	{
		k: 4,
		v: 'апр' // Апрель
	},
	{
		k: 5,
		v: 'ма' // Май
	},
	{
		k: 6,
		v: 'июн' // Июнь
	},
	{
		k: 7,
		v: 'июл' // Июль
	},
	{
		k: 8,
		v: 'авг' // Август
	},
	{
		k: 9,
		v: 'сен' // Сентябрь
	},
	{
		k: 10,
		v: 'окт' // Октябрь
	},
	{
		k: 11,
		v: 'ноя' // Ноябрь
	},
	{
		k: 12,
		v: 'дек' // Декабрь
	}
];

export function datefy(value: string) {
	const time = value.match(/[0-9]{2}:[0-9]{2}/ig)[0];
	value = value.replace(/[0-9]{2}:[0-9]{2}/ig, '');

	const today = !!~value.indexOf('Сегодня');
	const yesterday = !!~value.indexOf('чера');
	let year = '';
	let day = '';
	let month = '';

	if (today || yesterday) {
		const d = new Date();
		year = d.getFullYear().toString();
		day = d.getDate().toString();
		month = (d.getMonth() + 1).toString();
	}
	if (yesterday) {
		month = (+month - 1).toString();
		if (+month === 0) {
			month = '1';
		}
	}
	if (!today && !yesterday) {
		year = value.match(/[0-9]{4}/ig)[0];
		value = value.replace(/[0-9]{4}/ig, '');
	
		day = value.match(/[0-9]{1,}/ig)[0];
		value = value.replace(/[0-9]{4}/ig, '');
	
		month = months.find(m => !!~value.indexOf(m.v)).k.toString();
	}

	if (month.length === 1) {
		month = '0' + month;
	}
	if (day.length === 1) {
		day = '0' + day;
	}

	const date = year + '-' + month + '-' + day + 'T' + time + ':00';
	return new Date(date).getTime();
}