import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { AgtStreamText } from '../chat/agt-stream-text';
import { toDetailMarkdown } from '../chat/markdown';

/**
 * Human-in-the-loop approval gate: the agent pauses and asks a person to approve,
 * edit or reject an action before proceeding — non-negotiable in regulated flows
 * (KYC/compliance). Shows the action + optional detail with approve/reject
 * controls; resolves to an approved/rejected state.
 *
 * ```html
 * <agt-approval [action]="agent.pendingApproval()?.action" (approve)="agent.approve(id)" (reject)="agent.reject(id)" />
 * ```
 */
@Component({
  selector: 'agt-approval',
  imports: [AgtStreamText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'agt-approval', '[attr.data-state]': 'state()' },
  template: `
    <div class="agt-approval__head">
      <span class="agt-approval__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="15" height="15">
          <path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          <path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <span class="agt-approval__title">{{ title() }}</span>
      @if (state() !== 'pending') {
        <span class="agt-approval__status agt-approval__status--{{ state() }}" role="status">
          @if (state() === 'approved') {
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4 10-10" /></svg>
            Approved
          } @else {
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
            Rejected
          }
        </span>
      }
    </div>

    <div class="agt-approval__body">
      <p class="agt-approval__action">{{ action() }}</p>
      @if (detailMarkdown(); as detail) {
        <agt-stream-text [text]="detail" [streaming]="false" />
      }
    </div>

    @if (state() === 'pending') {
      <div class="agt-approval__actions">
        @if (editable()) {
          <button type="button" class="agt-approval__btn agt-approval__btn--ghost" (click)="onEdit()">
            Edit
          </button>
        }
        <button type="button" class="agt-approval__btn agt-approval__btn--reject" (click)="onReject()">
          Reject
        </button>
        <button type="button" class="agt-approval__btn agt-approval__btn--approve" (click)="onApprove()">
          Approve
        </button>
      </div>
    }
  `,
  styleUrl: './agt-approval.scss',
})
export class AgtApproval {
  readonly title = input('Approval required');
  readonly action = input.required<string>();
  /** Optional payload shown as detail — JSON for objects, verbatim for strings. */
  readonly detail = input<unknown>(undefined);
  readonly editable = input(false);

  /** Resolution state (two-way): `pending → approved | rejected`. */
  readonly state = model<'pending' | 'approved' | 'rejected'>('pending');

  readonly approve = output<void>();
  readonly reject = output<void>();
  readonly edit = output<void>();

  protected readonly detailMarkdown = computed(() => toDetailMarkdown(this.detail()));

  protected onApprove(): void {
    this.approve.emit();
    this.state.set('approved');
  }

  protected onReject(): void {
    this.reject.emit();
    this.state.set('rejected');
  }

  protected onEdit(): void {
    this.edit.emit();
  }
}
