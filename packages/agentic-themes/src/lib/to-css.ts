/**
 * Compiles a {@link Preset} token tree into CSS custom properties.
 *
 * - Nested keys become `--agt-a-b-c`.
 * - `{a.b.c}` references become `var(--agt-a-b-c)` so the 3 layers link through
 *   the CSS cascade (change a primitive/semantic value → everything downstream updates).
 * - `semantic.colorScheme.light` + primitive/semantic/component tokens go on `:root`;
 *   `semantic.colorScheme.dark` goes on the dark selector (class) or a
 *   `prefers-color-scheme` media query.
 */
import type { Preset, TokenNode } from './types';

export interface BuildThemeOptions {
  /** Dark mode strategy. `'class'` (default) toggles via `darkSelector`; `'media'` uses prefers-color-scheme. */
  darkMode?: 'class' | 'media';
  /** CSS selector used for class-based dark mode. Default `.agt-dark`. */
  darkSelector?: string;
}

function kebab(segment: string): string {
  return segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function varName(path: string[]): string {
  return `--agt-${path.map(kebab).join('-')}`;
}

/** Replace `{a.b.c}` token references with `var(--agt-a-b-c)`. */
export function resolveRefs(value: string): string {
  return value.replace(/\{([^}]+)\}/g, (_, ref: string) => {
    const path = ref.trim().split('.').map(kebab).join('-');
    return `var(--agt-${path})`;
  });
}

function flatten(
  node: TokenNode,
  prefix: string[],
  out: Map<string, string>,
): void {
  if (node === null || node === undefined) return;
  if (typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      flatten(child, [...prefix, key], out);
    }
    return;
  }
  out.set(varName(prefix), resolveRefs(String(node)));
}

function block(
  selector: string,
  vars: Map<string, string>,
  indent = '',
): string {
  if (vars.size === 0) return '';
  const lines = [...vars.entries()]
    .map(([k, v]) => `${indent}  ${k}: ${v};`)
    .join('\n');
  return `${indent}${selector} {\n${lines}\n${indent}}`;
}

/** Compile a preset to a CSS string ready to inject into a `<style>` element. */
export function buildThemeCss(
  preset: Preset,
  options: BuildThemeOptions = {},
): string {
  const darkMode = options.darkMode ?? 'class';
  const darkSelector = options.darkSelector ?? '.agt-dark';

  const root = new Map<string, string>();
  flatten(preset.primitive ?? {}, [], root);

  const semantic = preset.semantic ?? {};
  const { colorScheme, ...restSemantic } = semantic;
  flatten(restSemantic as TokenNode, [], root);
  if (colorScheme?.light) flatten(colorScheme.light, [], root);
  flatten((preset.components ?? {}) as TokenNode, [], root);

  const dark = new Map<string, string>();
  if (colorScheme?.dark) flatten(colorScheme.dark, [], dark);

  const parts = [block(':root', root)];
  if (dark.size > 0) {
    parts.push(
      darkMode === 'media'
        ? `@media (prefers-color-scheme: dark) {\n${block(':root', dark, '  ')}\n}`
        : block(darkSelector, dark),
    );
  }
  return parts.filter(Boolean).join('\n\n');
}

/** Runtime accessor: `$dt('primary.color')` -> `var(--agt-primary-color)`. */
export function $dt(path: string): string {
  return `var(--agt-${path.split('.').map(kebab).join('-')})`;
}
