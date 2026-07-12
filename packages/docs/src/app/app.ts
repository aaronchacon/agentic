import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AgenticThemeService } from '@ng-agentic/core';

interface NavItem {
  label: string;
  path: string;
}
interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
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
