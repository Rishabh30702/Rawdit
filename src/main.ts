/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
