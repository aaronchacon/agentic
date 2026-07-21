import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AgenticThemeService,
  AgtSummary,
  AgtToolCall,
  type ToolCall,
} from '@ng-agentic/core';
import {
  Aurora,
  Base,
  definePreset,
  type DeepPartial,
  type Preset,
} from '@ng-agentic/themes';
import { DocDemo } from '../ui/doc-demo/doc-demo';
import {
  PresetId,
  RadiusId,
  type Accent,
  type RadiusOption,
} from '../model/theming.model';
import { injectT } from '../i18n/i18n';
import { THEMING_I18N } from './theming.page.i18n';

/** Accent rows minus labels; those live (localized) in theming.page.i18n.ts. */
const BASE_ACCENTS: Array<
  Omit<Accent, 'label'> & {
    id: keyof (typeof THEMING_I18N)['en']['playground']['accents'];
  }
> = [
  {
    id: 'violet',
    swatch: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
    light: '#7c3aed',
    dark: '#a78bfa',
    lightGrad: 'linear-gradient(90deg,#8b5cf6,#06b6d4)',
    darkGrad: 'linear-gradient(90deg,#a78bfa,#22d3ee)',
  },
  {
    id: 'blue',
    swatch: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
    light: '#2563eb',
    dark: '#60a5fa',
    lightGrad: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
    darkGrad: 'linear-gradient(90deg,#60a5fa,#22d3ee)',
  },
  {
    id: 'emerald',
    swatch: 'linear-gradient(135deg,#10b981,#22d3ee)',
    light: '#059669',
    dark: '#34d399',
    lightGrad: 'linear-gradient(90deg,#10b981,#22d3ee)',
    darkGrad: 'linear-gradient(90deg,#34d399,#22d3ee)',
  },
  {
    id: 'rose',
    swatch: 'linear-gradient(135deg,#f43f5e,#8b5cf6)',
    light: '#e11d48',
    dark: '#fb7185',
    lightGrad: 'linear-gradient(90deg,#f43f5e,#8b5cf6)',
    darkGrad: 'linear-gradient(90deg,#fb7185,#a78bfa)',
  },
  {
    id: 'amber',
    swatch: 'linear-gradient(135deg,#f59e0b,#f43f5e)',
    light: '#d97706',
    dark: '#fbbf24',
    lightGrad: 'linear-gradient(90deg,#f59e0b,#f43f5e)',
    darkGrad: 'linear-gradient(90deg,#fbbf24,#fb7185)',
  },
];

/** Radius rows minus labels; those live (localized) in theming.page.i18n.ts. */
const BASE_RADII: Array<Omit<RadiusOption, 'label'>> = [
  {
    id: RadiusId.Sharp,
    scale: { sm: '2px', md: '4px', lg: '6px', xl: '10px' },
  },
  { id: RadiusId.Default },
  {
    id: RadiusId.Rounded,
    scale: { sm: '10px', md: '14px', lg: '20px', xl: '28px' },
  },
];

/** Token rows minus descriptions; those live (localized) in theming.page.i18n.ts. */
const BASE_TOKENS: Array<{
  name: keyof (typeof THEMING_I18N)['en']['tokens']['descs'];
  css: string;
}> = [
  { name: 'primary.color', css: '--agt-primary-color' },
  { name: 'ai.color', css: '--agt-ai-color' },
  { name: 'ai.gradient', css: '--agt-ai-gradient' },
  { name: 'content.background', css: '--agt-content-background' },
  { name: 'content.color', css: '--agt-content-color' },
  { name: 'radius.lg', css: '--agt-radius-lg' },
  { name: 'state.success.color', css: '--agt-state-success-color' },
  { name: 'state.danger.color', css: '--agt-state-danger-color' },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgtSummary, AgtToolCall, DocDemo],
  templateUrl: './theming.page.html',
  styleUrl: './theming.page.scss',
})
export default class ThemingPage {
  private readonly theme = inject(AgenticThemeService);

  protected readonly t = injectT(THEMING_I18N);

  /** Exposed to the template so preset buttons reference the const, not magic strings. */
  protected readonly PresetId = PresetId;

  protected readonly preset = signal<PresetId>(PresetId.Base);
  protected readonly accent = signal<string>('default');
  protected readonly radius = signal<RadiusId>(RadiusId.Default);

  protected readonly tool: ToolCall = {
    id: 't1',
    name: 'search_sanctions',
    status: 'success',
  };

  protected readonly accents = computed<Accent[]>(() =>
    BASE_ACCENTS.map((a) => ({
      ...a,
      label: this.t().playground.accents[a.id],
    })),
  );

  protected readonly radii = computed<RadiusOption[]>(() =>
    BASE_RADII.map((r) => ({ ...r, label: this.t().playground.radii[r.id] })),
  );

  protected readonly tokens = computed(() =>
    BASE_TOKENS.map((tok) => ({
      ...tok,
      desc: this.t().tokens.descs[tok.name],
    })),
  );

  protected readonly configCode = [
    `import { provideAgentic } from '@ng-agentic/core';`,
    `import { Aurora, definePreset } from '@ng-agentic/themes';`,
    ``,
    `// A built-in preset...`,
    `provideAgentic({ theme: { preset: Aurora, darkModeSelector: '.dark' } });`,
    ``,
    `// ...or your own brand, merged on top of one:`,
    `const Brand = definePreset(Aurora, {`,
    `  semantic: {`,
    `    radius: { lg: '20px' },`,
    `    colorScheme: {`,
    `      light: { ai: { color: '#e11d48' } },`,
    `      dark: { ai: { color: '#fb7185' } },`,
    `    },`,
    `  },`,
    `});`,
    `provideAgentic({ theme: { preset: Brand } });`,
  ].join('\n');

  protected readonly runtimeCode = [
    `import { inject } from '@angular/core';`,
    `import { AgenticThemeService } from '@ng-agentic/core';`,
    ``,
    `const theme = inject(AgenticThemeService);`,
    ``,
    `// Swap the whole preset`,
    `theme.setPreset(Aurora);`,
    ``,
    `// Merge a token override onto the active preset`,
    `theme.updatePreset({`,
    `  semantic: { colorScheme: { light: { ai: { color: '#059669' } } } },`,
    `});`,
    ``,
    `// Toggle class-based dark mode`,
    `theme.toggleDarkMode();`,
  ].join('\n');

  protected setPreset(id: PresetId): void {
    this.preset.set(id);
    this.apply();
  }

  protected setAccent(id: string): void {
    this.accent.set(id);
    this.apply();
  }

  protected setRadius(id: RadiusId): void {
    this.radius.set(id);
    this.apply();
  }

  protected reset(): void {
    this.preset.set(PresetId.Base);
    this.accent.set('default');
    this.radius.set(RadiusId.Default);
    this.theme.setPreset(Base);
  }

  private apply(): void {
    const base = this.preset() === PresetId.Aurora ? Aurora : Base;
    const acc = this.accents().find((a) => a.id === this.accent());
    const radScale = this.radii().find((r) => r.id === this.radius())?.scale;

    // 'default' accent keeps the preset's own AI colour; a swatch overrides it.
    const colorScheme = acc
      ? {
          light: { ai: { color: acc.light, gradient: acc.lightGrad } },
          dark: { ai: { color: acc.dark, gradient: acc.darkGrad } },
        }
      : undefined;

    const overrides: DeepPartial<Preset> = {
      semantic: {
        ...(radScale ? { radius: radScale } : {}),
        ...(colorScheme ? { colorScheme } : {}),
      },
    };

    this.theme.setPreset(definePreset(base, overrides));
  }
}
