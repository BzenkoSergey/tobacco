import { Observable } from 'rxjs';
import { PipeInjector } from './../core/pipe-injector.interface';
import { Messager } from './../core/messager.interface';	
import { DI } from './../core/di';

export interface JobConstructor {
	new (options: any, injector?: PipeInjector, messager?: Messager): Job;
}

export interface Job {
	run(d?: any): Observable<any>;
	setDI(di: DI): this;
	setPipePath(path: string): this;
	setStaticOptions(options: any): this;
	setSchemeId(schemeId: string): this;
	destroy(): this;
}