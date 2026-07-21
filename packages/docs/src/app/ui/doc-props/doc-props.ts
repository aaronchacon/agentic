import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CHROME_I18N } from '../../i18n/chrome.i18n';
import { injectT } from '../../i18n/i18n';
import type { DocProp } from '../../model/doc-prop.model';

/** A PrimeNG-style API reference table for a component's inputs/outputs. */
@Component({
  selector: 'app-doc-props',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-props.html',
  styleUrl: './doc-props.scss',
})
export class DocProps {
  /** The rows to render. */
  readonly rows = input.required<DocProp[]>();
  /** Header label for the first column (e.g. "Prop", "Event", "Token"). */
  readonly nameHeader = input('Prop');

  protected readonly t = injectT(CHROME_I18N);
}
