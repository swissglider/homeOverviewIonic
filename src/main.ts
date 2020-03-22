import { enableProdMode, ApplicationRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableDebugTools } from '@angular/platform-browser';
import { enableAkitaProdMode, persistState } from '@datorama/akita';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
} else {
  persistState({
    key: 'homeoverview',
    include: ['ErrorMsgState']
  });
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));



platformBrowserDynamic().bootstrapModule(AppModule)
  .then(moduleRef => {
    const applicationRef = moduleRef.injector.get(ApplicationRef);
    const componentRef = applicationRef.components[0];
    // allows to run `ng.profiler.timeChangeDetection();`
    if (!environment.production){
      enableDebugTools(componentRef);
    }
  })
  .catch(err => console.log(err));
