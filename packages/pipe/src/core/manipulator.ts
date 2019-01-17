import { combineLatest } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { async } from './../async';

import { PipeBase } from './pipe-base';
import { Pipe } from './pipe';

export class Manipulator {
	repeat(parent: PipeBase, child: PipeBase, input: any, isDirectChild = true) {
		const toProcessChildren = parent.getChildren();
		return async<Pipe[]>(toProcessChildren)
			.pipe(
				mergeMap(children => {
					if (!children.length) {
						return async(false);
					}
					return async<Pipe[]>(children)
						.pipe(
							mergeMap(children => {
								const obs = children.map(c => {
									const options = c.getInput();
									if (options) {
										return async(options);
									}
									return c.getProcessInput();
								})
								return combineLatest(...obs);
							}),
							map(options => {
								// debugger;
								return options.some(o => {
									// debugger;
									if (Array.isArray(o)) {
										// console.log('SSSSSSSSSSS1', o, input)
										return false;
									}
									if (typeof o === 'object' && o !== null) {
										// console.log('SSSSSSSSSSS2', o, input)
										return Object.keys(o || {})
											.every(prop => {
												return o[prop] === input[prop];
											});
									}

									// debugger;
									// console.log('SSSSSSSSSSS3', options, input)
									return o === input;
								});
							})
						);
				}),
				mergeMap(status => {
					if (status) {
						console.log('Manipulator: cant reapeat');
						return async(false);
					}

					console.log('Manipulator: reapeat', child.getPath());
					return parent.cloneChild(child.getPath(), input, isDirectChild);
					// return async(true);
				})
			);
	}

	repeatOrPerform(parent: PipeBase, child: PipeBase, input: any, isDirectChild = true, field = '') {
		const toProcessChildren = parent.getChildren();
		return async<Pipe[]>(toProcessChildren)
			.pipe(
				mergeMap(children => {
					if (!children.length) {
						return async(false);
					}
					return async<Pipe[]>(children)
						.pipe(
							mergeMap(children => {
								const obs = children.map(c => {
									const options = c.getInput();
									if (options) {
										return async<[any, any]>([options, c]);
									}
									return c.getProcessInput()
										.pipe(
											map(d => {
												return [d, c];
											})
										);
								})
								return combineLatest(...obs);
							}),
							map(options => {
								return options.find(d => {

									const o = d[0];
									if (typeof input === 'string') {
										return o === input;
									}
									if (Array.isArray(o)) {
										return false;
									}
									if (typeof o === 'object' && o !== null) {
										if (field && field !== '*') {
											return o[field] === input[field];
										}
										return Object.keys(o || {})
											.every(prop => {
												return o[prop] === input[prop];
											});
									}

									return o === input;
								});
							})
						);
				}),
				mergeMap(d => {
					if (d) {
						console.log('Manipulator: cant reapeat');
						d[1].setDelayInput(input);
						console.log('RUN WITH', input, d[1]);
						return async(true);
					}
			
					console.log('Manipulator: reapeat', child.getPath());
					return parent.cloneChild(child.getPath(), input, isDirectChild);
					// return async(true);
				})
			);
	}
}