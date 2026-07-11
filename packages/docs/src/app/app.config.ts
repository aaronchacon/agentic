import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { withInMemoryScrolling } from '@angular/router';
import { AgenticThemeService, provideAgentic } from '@aaronch/agentic';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([requestContextInterceptor])),
    provideAgentic({ theme: { darkModeSelector: '.dark' } }),
    // Default the docs site to dark mode (SSR + client, no flash).
    provideEnvironmentInitializer(() => inject(AgenticThemeService).toggleDarkMode(true)),
  ],
};
