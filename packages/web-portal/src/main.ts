import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { RootModule } from './app/containers/root.module';
import { environment } from './environments/environment';


// import { ɵrenderComponent as renderComponent } from '@angular/core';

// renderComponent(RootModule);

if (environment.production) {
	enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
	platformBrowserDynamic()
		.bootstrapModule(RootModule)
		.catch(err => console.log(err));
});


