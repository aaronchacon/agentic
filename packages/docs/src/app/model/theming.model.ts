/** Theming playground models. "Enums" are expressed as `const` objects
 * (per project standard) with a derived union type of the same name. */

/** Built-in preset the playground can apply. */
export const PresetId = {
  Base: 'base',
  Aurora: 'aurora',
} as const;
export type PresetId = (typeof PresetId)[keyof typeof PresetId];

/** Corner-radius scale option in the playground. */
export const RadiusId = {
  Sharp: 'sharp',
  Default: 'default',
  Rounded: 'rounded',
} as const;
export type RadiusId = (typeof RadiusId)[keyof typeof RadiusId];

/** An AI-accent swatch the playground can override the `ai` tokens with. */
export interface Accent {
  id: string;
  label: string;
  /** CSS gradient used to paint the swatch button. */
  swatch: string;
  /** Solid accent colour, light and dark. */
  light: string;
  dark: string;
  /** Accent gradient, light and dark. */
  lightGrad: string;
  darkGrad: string;
}

/** A radius-scale option and the token values it applies. */
export interface RadiusOption {
  id: RadiusId;
  label: string;
  scale?: { sm: string; md: string; lg: string; xl: string };
}
