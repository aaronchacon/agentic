import type { DocProp } from '../../model/doc-prop.model';

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
