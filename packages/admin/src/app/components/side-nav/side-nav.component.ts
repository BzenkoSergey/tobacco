import { Component, HostBinding } from '@angular/core';

@Component({
	selector: 'side-nav',
	templateUrl: './side-nav.html',
	styleUrls: ['./side-nav.scss']
})
export class SideNavComponent {
	@HostBinding('class.opened') opened = false;
}
