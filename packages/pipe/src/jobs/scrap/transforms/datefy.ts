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
	if (value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
		return new Date(value).getTime();
	}
	const r = value.match(/[0-9]{2}:[0-9]{2}/ig);
	const d = new Date();
	let hours = d.getHours() + '';
	let minutes = d.getMinutes() + '';
	hours = hours.length === 1 ? '0' + hours : hours;
	minutes = minutes.length === 1 ? '0' + minutes : minutes;
	const time = r ? r[0] : hours + ':' + minutes;
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
		const yearRes = value.match(/[0-9]{4}/ig);
		year = yearRes ? yearRes[0] : null;
		if (!year) {
			const d = new Date();
			year = d.getFullYear().toString();
		}
		value = value.replace(/[0-9]{4}/ig, '');
	
		const dayRes = value.match(/[0-9]{1,}/ig);
		day = dayRes ? dayRes[0] : null;
		value = value.replace(/[0-9]{4}/ig, '');
		value = value.replace(/[0-9]{2}/ig, '');

		const mRes = months.find(m => !!~value.indexOf(m.v));
		month = mRes ? mRes.k.toString() : null;
	}

	if (month && month.length === 1) {
		month = '0' + month;
	}
	if (day && day.length === 1) {
		day = '0' + day;
	}
	if (!year || !month || !day) {
		return null;
	}


	const date = year + '-' + month + '-' + day + 'T' + time + ':00';
	return new Date(date).getTime();
}