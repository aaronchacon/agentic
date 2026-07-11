import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AgenticThemeService,
  AgtSummary,
  AgtToolCall,
  type ToolCall,
} from '@aaronch/agentic';
import {
  Aurora,
  Base,
  definePreset,
  type DeepPartial,
  type Preset,
} from '@aaronch/agentic-themes';
import { DocDemo } from '../ui/doc-demo';

type PresetId = 'base' | 'aurora';
type RadiusId = 'sharp' | 'default' | 'rounded';

interface Accent {
  id: string;
  label: string;
  swatch: string;
  light: string;
  dark: string;
  lightGrad: string;
  darkGrad: string;
}

interface RadiusOption {
  id: RadiusId;
  label: string;
  scale?: { sm: string; md: string; lg: string; xl: string };
}

@Component({
  selector: 'docs-theming',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgtSummary, AgtToolCall, DocDemo],
  template: `
    <article class="doc">
      <div class="doc__head">
        <p class="doc__eyebrow">Getting started</p>
        <h1 class="doc__title">Theming</h1>
        <p class="doc__lead">
          Every component is painted with a 3-layer token system —
          <strong>primitive → semantic → component</strong> — compiled to CSS
          custom properties. Swap the preset or override any token and the whole
          library recolors, no CSS forking. Try it live: these controls restyle
          this entire site at runtime.
        </p>
      </div>

      <section class="doc__section">
        <h2>Playground</h2>
        <p>
          Pick a preset, an AI accent and a corner radius. Changes apply
          globally, instantly.
        </p>

        <div class="pg">
          <div class="pg__controls">
            <div class="pg__group">
              <span class="pg__label">Preset</span>
              <div class="pg__seg">
                <button
                  type="button"
                  [class.is-active]="preset() === 'base'"
                  (click)="setPreset('base')"
                >
                  Base
                </button>
                <button
                  type="button"
                  [class.is-active]="preset() === 'aurora'"
                  (click)="setPreset('aurora')"
                >
                  Aurora
                </button>
              </div>
            </div>

            <div class="pg__group">
              <span class="pg__label">AI accent</span>
              <div class="pg__swatches">
                <button
                  type="button"
                  class="pg__swatch pg__swatch--auto"
                  [class.is-active]="accent() === 'default'"
                  [attr.aria-pressed]="accent() === 'default'"
                  aria-label="Preset default accent"
                  title="Preset default"
                  (click)="setAccent('default')"
                >
                  A
                </button>
                @for (a of accents; track a.id) {
                  <button
                    type="button"
                    class="pg__swatch"
                    [class.is-active]="accent() === a.id"
                    [style.background]="a.swatch"
                    [attr.aria-label]="a.label"
                    [attr.aria-pressed]="accent() === a.id"
                    (click)="setAccent(a.id)"
                  ></button>
                }
              </div>
            </div>

            <div class="pg__group">
              <span class="pg__label">Radius</span>
              <div class="pg__seg">
                @for (r of radii; track r.id) {
                  <button
                    type="button"
                    [class.is-active]="radius() === r.id"
                    (click)="setRadius(r.id)"
                  >
                    {{ r.label }}
                  </button>
                }
              </div>
            </div>

            <button type="button" class="pg__reset" (click)="reset()">
              Reset
            </button>
          </div>

          <div class="pg__preview">
            <div class="pg__row">
              <button type="button" class="pg__btn pg__btn--primary">
                Approve
              </button>
              <button type="button" class="pg__btn pg__btn--ghost">
                Dismiss
              </button>
              <span class="pg__chip">AI generated</span>
            </div>
            <div class="pg__grad" aria-hidden="true"></div>
            <div class="pg__row">
              <span class="pg__badge pg__badge--success">Verified</span>
              <span class="pg__badge pg__badge--warn">Review</span>
              <span class="pg__badge pg__badge--danger">Flagged</span>
              <span class="pg__badge pg__badge--info">Pending</span>
            </div>

            <agt-summary
              title="Case summary"
              content="Passport matched with 98% confidence. No sanctions or PEP hits. Recommend approval with a 12-month review."
            />

            <agt-tool-call
              [toolCall]="tool"
              [steps]="['Queried OFAC & EU lists', 'No matches found']"
            />
          </div>
        </div>
      </section>

      <section class="doc__section">
        <h2>Configure a preset</h2>
        <p>
          Choose a built-in preset, or build your own by merging overrides onto
          one with
          <code>definePreset()</code> — this is what "restyle outside of ours"
          means.
        </p>
        <doc-demo [code]="configCode" [preview]="false" />
      </section>

      <section class="doc__section">
        <h2>Restyle at runtime</h2>
        <p>
          Inject <code>AgenticThemeService</code> to swap presets, merge token
          overrides or toggle dark mode after bootstrap — exactly what the
          playground above does.
        </p>
        <doc-demo [code]="runtimeCode" [preview]="false" />
      </section>

      <section class="doc__section">
        <h2>Key semantic tokens</h2>
        <p>
          Semantic tokens reference primitives and compile to these CSS
          variables.
        </p>
        <div class="doc-props-wrap">
          <table class="doc-props">
            <thead>
              <tr>
                <th>Token</th>
                <th>CSS variable</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              @for (t of tokens; track t.name) {
                <tr>
                  <td>
                    <code>{{ t.name }}</code>
                  </td>
                  <td>
                    <span class="tok">{{ t.css }}</span>
                  </td>
                  <td>{{ t.desc }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </article>
  `,
  styleUrl: './theming.css',
})
export default class ThemingPage {
  private readonly theme = inject(AgenticThemeService);

  protected readonly preset = signal<PresetId>('base');
  protected readonly accent = signal<string>('default');
  protected readonly radius = signal<RadiusId>('default');

  protected readonly tool: ToolCall = {
    id: 't1',
    name: 'search_sanctions',
    status: 'success',
  };

  protected readonly accents: Accent[] = [
    {
      id: 'violet',
      label: 'Violet',
      swatch: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
      light: '#7c3aed',
      dark: '#a78bfa',
      lightGrad: 'linear-gradient(90deg,#8b5cf6,#06b6d4)',
      darkGrad: 'linear-gradient(90deg,#a78bfa,#22d3ee)',
    },
    {
      id: 'blue',
      label: 'Blue',
      swatch: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
      light: '#2563eb',
      dark: '#60a5fa',
      lightGrad: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
      darkGrad: 'linear-gradient(90deg,#60a5fa,#22d3ee)',
    },
    {
      id: 'emerald',
      label: 'Emerald',
      swatch: 'linear-gradient(135deg,#10b981,#22d3ee)',
      light: '#059669',
      dark: '#34d399',
      lightGrad: 'linear-gradient(90deg,#10b981,#22d3ee)',
      darkGrad: 'linear-gradient(90deg,#34d399,#22d3ee)',
    },
    {
      id: 'rose',
      label: 'Rose',
      swatch: 'linear-gradient(135deg,#f43f5e,#8b5cf6)',
      light: '#e11d48',
      dark: '#fb7185',
      lightGrad: 'linear-gradient(90deg,#f43f5e,#8b5cf6)',
      darkGrad: 'linear-gradient(90deg,#fb7185,#a78bfa)',
    },
    {
      id: 'amber',
      label: 'Amber',
      swatch: 'linear-gradient(135deg,#f59e0b,#f43f5e)',
      light: '#d97706',
      dark: '#fbbf24',
      lightGrad: 'linear-gradient(90deg,#f59e0b,#f43f5e)',
      darkGrad: 'linear-gradient(90deg,#fbbf24,#fb7185)',
    },
  ];

  protected readonly radii: RadiusOption[] = [
    {
      id: 'sharp',
      label: 'Sharp',
      scale: { sm: '2px', md: '4px', lg: '6px', xl: '10px' },
    },
    { id: 'default', label: 'Default' },
    {
      id: 'rounded',
      label: 'Rounded',
      scale: { sm: '10px', md: '14px', lg: '20px', xl: '28px' },
    },
  ];

  protected readonly tokens = [
    {
      name: 'primary.color',
      css: '--agt-primary-color',
      desc: 'Primary action colour (buttons, links, user bubble).',
    },
    {
      name: 'ai.color',
      css: '--agt-ai-color',
      desc: 'AI/agent accent — cursor, provenance, "generated by AI" marks.',
    },
    {
      name: 'ai.gradient',
      css: '--agt-ai-gradient',
      desc: 'Signature gradient for AI surfaces (summary accent, FAB).',
    },
    {
      name: 'content.background',
      css: '--agt-content-background',
      desc: 'Base surface behind panels and cards.',
    },
    {
      name: 'content.color',
      css: '--agt-content-color',
      desc: 'Default foreground text colour.',
    },
    {
      name: 'radius.lg',
      css: '--agt-radius-lg',
      desc: 'Large corner radius (bubbles, cards).',
    },
    {
      name: 'state.success.color',
      css: '--agt-state-success-color',
      desc: 'Success state (verified, tool-call success).',
    },
    {
      name: 'state.danger.color',
      css: '--agt-state-danger-color',
      desc: 'Danger state (flagged, errors, badges).',
    },
  ];

  protected readonly configCode = [
    `import { provideAgentic } from '@aaronch/agentic';`,
    `import { Aurora, definePreset } from '@aaronch/agentic-themes';`,
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
    `import { AgenticThemeService } from '@aaronch/agentic';`,
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
    this.preset.set('base');
    this.accent.set('default');
    this.radius.set('default');
    this.theme.setPreset(Base);
  }

  private apply(): void {
    const base = this.preset() === 'aurora' ? Aurora : Base;
    const acc = this.accents.find((a) => a.id === this.accent());
    const radScale = this.radii.find((r) => r.id === this.radius())?.scale;

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
