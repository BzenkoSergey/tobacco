import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
	selector: '[clickOutside]'
})
export class ClickOutsideDirective {
	@Output() clickOutside: EventEmitter<any> = new EventEmitter();

	@HostListener('document:click', ['$event.target']) onMouseEnter() {
		this.clickOutside.emit(null);
	}
}
