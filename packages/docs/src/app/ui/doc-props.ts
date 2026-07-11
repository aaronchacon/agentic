import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A single row in an API reference table. */
export interface DocProp {
  /** Property / input / event name, e.g. `store` or `regenerate`. */
  name: string;
  /** TypeScript type, rendered monospace. */
  type: string;
  /** Default value. Omit for required inputs (set `required`) or events. */
  default?: string;
  /** Marks a required input — renders a "required" badge in the Default column. */
  required?: boolean;
  /** One-line description. */
  description: string;
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

/** A PrimeNG-style API reference table for a component's inputs/outputs. */
@Component({
  selector: 'doc-props',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-props-wrap">
      <table class="doc-props">
        <thead>
          <tr>
            <th>{{ nameHeader() }}</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.name) {
            <tr>
              <td>
                <code>{{ row.name }}</code>
              </td>
              <td>
                <span class="doc-props__type">{{ row.type }}</span>
              </td>
              <td>
                @if (row.default) {
                  <code class="doc-props__default">{{ row.default }}</code>
                } @else if (row.required) {
                  <span class="doc-props__req">required</span>
                } @else {
                  <span class="doc-props__default">—</span>
                }
              </td>
              <td>{{ row.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .doc-props-wrap {
        overflow-x: auto;
        margin-top: 12px;
        border: 1px solid var(--agt-content-border-color, #e5e5e5);
        border-radius: 12px;
      }
      .doc-props {
        margin-top: 0;
      }
      .doc-props :is(th, td):first-child {
        padding-left: 16px;
      }
      .doc-props :is(th, td):last-child {
        padding-right: 16px;
      }
      .doc-props tbody tr:last-child :is(td) {
        border-bottom: 0;
      }
      .doc-props__type {
        font-family: var(--agt-font-family-mono, ui-monospace, monospace);
        font-size: 0.82rem;
        color: var(--agt-primary-color, #2563eb);
      }
      .doc-props__default {
        font-family: var(--agt-font-family-mono, ui-monospace, monospace);
        font-size: 0.82rem;
        color: var(--agt-content-muted-color, #64748b);
      }
      .doc-props__req {
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--agt-state-danger-color, #dc2626);
      }
    `,
  ],
})
export class DocProps {
  /** The rows to render. */
  readonly rows = input.required<DocProp[]>();
  /** Header label for the first column (e.g. "Prop", "Event", "Token"). */
  readonly nameHeader = input('Prop');
}
