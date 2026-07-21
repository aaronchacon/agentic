import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CHROME_I18N } from '../../i18n/chrome.i18n';
import { injectT } from '../../i18n/i18n';
import { COPY_FEEDBACK_MS } from '../ui.constants';

/**
 * A small "Copy as Markdown" action for a doc page — the AI-native touch.
 * Copies a page-specific markdown blob to the clipboard so it can be pasted
 * straight into an LLM, and links to the site-wide `llms.txt`.
 */
@Component({
  selector: 'app-doc-md',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-md.html',
  styleUrl: './doc-md.scss',
})
export class DocMd {
  /** The page's markdown, copied verbatim on click. */
  readonly markdown = input('');

  protected readonly t = injectT(CHROME_I18N);
  protected readonly copied = signal(false);

  protected copy(): void {
    navigator.clipboard?.writeText(this.markdown().trim());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), COPY_FEEDBACK_MS);
  }
}
