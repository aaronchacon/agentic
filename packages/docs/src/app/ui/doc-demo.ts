import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import hljs from 'highlight.js/lib/common';

/** A documentation demo card with Preview / Code tabs and a copy button. */
@Component({
  selector: 'doc-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-demo">
      <div class="doc-demo__tabs">
        @if (preview()) {
          <button type="button" [class.is-active]="tab() === 'preview'" (click)="tab.set('preview')">
            Preview
          </button>
        }
        <button type="button" [class.is-active]="tab() === 'code'" (click)="tab.set('code')">
          Code
        </button>
      </div>

      @if (preview() && tab() === 'preview') {
        <div class="doc-demo__preview"><ng-content /></div>
      } @else {
        <div class="doc-demo__code">
          <button type="button" class="doc-demo__copy" (click)="copy()">
            {{ copied() ? 'Copied' : 'Copy' }}
          </button>
          <pre><code class="hljs" [innerHTML]="highlighted()"></code></pre>
        </div>
      }
    </div>
  `,
  styleUrl: './doc-demo.css',
})
export class DocDemo {
  readonly code = input('');
  readonly language = input('typescript');
  /** Whether to show a live Preview tab (projected content). Set false for code-only snippets. */
  readonly preview = input(true);

  protected readonly tab = linkedSignal<'preview' | 'code'>(() =>
    this.preview() ? 'preview' : 'code',
  );
  protected readonly copied = signal(false);

  protected readonly highlighted = computed(() => {
    const lang = hljs.getLanguage(this.language()) ? this.language() : 'plaintext';
    return hljs.highlight(this.code().trim(), { language: lang }).value;
  });

  protected copy(): void {
    navigator.clipboard?.writeText(this.code().trim());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1200);
  }
}
