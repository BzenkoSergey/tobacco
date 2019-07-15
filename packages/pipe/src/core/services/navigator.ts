import { PipeDb } from '../pipe/pipe-db';
import { PipeType } from '../pipe/pipe-type.enum';

export class Navigator {
	private pipesPaths = new Map<PipeDb, string>();
	private pathsPipes = new Map<string, PipeDb>();
	private groups = new Map<string, PipeDb>();
	private line: PipeDb

	constructor() {
		// console.log('nnnnnnnnnnnnnnnnnnn');
	}

	add(path: string, pipe: PipeDb) {
		this.pathsPipes.set(path, pipe);
		this.pipesPaths.set(pipe, path);
		if (pipe.getType() === PipeType.GROUP) {
			this.groups.set(path, pipe);
		}
		if (pipe.getType() === PipeType.LINE) {
			this.line = pipe;
		}
	}

	getChildOf(parent: PipeDb, subChild: PipeDb) {
		const subChildPath = this.pipesPaths.get(subChild);
		return (parent.getChildren() as PipeDb[])
			.find(c => {
				const path = this.pipesPaths.get(c);
				return subChildPath.startsWith(path);
			});
	}

	getPipe(path: string) {
		return this.pathsPipes.get(path);
	}

	getParentOf(path: string) {
		const segments = path.split('.');
		const parent = segments.slice(0, segments.length - 2).join('.');
		return this.getPipe(parent);
	}

	getParentGroup(childPath: string) {
		const parents = Array.from(this.groups)
			.filter(d => {
				const path = d[0];
				return childPath.startsWith(path);
			})
			.sort((a, b) => {
				return b[0].length - a[0].length;
			})
			.map(a => a[1]);
		
		return parents[0];
	}
}