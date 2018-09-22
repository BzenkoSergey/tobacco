import { Mongo } from './../shared';
import { CompanyDto } from './company.dto';

export class CompaniesRestService extends Mongo<CompanyDto> {
	constructor() {
		super('companies');
	}

	protected handleResponse(d: CompanyDto): CompanyDto {
		return new CompanyDto(d);
	}
}
