import type { DocProp } from '../../model/doc-prop.model';

/** A prop row minus its description, which lives (localized) in the page's i18n dict. */
export type BaseProp<K extends string> = Omit<DocProp, 'description'> & {
  name: K;
};

/** Join base rows with the localized descriptions from a page dict. */
export function withDescriptions<K extends string>(
  base: readonly BaseProp<K>[],
  descs: Record<K, string>,
): DocProp[] {
  return base.map((p) => ({ ...p, description: descs[p.name] }));
}

/** Render a `DocProp[]` as a GitHub-flavoured markdown table (used by "Copy as Markdown"). */
export function propsToMarkdown(rows: DocProp[], nameHeader = 'Prop'): string {
  const head = `| ${nameHeader} | Type | Default | Description |\n| --- | --- | --- | --- |`;
  const body = rows
    .map((r) => {
      const type = r.type.replace(/\|/g, '\\|');
      const def = r.default
        ? `\`${r.default}\``
        : r.required
          ? 'required'
          : '—';
      return `| \`${r.name}\` | \`${type}\` | ${def} | ${r.description} |`;
    })
    .join('\n');
  return `${head}\n${body}`;
}
