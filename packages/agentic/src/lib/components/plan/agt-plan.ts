import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { PlanStep, PlanStepStatus } from '../../core/types';

const STATUS_LABEL: Record<PlanStepStatus, string> = {
  pending: 'Pending',
  active: 'In progress',
  done: 'Completed',
  error: 'Failed',
};

/**
 * Agent plan / execution-trace: a vertical timeline of steps with status
 * (pending / active / done / error), collapsible, with a progress summary in the
 * header. Fed by the `step` events of the agent contract (`store.plan()`).
 *
 * ```html
 * <agt-plan title="Verification" [steps]="agent.plan()" />
 * ```
 */
@Component({
  selector: 'agt-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'agt-plan' },
  template: `
    <button type="button" class="agt-plan__header" [attr.aria-expanded]="isOpen()" (click)="toggle()">
      <span class="agt-plan__heading">
        <span class="agt-plan__overall agt-plan__overall--{{ overall() }}" aria-hidden="true">
          @switch (overall()) {
            @case ('active') {
              <svg class="agt-plan__spinner" viewBox="0 0 24 24" width="14" height="14">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.25" />
                <path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M12 3a9 9 0 0 1 9 9" />
              </svg>
            }
            @case ('done') {
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4 10-10" /></svg>
            }
            @case ('error') {
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
            }
            @default {
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M8 7h11M8 12h11M8 17h11M4 7h.01M4 12h.01M4 17h.01" /></svg>
            }
          }
        </span>
        <span class="agt-plan__title">{{ title() }}</span>
        <span class="agt-plan__progress">{{ progress().done }}/{{ progress().total }}</span>
      </span>
      <svg class="agt-plan__chevron" [class.is-open]="isOpen()" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div class="agt-plan__panel" [class.is-open]="isOpen()">
      <div class="agt-plan__clip">
        <ol class="agt-plan__steps">
          @for (step of steps(); track step.id) {
            <li class="agt-plan__step agt-plan__step--{{ step.status }}">
              <span class="agt-plan__marker" aria-hidden="true">
                @switch (step.status) {
                  @case ('active') {
                    <svg class="agt-plan__spinner" viewBox="0 0 24 24" width="14" height="14">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.25" />
                      <path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M12 3a9 9 0 0 1 9 9" />
                    </svg>
                  }
                  @case ('done') {
                    <svg viewBox="0 0 24 24" width="13" height="13"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4 10-10" /></svg>
                  }
                  @case ('error') {
                    <svg viewBox="0 0 24 24" width="13" height="13"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
                  }
                }
              </span>
              <span class="agt-plan__label">{{ step.label }}</span>
              <span class="agt-plan__sr">{{ statusLabel(step.status) }}</span>
            </li>
          }
        </ol>
      </div>
    </div>
  `,
  styleUrl: './agt-plan.scss',
})
export class AgtPlan {
  readonly steps = input.required<PlanStep[]>();
  readonly title = input('Plan');

  protected readonly isOpen = signal(true);

  protected readonly progress = computed(() => {
    const steps = this.steps();
    return { done: steps.filter((s) => s.status === 'done').length, total: steps.length };
  });

  protected readonly overall = computed<PlanStepStatus>(() => {
    const steps = this.steps();
    if (steps.some((s) => s.status === 'error')) return 'error';
    if (steps.some((s) => s.status === 'active')) return 'active';
    if (steps.length > 0 && steps.every((s) => s.status === 'done')) return 'done';
    return 'pending';
  });

  protected statusLabel(status: PlanStepStatus): string {
    return STATUS_LABEL[status];
  }

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }
}
