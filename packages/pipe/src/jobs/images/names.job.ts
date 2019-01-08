import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { MongoExtDb } from './../../core/db-ext';
import { Job } from './../job.interface';

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

					return this.getlines(linesIds)
						.pipe(
							map(lines => {
								console.log(3);
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
		return str.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
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