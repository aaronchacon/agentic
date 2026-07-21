import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AgenticThemeService } from '@ng-agentic/core';
import { CHROME_I18N } from './i18n/chrome.i18n';
import { injectT } from './i18n/i18n';
import { LocaleService } from './i18n/locale.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(document:keydown.escape)': 'navOpen.set(false)',
  },
})
export class App {
  private readonly doc = inject(DOCUMENT);
  private readonly theme = inject(AgenticThemeService);
  private readonly localeService = inject(LocaleService);
  protected readonly isDark = this.theme.isDark;
  protected readonly navOpen = signal(false);
  protected readonly locale = this.localeService.locale;
  protected readonly chrome = injectT(CHROME_I18N);
  protected readonly sections = computed(() => this.chrome().nav);

  constructor() {
    // Lock body scroll while the mobile drawer is open (no-op on the server:
    // navOpen starts false, so the class is never added during prerender).
    effect(() => {
      this.doc.body.classList.toggle('nav-locked', this.navOpen());
    });
  }

  protected toggleDark(): void {
    this.theme.toggleDarkMode();
  }

  protected toggleLocale(): void {
    this.localeService.toggle();
  }
}
