/**
 * Presets compose the 3 token layers into a full theme.
 *
 * - `Base` is the default preset (neutral/professional, PrimeNG-like).
 * - `Aurora` is an alternate preset built with {@link definePreset} to prove that
 *   consumers can restyle "outside of ours" by merging overrides.
 *
 * Semantic tokens reference primitives with `{path}`; component tokens reference
 * semantics. That linkage is what makes the theme swappable at the CSS-var layer.
 */
import type { DeepPartial, Preset } from './types';
import { primitive } from './tokens';

/** Scheme-independent semantic tokens shared by light & dark. */
const semanticCommon = {
  transitionDuration: '0.2s',
  focusRing: {
    width: '2px',
    style: 'solid',
    color: '{primary.color}',
    offset: '2px',
  },
  radius: {
    sm: '{borderRadius.sm}',
    md: '{borderRadius.md}',
    lg: '{borderRadius.lg}',
    xl: '{borderRadius.xl}',
  },
};

export const Base: Preset = {
  primitive,
  semantic: {
    ...semanticCommon,
    colorScheme: {
      light: {
        surface: {
          0: '{neutral.0}',
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.500}',
          600: '{neutral.600}',
          700: '{neutral.700}',
          800: '{neutral.800}',
          900: '{neutral.900}',
          950: '{neutral.950}',
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          mutedBackground: '{surface.50}',
          borderColor: '{surface.200}',
          color: '{surface.900}',
          mutedColor: '{surface.500}',
        },
        primary: {
          color: '{blue.600}',
          contrastColor: '{neutral.0}',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}',
        },
        // AI/agent accent — Angular-flavoured red -> violet, not the violet/cyan
        // every AI project reuses. Built from our own primitives (refs, 3 layers).
        ai: {
          color: '{red.600}',
          contrastColor: '{neutral.0}',
          subtleBackground: '{red.50}',
          borderColor: '{red.200}',
          gradient: 'linear-gradient(90deg, {red.500}, {violet.500})',
        },
        state: {
          success: {
            color: '{emerald.600}',
            contrastColor: '{neutral.0}',
            background: '{emerald.100}',
          },
          warn: {
            color: '{amber.600}',
            contrastColor: '{neutral.950}',
            background: '{amber.100}',
          },
          danger: {
            color: '{red.600}',
            contrastColor: '{neutral.0}',
            background: '{red.100}',
          },
          info: {
            color: '{blue.600}',
            contrastColor: '{neutral.0}',
            background: '{blue.100}',
          },
        },
      },
      dark: {
        surface: {
          0: '#0b1220',
          50: '{neutral.900}',
          100: '{neutral.800}',
          200: '{neutral.700}',
          300: '{neutral.600}',
          400: '{neutral.500}',
          500: '{neutral.400}',
          600: '{neutral.300}',
          700: '{neutral.200}',
          800: '{neutral.100}',
          900: '{neutral.50}',
          950: '{neutral.0}',
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          mutedBackground: '{surface.50}',
          borderColor: '{surface.200}',
          color: '{surface.900}',
          mutedColor: '{surface.500}',
        },
        primary: {
          color: '{blue.400}',
          contrastColor: '{neutral.950}',
          hoverColor: '{blue.300}',
          activeColor: '{blue.200}',
        },
        // Red -> violet, brightened for dark surfaces.
        ai: {
          color: '{red.400}',
          contrastColor: '{neutral.950}',
          subtleBackground: '{red.950}',
          borderColor: '{red.800}',
          gradient: 'linear-gradient(90deg, {red.400}, {violet.400})',
        },
        state: {
          success: {
            color: '{emerald.400}',
            contrastColor: '{neutral.950}',
            background: '{emerald.950}',
          },
          warn: {
            color: '{amber.400}',
            contrastColor: '{neutral.950}',
            background: '{amber.950}',
          },
          danger: {
            color: '{red.400}',
            contrastColor: '{neutral.950}',
            background: '{red.950}',
          },
          info: {
            color: '{blue.400}',
            contrastColor: '{neutral.950}',
            background: '#172554',
          },
        },
      },
    },
  },
  components: {
    chat: {
      userBubbleBackground: '{content.hoverBackground}',
      userBubbleColor: '{content.color}',
      agentBubbleBackground: '{content.hoverBackground}',
      agentBubbleColor: '{content.color}',
      bubbleRadius: '{radius.lg}',
      composerRadius: '{radius.xl}',
      suggestionRadius: '{radius.lg}',
      cursorColor: '{ai.color}',
    },
    toolCall: {
      background: '{content.mutedBackground}',
      borderColor: '{content.borderColor}',
      radius: '{radius.md}',
      runningColor: '{ai.color}',
      successColor: '{state.success.color}',
      errorColor: '{state.danger.color}',
    },
    summary: {
      background: '{ai.subtleBackground}',
      borderColor: '{ai.borderColor}',
      accent: '{ai.gradient}',
      radius: '{radius.lg}',
    },
    sidebar: {
      fabBackground: '{ai.gradient}',
      fabColor: '{ai.contrastColor}',
      badgeBackground: '{state.danger.color}',
    },
  },
};

/** Deep-merge helper used by {@link definePreset}. Plain objects are merged; everything else is replaced. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function deepMerge<T>(base: T, overrides: DeepPartial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return (overrides as T) ?? base;
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overrides)) {
    const o = (overrides as Record<string, unknown>)[key];
    if (o === undefined) continue;
    out[key] =
      isPlainObject(out[key]) && isPlainObject(o)
        ? deepMerge(out[key], o as never)
        : o;
  }
  return out as T;
}

/** Create a new preset by merging overrides onto a base preset. */
export function definePreset(
  base: Preset,
  overrides: DeepPartial<Preset>,
): Preset {
  return deepMerge(base, overrides);
}

/**
 * Alternate preset: a faithful clone of PrimeNG's **Aura** theme — a monochrome
 * "noir" look on the zinc palette (near-white primary on near-black surfaces in
 * dark mode). Proves restyle-by-override: the whole surface + accent system is
 * swapped by merging onto {@link Base}. Semantic state colours (success/danger/…)
 * and component tokens are inherited.
 *
 * Values mirror PrimeNG Aura dark: page `#09090b`, content `#18181b`,
 * hover `#27272a`, border `#3f3f46`, text `#ffffff`, muted `#a1a1aa`,
 * primary `#fafafa`, radius 6px.
 */
export const Aurora: Preset = definePreset(Base, {
  semantic: {
    radius: { sm: '4px', md: '6px', lg: '8px', xl: '12px' },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        content: {
          background: '#ffffff',
          hoverBackground: '#f4f4f5',
          mutedBackground: '#fafafa',
          borderColor: '#e4e4e7',
          color: '#18181b',
          mutedColor: '#71717a',
        },
        primary: {
          color: '#18181b',
          contrastColor: '#fafafa',
          hoverColor: '#27272a',
          activeColor: '#3f3f46',
        },
        ai: {
          color: '#18181b',
          contrastColor: '#ffffff',
          subtleBackground: '#f4f4f5',
          borderColor: '#e4e4e7',
          gradient: 'linear-gradient(90deg, #18181b, #71717a)',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#09090b',
          100: '#18181b',
          200: '#27272a',
          300: '#3f3f46',
          400: '#52525b',
          500: '#71717a',
          600: '#a1a1aa',
          700: '#d4d4d8',
          800: '#e4e4e7',
          900: '#f4f4f5',
          950: '#fafafa',
        },
        content: {
          background: '#18181b',
          hoverBackground: '#27272a',
          mutedBackground: '#27272a',
          borderColor: '#3f3f46',
          color: '#ffffff',
          mutedColor: '#a1a1aa',
        },
        primary: {
          color: '#fafafa',
          contrastColor: '#09090b',
          hoverColor: '#e4e4e7',
          activeColor: '#d4d4d8',
        },
        ai: {
          color: '#fafafa',
          contrastColor: '#09090b',
          subtleBackground: '#27272a',
          borderColor: '#3f3f46',
          gradient: 'linear-gradient(90deg, #fafafa, #a1a1aa)',
        },
      },
    },
  },
});
