import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AgtSuggestion } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import {
  propsToMarkdown,
  withDescriptions,
  type BaseProp,
} from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';
import { injectT } from '../../i18n/i18n';
import { SUGGESTION_I18N } from './suggestion.page.i18n';

const BASE_PROPS: BaseProp<keyof (typeof SUGGESTION_I18N)['en']['props']>[] = [
  { name: 'label', type: 'string', default: "''" },
  { name: 'suggestion', type: 'string | null', default: 'null' },
  { name: 'confidence', type: 'number' },
  { name: 'placeholder', type: 'string', default: "''" },
  { name: 'value', type: 'string', default: "''" },
  { name: 'accepted', type: 'boolean', default: 'false' },
];

/** English rows for the copied markdown, which stays English (llms.txt parity). */
const PROPS_EN = withDescriptions(BASE_PROPS, SUGGESTION_I18N.en.props);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgtSuggestion, DocDemo, DocProps, DocMd],
  templateUrl: './suggestion.page.html',
})
export default class SuggestionPage {
  protected readonly t = injectT(SUGGESTION_I18N);
  protected readonly props = computed<DocProp[]>(() =>
    withDescriptions(BASE_PROPS, this.t().props),
  );

  protected readonly code = [
    `<agt-suggestion`,
    `  label="Full name"`,
    `  [suggestion]="'Ada Lovelace'"`,
    `  [confidence]="0.98"`,
    `  [(value)]="name"`,
    `  [(accepted)]="fromAi" />`,
  ].join('\n');

  // Built once — locale-independent (the copied markdown stays English).
  protected readonly md = [
    '# Suggestion',
    '',
    SUGGESTION_I18N.en.lead,
    '',
    '```html',
    this.code,
    '```',
    '',
    propsToMarkdown(PROPS_EN),
  ].join('\n');
}
