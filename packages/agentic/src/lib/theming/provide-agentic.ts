import {
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import type { BuildThemeOptions, Preset } from '@aaronch/agentic-themes';
import { AgenticThemeService } from './agentic-theme.service';

export interface AgenticThemeConfig {
  /** Preset to apply. Defaults to `Base` from `@aaronch/agentic-themes`. */
  preset?: Preset;
  /** `'class'` (default) toggles dark mode via a selector; `'media'` uses prefers-color-scheme. */
  darkMode?: BuildThemeOptions['darkMode'];
  /** Selector for class-based dark mode. Default `.agt-dark`. */
  darkModeSelector?: string;
}

export interface AgenticConfig {
  theme?: AgenticThemeConfig;
}

/**
 * Root provider for the agentic UI kit. Injects the theme on app bootstrap.
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideAgentic({ theme: { preset: Aurora, darkModeSelector: '.app-dark' } })],
 * });
 * ```
 */
export function provideAgentic(config: AgenticConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      inject(AgenticThemeService).configure(config.theme?.preset, {
        darkMode: config.theme?.darkMode,
        darkSelector: config.theme?.darkModeSelector,
      });
    }),
  ]);
}
