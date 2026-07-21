import { computed, inject, type Signal } from '@angular/core';
import { LocaleService } from './locale.service';

export type Locale = 'en' | 'es';

/**
 * A value available in every supported locale. Define the English shape first
 * and type the dictionary as `Localized<typeof EN>` so the compiler enforces
 * that Spanish carries every key.
 */
export type Localized<T> = Record<Locale, T>;

/** Inject a locale-reactive view over a dictionary: `t = injectT(DICT)`. */
export function injectT<T>(dict: Localized<T>): Signal<T> {
  const locale = inject(LocaleService).locale;
  return computed(() => dict[locale()]);
}
