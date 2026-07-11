import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

/**
 * A small "Copy as Markdown" action for a doc page — the AI-native touch.
 * Copies a page-specific markdown blob to the clipboard so it can be pasted
 * straight into an LLM, and links to the site-wide `llms.txt`.
 */
@Component({
  selector: 'doc-md',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-md">
      <button
        type="button"
        class="doc-md__btn"
        (click)="copy()"
        [attr.aria-label]="copied() ? 'Copied' : 'Copy this page as Markdown'"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linejoin="round"
            d="M3 5h18v14H3z"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 15V9l3 3 3-3v6M18 9v4m0 0-1.5-1.5M18 13l1.5-1.5"
          />
        </svg>
        {{ copied() ? 'Copied' : 'Copy as Markdown' }}
      </button>
      <a class="doc-md__link" href="/llms.txt" target="_blank" rel="noreferrer"
        >llms.txt ↗</a
      >
    </div>
  `,
  styles: [
    `
      .doc-md {
        display: inline-flex;
        gap: 6px;
        align-items: center;
        margin-top: 14px;
      }
      .doc-md__btn {
        display: inline-flex;
        gap: 6px;
        align-items: center;
        padding: 5px 11px;
        font: inherit;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--agt-content-muted-color, #64748b);
        background: var(--agt-content-background, #fff);
        border: 1px solid var(--agt-content-border-color, #e5e5e5);
        border-radius: 8px;
        cursor: pointer;
        transition:
          background 0.15s ease,
          color 0.15s ease;
      }
      .doc-md__btn:hover {
        color: var(--agt-content-color, #0f172a);
        background: var(--agt-content-hover-background, #f4f4f4);
      }
      .doc-md__link {
        padding: 5px 9px;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--agt-content-muted-color, #64748b);
        text-decoration: none;
        border-radius: 8px;
      }
      .doc-md__link:hover {
        color: var(--agt-ai-color, #7c3aed);
      }
    `,
  ],
})
export class DocMd {
  /** The page's markdown, copied verbatim on click. */
  readonly markdown = input('');

  protected readonly copied = signal(false);

  protected copy(): void {
    navigator.clipboard?.writeText(this.markdown().trim());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1400);
  }
}
