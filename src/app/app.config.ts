import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';


import { routes } from './app.routes';
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";

import { provideAnimations } from '@angular/platform-browser/animations';
import { headerInterceptor } from './core/interceptors/header-interceptor';
// ...existing code...

export const appConfig: ApplicationConfig = {
  providers: [

   provideZoneChangeDetection({ eventCoalescing: true }),
     provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en'
    }),

    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideToastr(),
    
// ...existing code...
  ]
};
