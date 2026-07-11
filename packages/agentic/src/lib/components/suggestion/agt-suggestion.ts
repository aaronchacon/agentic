import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';

let counter = 0;

type SuggestionState = 'idle' | 'suggested' | 'accepted' | 'edited' | 'manual';

/**
 * A form field with an AI suggestion: shows the suggestion as ghost text with
 * accept/reject controls and a confidence badge, and tracks provenance —
 * **suggested → accepted (AI-filled) → edited-by-human**. The distinct
 * "edited by human" state matters for KYC/compliance audit trails.
 *
 * ```html
 * <agt-suggestion label="Full name" [suggestion]="'Ada Lovelace'" [confidence]="0.98" [(value)]="name" />
 * ```
 */
@Component({
  selector: 'agt-suggestion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'agt-suggestion' },
  template: `
    @if (label()) {
      <label class="agt-suggestion__label" [attr.for]="fieldId">{{
        label()
      }}</label>
    }

    <div class="agt-suggestion__field" [attr.data-state]="state()">
      <div class="agt-suggestion__input-wrap">
        @if (state() === 'suggested') {
          <span class="agt-suggestion__ghost" aria-hidden="true">{{
            suggestion()
          }}</span>
        }
        <input
          class="agt-suggestion__input"
          type="text"
          [id]="fieldId"
          [value]="value()"
          [placeholder]="state() === 'suggested' ? '' : placeholder()"
          [attr.aria-describedby]="
            state() === 'suggested' ? fieldId + '-hint' : null
          "
          (input)="onInput($event)"
          (keydown.Tab)="onTab($event)"
        />
      </div>

      @switch (state()) {
        @case ('suggested') {
          <div class="agt-suggestion__actions">
            <button
              type="button"
              class="agt-suggestion__accept"
              aria-label="Accept suggestion"
              (click)="accept()"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m5 12 4 4 10-10"
                />
              </svg>
            </button>
            <button
              type="button"
              class="agt-suggestion__reject"
              aria-label="Reject suggestion"
              (click)="reject()"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  d="M6 6l12 12M18 6 6 18"
                />
              </svg>
            </button>
          </div>
        }
        @case ('accepted') {
          <span class="agt-suggestion__badge agt-suggestion__badge--ai">
            <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"
              />
            </svg>
            AI
            @if (confidencePct() !== null) {
              &nbsp;· {{ confidencePct() }}%
            }
          </span>
        }
        @case ('edited') {
          <span class="agt-suggestion__badge agt-suggestion__badge--edited"
            >Edited by human</span
          >
        }
      }
    </div>

    @if (state() === 'suggested') {
      <span class="agt-suggestion__hint" [id]="fieldId + '-hint'">
        AI suggestion
        @if (confidencePct() !== null) {
          &nbsp;· {{ confidencePct() }}% confidence
        }
        · Tab to accept
      </span>
    }
  `,
  styleUrl: './agt-suggestion.scss',
})
export class AgtSuggestion {
  readonly label = input('');
  readonly placeholder = input('');
  readonly suggestion = input<string | null>(null);
  /** Confidence 0–1, shown as a percentage badge. */
  readonly confidence = input<number | undefined>(undefined);

  /** The field value (two-way). */
  readonly value = model('');
  /** Whether the current value originated from the AI suggestion (two-way). */
  readonly accepted = model(false);

  protected readonly fieldId = `agt-suggestion-${(counter += 1)}`;
  private readonly dismissed = signal(false);

  protected readonly state = computed<SuggestionState>(() => {
    const value = this.value();
    const suggestion = this.suggestion();
    if (suggestion && !this.accepted() && !this.dismissed() && value === '')
      return 'suggested';
    if (this.accepted()) return value === suggestion ? 'accepted' : 'edited';
    return value ? 'manual' : 'idle';
  });

  protected readonly confidencePct = computed(() => {
    const c = this.confidence();
    return c === undefined ? null : Math.round(c * 100);
  });

  protected accept(): void {
    const suggestion = this.suggestion();
    if (suggestion !== null) {
      this.value.set(suggestion);
      this.accepted.set(true);
      this.dismissed.set(false);
    }
  }

  protected reject(): void {
    this.dismissed.set(true);
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onTab(event: Event): void {
    if (this.state() === 'suggested') {
      event.preventDefault();
      this.accept();
    }
  }
}
