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

		const pathCode = this.config[filePath];

		fs.readFile(pathCode, 'utf8', (err, data: string) => {
			if (err) {
				subj.error(err);
				return console.error(err);
			}
			console.log('Fetch from cache: ' + filePath);
			subj.next(data);
			subj.complete();
		})
		return subj;
	}

	createFile(filePath: string, content: string, subj?: Subject<string>) {
		subj = subj || new Subject<string>();
		if(!this.config) {
			this.sub.subscribe(() => {
				this.createFile(filePath, content, subj);
			});
			return subj;
		}

		const fileCode = this.config[filePath] || this.baseDir + '/' + Date.now().toString();
		this.config[filePath] = fileCode;

		fs.outputFile(fileCode, content, err => {
			if (err) {
				subj.error(err);
				return;
			}
			console.log('Cache save: ' + fileCode);
			this.saveConfig()
				.subscribe(
					() => {},
					err => subj.error(err),
					() => {
						subj.next(content);
						subj.complete();
					}
				);
		});
		return subj;
	}

	private saveConfig() {
		const subj = new Subject<never>();
		fs.outputFile(this.configPath, JSON.stringify(this.config), err => {
			if (err) {
				subj.error(err);
				return;
			}
			subj.next();
			subj.complete();
		});
		return subj;
	}

	private fetchConfig() {
		const subj = new Subject<{[key: string]: string}>();
		fs.readFile(this.configPath, 'utf8', (err, data: string) => {
			if (err) {
				subj.next({});
				subj.complete();
				return console.error(err);
			}
			console.log('Fetch cache config: ' + this.configPath);
			subj.next(JSON.parse(data));
			subj.complete();
		})
		return subj;
	}
}