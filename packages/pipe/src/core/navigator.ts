import { PipeBase } from './pipe-base';
import { PipeType } from './pipe-type.enum';

export class Navigator {
	private pipesPaths = new Map<PipeBase, string>();
	private pathsPipes = new Map<string, PipeBase>();
	private groups = new Map<string, PipeBase>();
	private line: PipeBase

	constructor() {
		// console.log('nnnnnnnnnnnnnnnnnnn');
	}

	add(path: string, pipe: PipeBase) {
		this.pathsPipes.set(path, pipe);
		this.pipesPaths.set(pipe, path);
		if (pipe.getType() === PipeType.GROUP) {
			this.groups.set(path, pipe);
		}
		if (pipe.getType() === PipeType.LINE) {
			this.line = pipe;
		}
	}

	getChildOf(parent: PipeBase, subChild: PipeBase) {
		const subChildPath = this.pipesPaths.get(subChild);
		return parent.getChildren()
			.find(c => {
				const path = this.pipesPaths.get(c);
				return subChildPath.startsWith(path);
			});
	}

	getPipe(path: string) {
		return this.pathsPipes.get(path);
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