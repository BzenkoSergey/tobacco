import * as fs from 'fs-extra';
import * as path from 'path';

import { Subject } from 'rxjs';

export class CacheService {
	private baseDir = path.resolve(__dirname, './../../') + '/_cache';
	private configPath = this.baseDir + '/config.json';
	private config: {[key: string]: string};
	private sub: Subject<{[key: string]: string}>;

	constructor() {
		this.sub = this.fetchConfig();
		this.sub.subscribe(d => this.config = d);
	}

	fetch(filePath: string, subj?: Subject<string>) {
		subj = subj || new Subject<string>();

		if(!this.config) {
			this.sub.subscribe(() => {
				this.fetch(filePath, subj);
			});
			return subj;
		}

		// let path = this.baseDir + filePath.replace(/(https:\/)|(http:\/)/, '');
		// if(path.lastIndexOf('/') === path.length - 1) {
		// 	path = path.slice(0, path.length - 1)
		// }
		// path = path  + '.g';

		const pathCode = this.config[filePath];

		fs.readFile(pathCode, 'utf8', (err, data: string) => {
			if (err) {
				subj.error(err);
				return console.error(err);
			}
			console.log('Cache: ' + filePath);
			subj.next(data);
			subj.complete();
		})
		return subj;
	}

	createFile(filePath: string, content: string) {
		if(!this.config) {
			this.sub.subscribe(() => {
				this.createFile(filePath, content);
			});
			return;
		}
		// let path = this.baseDir + filePath.replace(/(https:\/)|(http:\/)/, '');
		// if(path.lastIndexOf('/') === path.length - 1) {
		// 	path = path.slice(0, path.length - 1)
		// }
		// path = path + '.g';
		const fileCode = this.config[filePath] || this.baseDir + '/' + Date.now().toString();
		this.config[filePath] = fileCode;
		console.log('Cache save: ' + fileCode);
		fs.outputFileSync(fileCode, content);
		this.saveConfig();
	}

	private saveConfig() {
		fs.outputFileSync(this.configPath, JSON.stringify(this.config));
	}

	private fetchConfig() {
		const subj = new Subject<{[key: string]: string}>();
		fs.readFile(this.configPath, 'utf8', (err, data: string) => {
			if (err) {
				subj.next({});
				subj.complete();
				return console.error(err);
			}
			console.log('Cache: ' + this.configPath);
			subj.next(JSON.parse(data));
			subj.complete();
		})
		return subj;
	}
}