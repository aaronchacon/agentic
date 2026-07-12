import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import {
  Base,
  buildThemeCss,
  definePreset,
  type BuildThemeOptions,
  type DeepPartial,
  type Preset,
} from '@ng-agentic/themes';

const STYLE_ID = 'agt-theme';

/**
 * Injects the active preset as CSS custom properties into the document and
 * exposes runtime restyling (preset swap, token override, dark-mode toggle).
 * Wired up by {@link provideAgentic}; also usable directly via DI.
 */
@Injectable({ providedIn: 'root' })
export class AgenticThemeService {
  private readonly doc = inject(DOCUMENT);
  private styleEl: HTMLStyleElement | null = null;

  private readonly _preset = signal<Preset>(Base);
  private options: Required<BuildThemeOptions> = {
    darkMode: 'class',
    darkSelector: '.agt-dark',
  };

  /** The currently applied preset. */
  readonly preset = this._preset.asReadonly();
  /** Whether class-based dark mode is currently on. */
  readonly isDark = signal(false);

  /** Set the active preset + options and inject the resulting CSS. */
  configure(preset: Preset = Base, options: BuildThemeOptions = {}): void {
    this.options = {
      darkMode: options.darkMode ?? 'class',
      darkSelector: options.darkSelector ?? '.agt-dark',
    };
    this._preset.set(preset);
    this.apply();
  }

  /** Replace the whole preset at runtime. */
  setPreset(preset: Preset): void {
    this._preset.set(preset);
    this.apply();
  }

  /** Merge overrides onto the active preset and re-inject — "restyle outside of ours". */
  updatePreset(overrides: DeepPartial<Preset>): void {
    this._preset.set(definePreset(this._preset(), overrides));
    this.apply();
  }

  /** Toggle (or force) class-based dark mode by flipping the dark selector class on <html>. */
  toggleDarkMode(force?: boolean): void {
    const on = force ?? !this.isDark();
    const cls = this.options.darkSelector.replace(/^\./, '');
    this.doc.documentElement.classList.toggle(cls, on);
    this.isDark.set(on);
  }

  private apply(): void {
    if (!this.styleEl) {
      this.styleEl =
        (this.doc.getElementById(STYLE_ID) as HTMLStyleElement | null) ??
        this.doc.createElement('style');
      this.styleEl.id = STYLE_ID;
      if (!this.styleEl.isConnected) {
        this.doc.head.appendChild(this.styleEl);
      }
    }
    this.styleEl.textContent = buildThemeCss(this._preset(), this.options);
  }
}
