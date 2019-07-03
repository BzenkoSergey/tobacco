import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { MongoExtDb } from '../../core/trash/db-ext';
import { Job } from './../job.interface';
import { async } from './../../async';

type Input = {
	unitIds: string[];
};

export class ImageNamesJob implements Job {
	setSchemeId() {
		return this;
	}

	setDI() {
		return this;
	}

	setPipePath() {
		return this;
	}

	setStaticOptions() {
		return this;
	}

	destroy() {
		return this;
	}

	run(data: Input): Observable<any> {
		const unitIds = data.unitIds;
		console.log(unitIds);

		return this.getUnits(unitIds)
			.pipe(
				mergeMap(units => {
					console.log(0);
					const companiesIds = units
						.map(u => u.company)
						.filter(u => !!u);

						console.log(companiesIds);
					return this.getCompanies(companiesIds)
						.pipe(
							map(companies => {
								console.log(1);
								return [units, companies];
							})
						);
				}),
				mergeMap(d => {
					console.log(2);
					const units = d[0];
					const companies = d[1];

					const linesIds = units
						.map(u => u.productLine)
						.filter(u => !!u);

					console.log('=====\\\\', linesIds);
					return this.getlines(linesIds)
						.pipe(
							map(lines => {
								return [units, companies, lines];
							})
						);
				}),
				map(d => {
					console.log(4);
					const units = d[0] || [];
					const companies = d[1] || [];
					const lines = d[2] || [];

					const a = units.map(u => {
						const company = companies.find(c => c._id.toString() === u.company);
						const line = lines.find(l => l._id.toString() === u.productLine);

						console.log(line, u.productLine);
						let name = this.makeReadable(u.name);
						if (line) {
							name = this.makeReadable(line.name) + '_' + name;
						}
						if (company) {
							name = this.makeReadable(company.name) + '_' + name;
						}
						return name;
					});
					console.log(5);
					return {
						...data,
						names: a
					}
				})
			);
	}

	makeReadable(str: string) {
		str = this.rus_to_latin(str);
		return str.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
	}

	rus_to_latin (str: string) {
		if (!str.match(/[А-я]/g)) {
			return str;
		}
		var ru = {
			'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
			'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
			'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
			'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
			'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
			'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
		}, n_str = [];
		
		str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
		
		for ( var i = 0; i < str.length; ++i ) {
		   n_str.push(
				  ru[ str[i] ]
			   || ru[ str[i].toLowerCase() ] == undefined && str[i]
			   || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
		   );
		}
		
		return n_str.join('');
	}

	private getUnits(unitIds: string[]) {
		return new MongoExtDb('products', true)
			.find({
				_id: {
					$in: unitIds.map(i => ObjectId(i))
				}
			})
	}

	private getlines(linesIds: string[]) {
		if (!linesIds || !linesIds.length) {
			return async<any>([]);
		}
		return new MongoExtDb('product-lines', true)
			.find({
				_id: {
					$in: linesIds.map(i => ObjectId(i))
				}
			})
	}

	private getCompanies(companiesIds: string[]) {
		return new MongoExtDb('companies', true)
			.find({
				_id: {
					$in: companiesIds.map(i => ObjectId(i))
				}
			})
	}
}