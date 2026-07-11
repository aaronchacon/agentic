import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import type { ToolCall } from '../../core/types';
import { AgtStreamText } from '../chat/agt-stream-text';
import { toDetailMarkdown } from '../chat/markdown';

/**
 * In-conversation tool-calling card (the differentiator). Shows a tool invocation
 * as a collapsible card with status: **running** (spinner + optional steps),
 * **success** (green badge + result) and **error** (red badge + detail). The
 * `detail` is rendered as a JSON code block. Expanded by default; the user
 * collapses it manually (no surprise auto-collapse).
 *
 * ```html
 * <agt-tool-call [toolCall]="tc" [steps]="['Fetching rules', 'Scoring']" />
 * ```
 */
@Component({
  selector: 'agt-tool-call',
  imports: [AgtStreamText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'agt-tool',
    '[class.agt-tool--running]': "toolCall().status === 'running'",
  },
  template: `
    <button
      type="button"
      class="agt-tool__header"
      [attr.aria-expanded]="isOpen()"
      (click)="toggle()"
    >
      <span class="agt-tool__title">
        <svg
          class="agt-tool__wrench"
          viewBox="0 0 24 24"
          width="15"
          height="15"
          aria-hidden="true"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.7 6.3a4 4 0 0 1-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.3 2.3-2.7-.7-.7-2.7z"
          />
        </svg>
        <span class="agt-tool__name">{{ toolCall().name }}</span>
        <span
          class="agt-tool__badge agt-tool__badge--{{ toolCall().status }}"
          role="status"
        >
          @switch (toolCall().status) {
            @case ('running') {
              <svg
                class="agt-tool__spinner"
                viewBox="0 0 24 24"
                width="13"
                height="13"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-opacity="0.25"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  d="M12 3a9 9 0 0 1 9 9"
                />
              </svg>
              Running
            }
            @case ('success') {
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
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
              Completed
            }
            @case ('error') {
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
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
              Error
            }
          }
        </span>
      </span>
      <svg
        class="agt-tool__chevron"
        [class.is-open]="isOpen()"
        viewBox="0 0 24 24"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          d="m6 9 6 6 6-6"
        />
      </svg>
    </button>

    <div class="agt-tool__panel" [class.is-open]="isOpen()">
      <div class="agt-tool__panel-clip">
        <div class="agt-tool__panel-inner">
          @if (toolCall().status === 'running') {
            @if (steps().length) {
              <ul class="agt-tool__steps">
                @for (step of steps(); track step) {
                  <li>{{ step }}</li>
                }
              </ul>
            } @else {
              <p class="agt-tool__muted">Working…</p>
            }
          }
          @if (detailMarkdown(); as detail) {
            <div
              class="agt-tool__label"
              [class.agt-tool__label--error]="toolCall().status === 'error'"
            >
              {{ toolCall().status === 'error' ? 'Error' : 'Result' }}
            </div>
            <agt-stream-text [text]="detail" [streaming]="false" />
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './agt-tool-call.scss',
})
export class AgtToolCall {
  readonly toolCall = input.required<ToolCall>();
  /** Optional progress steps shown while running. */
  readonly steps = input<string[]>([]);

  protected readonly isOpen = signal(true);

  /** The tool `detail` rendered as markdown: JSON for objects, verbatim for strings. */
  protected readonly detailMarkdown = computed(() =>
    toDetailMarkdown(this.toolCall().detail),
  );

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }
}
