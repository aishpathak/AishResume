import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CosysRootModule } from './app/cosys.module';
import { Environment } from './environments/environment';

//if (Environment.production) {
  enableProdMode();
//}

platformBrowserDynamic().bootstrapModule(CosysRootModule);
