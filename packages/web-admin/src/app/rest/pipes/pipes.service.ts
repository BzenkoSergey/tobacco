import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PipesRestService {
	constructor(private http: HttpClient) {}

	getProcess(processId: string) {
		const url = this.apiUrl() + '/get/process/' + processId;
		return this.http.get<any>(url);
	}

	runProcess(processId: string) {
		const url = this.apiUrl() + '/process/' + processId;
		return this.http.get<any[]>(url);
	}

	runProcessPaths(processId: string, paths: string[]) {
		const url = this.apiUrl() + '/process/' + processId + '/paths/' + paths.join(',');
		return this.http.get<any[]>(url);
	}

	runScheme(schemeId: string) {
		const url = this.apiUrl() + '/scheme/' + schemeId;
		return this.http.get<any[]>(url);
	}

	runSchemeOptions(schemeId: string, options: any) {
		const url = this.apiUrl() + '/scheme/' + schemeId + '/options';
		return this.http.post<any>(url, options);
	}

	getSchemeProcesses(schemeId: string) {
		const url = this.apiUrl() + '/get/scheme/' + schemeId + '/processes';
		return this.http.get<any[]>(url);
	}

	// getProcessData(processDateId: string) {
	// 	const url = this.apiUrl() + '/get/process-data/' + processDateId;
	// 	const httpOptions: any = {
	// 		responseType: 'text'
	// 	};
	// 	return this.http.get<any[]>(url, httpOptions);
	// }

	getSchemes() {
		const url = this.apiUrl() + '/get/scheme';
		return this.http.get<any[]>(url);
	}

	getScheme(id: string) {
		const url = this.apiUrl() + '/get/scheme/' + id;
		return this.http.get<any[]>(url);
	}

	saveScheme(id: string, body: any) {
		const url = this.apiUrl() + '/get/scheme/' + id;
		return this.http.post<any[]>(url, body);
	}

	createScheme(body: any) {
		const url = this.apiUrl() + '/get/scheme';
		return this.http.post<any[]>(url, body);
	}

	getPipes() {
		const url = this.apiUrl() + '/pipes';
		return this.http.get<any[]>(url);
	}

	getPipesLine() {
		const url = this.apiUrl() + '/pipes-line';
		return this.http.get<any[]>(url);
	}

	getPipesGroup() {
		const url = this.apiUrl() + '/pipes-group';
		return this.http.get<any[]>(url);
	}

	restartPipe(pipeLineId: string, processId: string, pipeProcessId: string) {
		const url = this.apiUrl() + '/pipes-line/' + pipeLineId + '/process/' + processId + '/pipe-process/' + pipeProcessId;
		return this.http.get<any[]>(url);
	}

	restartGroup(pipeLineId: string, processId: string, groupId: string, groupProcessId: string) {
		const url = this.apiUrl() + '/pipes-line/' + pipeLineId + '/process/' + processId + '/group/' + groupId + '/group-process/' + groupProcessId;
		return this.http.get<any[]>(url);
	}


	private apiUrl() {
		return `http://` + window.location.hostname + `:3330`;
	}
}
