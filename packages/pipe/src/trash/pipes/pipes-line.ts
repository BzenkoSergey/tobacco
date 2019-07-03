import { combineLatest, of, Observable, Subject, Subscription } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';

import { PipeGroup } from './pipes-group';
import { PipeStatus} from './status.enum';
import { RecoveryOptions } from './recovery-options';
import { PipeBase, ProcessBase } from './pipe.abstract';

/*
	Pipeline in database
	will converted to snapshot
	{
		_id,
		options,
		type,
		children: []
	}

*/
/*
	Create snapshot

	{
		id,
		productLine: id,
		options: any,
		process: {
			startDate,
			endDate,
			error,
			status,
			input,
			output
		},
		children: [
			{
				id,
				groupId,
				process: {
					startDate,
					endDate,
					error,
					status,
					input,
					output
				},
				pipes: [
					{
						id,
						pipeId,
						jobName: '',
						process: {
							startDate,
							endDate,
							error,
							status,
							input,
							output
						},
						children: []
					}
				],
				children: []
			}
		]
	}

	then run in order

	// partial run

	mark runnable items,
	and run
*/

interface GroupItem {
	id: string;
	order?: string,
	children: GroupItem[];
}

interface PipeGroupItem {
	group: PipeGroup;
	children: PipeGroupItem[];
	scheme: GroupItem;
}

interface Process extends ProcessBase {
	groups: GroupItem[]
}

export class PipesLine extends PipeBase<Process> {
	private stream = new Subject();
	private streams: Observable<any>[] = [];

	private subscribtion = new Subscription();
	private groupsIds = new Map<PipeGroup, PipeGroupItem>();
	private groupsIdsList = new Map<PipeGroupItem, PipeGroupItem[]>();

	private groupsScheme: GroupItem[] = [];
	private groupsInsts: PipeGroupItem[] = [];
	private groupsOrder = 0;

	private options: any;
	private recoveryOptions: RecoveryOptions;
	private restor = false;

	protected id: string;
	protected order = '1';
	protected process: Process;

	constructor(
		id: string,
		restor: boolean,
		recoveryOptions: RecoveryOptions
	) {
		super('pipes-line');
		this.id = id;
		this.recoveryOptions = recoveryOptions;
		this.restor = restor;
	}

	run() {
		return this.fetch()
			.pipe(
				tap(d => {
					this.options = d.options;
					this.groupsScheme = d.groups;
					this.processes = d.processes;
				}),
				mergeMap(() => {
					return this.defineProcess();
				}),
				tap(() => {
					this.groupsInsts = this.createPipeGroups(this.process.groups);
				}),
				catchError(e => this.handleError(e)),
				mergeMap(() => {
					this.process.startDate = Date.now();
					this.process.status = PipeStatus.IN_PROCESS;
					return this.update();
				}),
				catchError(e => this.handleError(e)),
				mergeMap(() => {
					const obs = this.runGroups(this.options, this.groupsInsts);
					this.addToStream(obs);
					return this.stream;
				}),
				catchError(e => this.handleError(e)),
				mergeMap(d => {
					this.process.endDate = Date.now();
					this.process.status = PipeStatus.DONE;
					return this.update()
						.pipe(
							mergeMap(() => of(d))
						);
				}),
				catchError(e => this.handleError(e))
			);
	}

	private defineProcess() {
		if (this.restor) {
			return this.defineExistsProcess(this.recoveryOptions.pipeLineProcessId);
		}

		const process: Process = {
			...this.createProcess(),
			input: '',
			output: '',
			groups: JSON.parse(JSON.stringify(this.groupsScheme))
		};
		return this.saveProcess(process);
	}

	protected defineExistsProcess(processId: string) {
		this.process = this.processes.find(p => {
			return p.id === processId && this.order === p.order;
		});
		return of(true);
	}

	private addToStream(obs: Observable<any>) {
		this.streams.push(obs);
		const sub = obs.subscribe(
			d => {
				this.stream.next(d);
			},
			e => {
				console.log(e);
				this.stream.error(e);
			},
			() => {
				this.streams.splice(0, 1);
				if (!this.streams.length) {
					this.stream.complete();
					this.subscribtion.unsubscribe();
				}
			}
		);
		this.subscribtion.add(sub);
	}

	private runGroups(options: any, groupItem: PipeGroupItem[]) {
		const subjs = groupItem.map(groupItem => {
			return this.runGroup(options, groupItem);
		});
		return combineLatest(...subjs);
	}

	private runGroup(options: any, groupItem: PipeGroupItem) {
		return groupItem.group.run(options)
			.pipe(
				mergeMap(d => {
					if (!groupItem.children.length) {
						return of(d);
					}
					return this.runGroups(d, groupItem.children);
				})
			);
	}

	private handleMessage(code: string, info: any) {
		if(code === 'REPEAT_GROUP') {
			this.addGroup(info.inst, info.info);
		}
		if(code === 'PROCESS_DEFINED') {
			console.log(info.info);
		}
	}

	private createPipeGroups(groupds: GroupItem[]) {
		const list: PipeGroupItem[] = [];
		groupds.forEach(g => {
			let recoveryOptions = {
				...this.recoveryOptions
			};
			if (this.restor) {
				const recoveryPipeGroupId = this.recoveryOptions.pipeGroupId || g.id;
				recoveryOptions.pipeGroupId = recoveryPipeGroupId;
			}
			const order = this.groupsOrder.toString();
			g.order = order;
			const group = new PipeGroup(
				g.id,
				order,
				(code: string, info: any) => {
					this.handleMessage(code, info);
				},
				this.process.id,
				recoveryOptions,
				this.restor
			);

			this.groupsOrder = this.groupsOrder + 1;
			const children = this.createPipeGroups(g.children);
			const info = {
				group: group,
				children: children,
				scheme: g
			};
			list.push(info);
			this.groupsIdsList.set(info, list);
			this.groupsIds.set(group, info);
		});
		return list;
	}

	private createPipeGroupsInfo(groupds: PipeGroupItem[]) {
		const list: GroupItem[] = [];
		groupds.forEach(g => {
			const children = this.createPipeGroupsInfo(g.children);
			const info = {
				id: g.group.getId(),
				children: children
			};
			list.push(info);
		});
		return list;
	}

	private addGroup(inst: PipeGroup, options: any) {
		const info = this.groupsIds.get(inst);
		if (!info) {
			console.error(12312312312);
			return;
		}
		const config = info.scheme;
		const child = this.createPipeGroups([config])[0];
		const list = this.groupsIdsList.get(info);
		this.groupsIdsList.set(child, list);
		const pos = list.indexOf(info);
		list.splice(pos, 0, child);

		this.process.groups = this.createPipeGroupsInfo(this.groupsInsts);
		const obs = this.runGroup(options, child);
		this.addToStream(obs);
	}
}