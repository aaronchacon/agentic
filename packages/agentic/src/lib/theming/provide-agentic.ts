import {
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import type { BuildThemeOptions, Preset } from '@ng-agentic/themes';
import { AGT_LABELS, type AgtLabelsInput } from '../core/labels';
import { AgenticThemeService } from './agentic-theme.service';

export interface AgenticThemeConfig {
  /** Preset to apply. Defaults to `Base` from `@ng-agentic/themes`. */
  preset?: Preset;
  /** `'class'` (default) toggles dark mode via a selector; `'media'` uses prefers-color-scheme. */
  darkMode?: BuildThemeOptions['darkMode'];
  /** Selector for class-based dark mode. Default `.agt-dark`. */
  darkModeSelector?: string;
}

export interface AgenticConfig {
  theme?: AgenticThemeConfig;
  /**
   * Overrides the built-in component strings (status badges, buttons,
   * aria-labels). Pass a static {@link AgtLabels} object, or a `Signal` for
   * live language switching. Defaults to the built-in English labels.
   */
  labels?: AgtLabelsInput;
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
export function provideAgentic(
  config: AgenticConfig = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...(config.labels
      ? [{ provide: AGT_LABELS, useValue: config.labels }]
      : []),
    provideEnvironmentInitializer(() => {
      inject(AgenticThemeService).configure(config.theme?.preset, {
        darkMode: config.theme?.darkMode,
        darkSelector: config.theme?.darkModeSelector,
      });
    }),
  ]);
}
