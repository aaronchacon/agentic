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
        ai: {
          color: '{violet.600}',
          contrastColor: '{neutral.0}',
          subtleBackground: '{violet.50}',
          borderColor: '{violet.200}',
          gradient: 'linear-gradient(90deg, {violet.500}, {cyan.500})',
        },
        state: {
          success: { color: '{emerald.600}', contrastColor: '{neutral.0}', background: '{emerald.100}' },
          warn: { color: '{amber.600}', contrastColor: '{neutral.950}', background: '{amber.100}' },
          danger: { color: '{red.600}', contrastColor: '{neutral.0}', background: '{red.100}' },
          info: { color: '{blue.600}', contrastColor: '{neutral.0}', background: '{blue.100}' },
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
        ai: {
          color: '{violet.400}',
          contrastColor: '{neutral.950}',
          subtleBackground: '{violet.950}',
          borderColor: '{violet.800}',
          gradient: 'linear-gradient(90deg, {violet.400}, {cyan.400})',
        },
        state: {
          success: { color: '{emerald.400}', contrastColor: '{neutral.950}', background: '{emerald.950}' },
          warn: { color: '{amber.400}', contrastColor: '{neutral.950}', background: '{amber.950}' },
          danger: { color: '{red.400}', contrastColor: '{neutral.950}', background: '{red.950}' },
          info: { color: '{blue.400}', contrastColor: '{neutral.950}', background: '#172554' },
        },
      },
    },
  },
  components: {
    chat: {
      userBubbleBackground: '{primary.color}',
      userBubbleColor: '{primary.contrastColor}',
      agentBubbleBackground: '{content.hoverBackground}',
      agentBubbleColor: '{content.color}',
      bubbleRadius: '{radius.lg}',
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
    out[key] = isPlainObject(out[key]) && isPlainObject(o) ? deepMerge(out[key], o as never) : o;
  }
  return out as T;
}

/** Create a new preset by merging overrides onto a base preset. */
export function definePreset(base: Preset, overrides: DeepPartial<Preset>): Preset {
  return deepMerge(base, overrides);
}

/**
 * Alternate preset: emerald primary + softer radii, proving restyle-by-override.
 */
export const Aurora: Preset = definePreset(Base, {
  semantic: {
    radius: { sm: '8px', md: '10px', lg: '14px', xl: '20px' },
    colorScheme: {
      light: {
        primary: {
          color: '{emerald.600}',
          contrastColor: '{neutral.0}',
          hoverColor: '{emerald.500}',
          activeColor: '#047857',
        },
      },
      dark: {
        primary: {
          color: '{emerald.400}',
          contrastColor: '{neutral.950}',
          hoverColor: '#6ee7b7',
          activeColor: '#a7f3d0',
        },
      },
    },
  },
});
