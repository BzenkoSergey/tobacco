import { Observable } from 'rxjs';

export function async<T>(d?: any): Observable<T> {
	return Observable.create(subscriber => {
		setTimeout(() => {
			subscriber.next(d);
			subscriber.complete();
		}, 0);
	});
}