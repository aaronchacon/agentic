import type { Decorator, Preview } from '@storybook/angular';
import { Aurora, Base, buildThemeCss, type Preset } from '@aaronch/agentic-themes';

const PRESETS: Record<string, Preset> = { base: Base, aurora: Aurora };

/** Applies the selected preset + color scheme globally by injecting the compiled tokens. */
const withTheme: Decorator = (story, context) => {
  const preset = PRESETS[context.globals['agtPreset'] as string] ?? Base;
  const dark = context.globals['agtTheme'] === 'dark';

  const id = 'agt-theme-sb';
  let styleEl = document.getElementById(id) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = id;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = buildThemeCss(preset, { darkSelector: '.agt-dark' });
  document.documentElement.classList.toggle('agt-dark', dark);
  document.body.style.background = 'var(--agt-content-background)';
  document.body.style.color = 'var(--agt-content-color)';
  document.body.style.fontFamily = 'var(--agt-font-family)';

  return story();
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    agtTheme: {
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    agtPreset: {
      description: 'Theme preset',
      defaultValue: 'base',
      toolbar: {
        title: 'Preset',
        icon: 'paintbrush',
        items: [
          { value: 'base', title: 'Base' },
          { value: 'aurora', title: 'Aurora' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
};

export default preview;
