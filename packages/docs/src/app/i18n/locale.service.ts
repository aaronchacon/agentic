import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import type { Locale } from './i18n';

const STORAGE_KEY = 'agentic-docs-locale';

/**
 * Client-side locale switching, mirroring the theme-toggle UX. English is the
 * default (and the language of the prerendered HTML); the stored choice is
 * restored only after hydration so the first client render matches the static
 * DOM exactly (no NG0500 mismatch).
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly doc = inject(DOCUMENT);
  readonly locale = signal<Locale>('en');

  constructor() {
    afterNextRender(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        this.locale.set(stored);
      }
    });
    // SSR-safe: on the server the locale stays 'en', preserving lang="en".
    effect(() => (this.doc.documentElement.lang = this.locale()));
  }

  toggle(): void {
    const next: Locale = this.locale() === 'en' ? 'es' : 'en';
    this.locale.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode) — the toggle still works in-session.
    }
  }
}
