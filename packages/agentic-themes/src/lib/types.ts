/**
 * Token tree model — a 3-tier design token system
 * (primitive -> semantic -> component). Values are plain CSS strings/numbers and
 * may reference other tokens with the `{path.to.token}` syntax, which is compiled
 * to `var(--agt-path-to-token)`.
 */
export type TokenNode = string | number | { [key: string]: TokenNode };

export interface ColorSchemes {
  /** Tokens applied on `:root` (light) */
  light: Record<string, TokenNode>;
  /** Tokens applied on the dark selector (e.g. `.agt-dark`) */
  dark: Record<string, TokenNode>;
}

export interface SemanticTokens {
  /** Scheme-independent semantic tokens (radius, focus ring, transitions, ...) */
  [key: string]: TokenNode | ColorSchemes | undefined;
  /** Scheme-dependent tokens split into light/dark */
  colorScheme?: ColorSchemes;
}

/**
 * A preset is the full theme: primitive palettes, semantic tokens (with
 * light/dark schemes) and per-component tokens.
 */
export interface Preset {
  primitive?: Record<string, TokenNode>;
  semantic?: SemanticTokens;
  components?: Record<string, Record<string, TokenNode>>;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
