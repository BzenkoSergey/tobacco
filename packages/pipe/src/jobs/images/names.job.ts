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

	run(data: Input): Observable<string[]> {
		const unitIds = data.unitIds;

		return this.getUnits(unitIds)
			.pipe(
				mergeMap(units => {
					const companiesIds = units
						.map(u => u.company)
						.filter(u => !!u);

					return this.getCompanies(companiesIds)
						.pipe(
							map(companies => {
								return [units, companies];
							})
						);
				}),
				mergeMap(d => {
					const units = d[0];
					const companies = d[1];

					const linesIds = units
						.map(u => u.productLine)
						.filter(u => !!u);

					return this.getlines(linesIds)
						.pipe(
							map(lines => {
								return [units, companies, lines];
							})
						);
				}),
				map(d => {
					const units = d[0] || [];
					const companies = d[1] || [];
					const lines = d[2] || [];

					return units.map(u => {
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
			.findOne({
				$in: unitIds.map(i => ObjectId(i))
			})
	}

	private getlines(linesIds: string[]) {
		return new MongoExtDb('product-lines', true)
			.findOne({
				_id: linesIds.map(i => ObjectId(i))
			})
	}

	private getCompanies(companiesIds: string[]) {
		return new MongoExtDb('companies', true)
			.findOne({
				$in: companiesIds.map(i => ObjectId(i))
			})
	}
}