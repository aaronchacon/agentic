import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AgenticThemeService } from '@ng-agentic/core';
import type { NavSection } from './model/nav.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly theme = inject(AgenticThemeService);
  protected readonly isDark = this.theme.isDark;
  protected readonly navOpen = signal(false);

  protected readonly sections: NavSection[] = [
    {
      title: 'Getting started',
      items: [
        { label: 'Introduction', path: '/' },
        { label: 'Provenance', path: '/provenance' },
        { label: 'Theming', path: '/theming' },
      ],
    },
    {
      title: 'Components',
      items: [
        { label: 'Chat', path: '/components/chat' },
        { label: 'Tool Call', path: '/components/tool-call' },
        { label: 'Suggestion', path: '/components/suggestion' },
        { label: 'Summary', path: '/components/summary' },
        { label: 'Sidebar', path: '/components/sidebar' },
        { label: 'Plan', path: '/components/plan' },
        { label: 'Approval', path: '/components/approval' },
      ],
    },
  ];

  protected toggleDark(): void {
    this.theme.toggleDarkMode();
  }
}
