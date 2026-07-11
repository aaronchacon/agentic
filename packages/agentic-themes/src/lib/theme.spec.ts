import { describe, expect, it } from 'vitest';
import { Aurora, Base, definePreset } from './presets';
import { $dt, buildThemeCss, resolveRefs } from './to-css';

describe('resolveRefs', () => {
  it('turns a token reference into a CSS var', () => {
    expect(resolveRefs('{surface.100}')).toBe('var(--agt-surface-100)');
  });

  it('kebab-cases camelCase segments', () => {
    expect(resolveRefs('{content.hoverBackground}')).toBe(
      'var(--agt-content-hover-background)',
    );
  });

  it('resolves multiple references inside one value (gradient)', () => {
    expect(
      resolveRefs('linear-gradient(90deg, {violet.500}, {cyan.500})'),
    ).toBe(
      'linear-gradient(90deg, var(--agt-violet-500), var(--agt-cyan-500))',
    );
  });
});

describe('$dt', () => {
  it('returns the CSS var for a token path', () => {
    expect($dt('primary.color')).toBe('var(--agt-primary-color)');
  });
});

describe('buildThemeCss', () => {
  const css = buildThemeCss(Base);

  it('emits a :root block and a dark class block by default', () => {
    expect(css).toContain(':root {');
    expect(css).toContain('.agt-dark {');
  });

  it('emits primitive palette values verbatim', () => {
    expect(css).toContain('--agt-blue-600: #2563eb;');
  });

  it('compiles semantic references to layered CSS vars', () => {
    // content.color = '{surface.900}'
    expect(css).toContain('--agt-content-color: var(--agt-surface-900);');
  });

  it('compiles the AI gradient with both palette references', () => {
    expect(css).toContain(
      '--agt-ai-gradient: linear-gradient(90deg, var(--agt-red-500), var(--agt-violet-500));',
    );
  });

  it('supports media-query dark mode', () => {
    const media = buildThemeCss(Base, { darkMode: 'media' });
    expect(media).toContain('@media (prefers-color-scheme: dark)');
    expect(media).not.toContain('.agt-dark {');
  });

  it('honours a custom dark selector', () => {
    expect(buildThemeCss(Base, { darkSelector: '.app-dark' })).toContain(
      '.app-dark {',
    );
  });
});

describe('definePreset', () => {
  it('overrides only the targeted tokens and keeps the rest of Base', () => {
    const custom = definePreset(Base, {
      semantic: {
        colorScheme: {
          light: { primary: { color: '#123456' } } as never,
          dark: {},
        },
      },
    });
    const light = custom.semantic?.colorScheme?.light as Record<
      string,
      Record<string, string>
    >;
    // the targeted token is overridden
    expect(light['primary']['color']).toBe('#123456');
    // sibling tokens under the same node are kept from Base
    expect(light['primary']['contrastColor']).toBe('{neutral.0}');
    // untouched AI tokens are inherited from Base (red -> violet gradient)
    expect(light['ai']['gradient']).toBe(
      'linear-gradient(90deg, {red.500}, {violet.500})',
    );
  });

  it('Aurora clones PrimeNG Aura dark (zinc noir surfaces + near-white primary)', () => {
    const dark = Aurora.semantic?.colorScheme?.dark as Record<
      string,
      Record<string, string>
    >;
    expect(dark['surface']['50']).toBe('#09090b'); // page background
    expect(dark['content']['background']).toBe('#18181b'); // cards
    expect(dark['content']['borderColor']).toBe('#3f3f46');
    expect(dark['primary']['color']).toBe('#fafafa');
  });

  it('does not mutate the base preset', () => {
    const before = JSON.stringify(Base.semantic?.colorScheme?.light);
    definePreset(Base, {
      semantic: {
        colorScheme: {
          light: { primary: { color: '#000' } } as never,
          dark: {},
        },
      },
    });
    expect(JSON.stringify(Base.semantic?.colorScheme?.light)).toBe(before);
  });
});
