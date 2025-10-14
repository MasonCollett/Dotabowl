/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()) // <-- new recommended way
  ]
}).catch(err => console.error(err));
