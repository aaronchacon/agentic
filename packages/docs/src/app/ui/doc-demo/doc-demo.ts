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
  selector: 'app-doc-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-demo.html',
  styleUrl: './doc-demo.scss',
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
    const lang = hljs.getLanguage(this.language())
      ? this.language()
      : 'plaintext';
    return hljs.highlight(this.code().trim(), { language: lang }).value;
  });

  protected copy(): void {
    navigator.clipboard?.writeText(this.code().trim());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1200);
  }
}
