import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { AgtStreamText, type StreamSpeed } from './agt-stream-text';

const AUTO_CLOSE_DELAY = 1000;

/**
 * Collapsible chain-of-thought display. Auto-opens while
 * reasoning streams and auto-closes ~1s after it finishes; shows a shimmering
 * "Thinking…" while active and "Thought for Ns" once done. The reasoning text
 * streams inside via {@link AgtStreamText}.
 */
@Component({
  selector: 'agt-reasoning',
  imports: [AgtStreamText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="agt-reasoning__trigger"
      [attr.aria-expanded]="isOpen()"
      (click)="toggle()"
    >
      <svg
        class="agt-reasoning__icon"
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
          d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 5 2.5 2.5 0 0 0 5 .5V4.5A2.5 2.5 0 0 0 9 4Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-2 5 2.5 2.5 0 0 1-5 .5"
        />
      </svg>
      @if (streaming()) {
        <span class="agt-reasoning__shimmer">Thinking…</span>
      } @else if (displayDuration() !== undefined) {
        <span
          >Thought for {{ displayDuration() }} second{{
            displayDuration() === 1 ? '' : 's'
          }}</span
        >
      } @else {
        <span>Thought for a few seconds</span>
      }
      <svg
        class="agt-reasoning__chevron"
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

    <div class="agt-reasoning__panel" [class.is-open]="isOpen()">
      <div class="agt-reasoning__panel-inner">
        <agt-stream-text
          [text]="content()"
          [streaming]="streaming()"
          [speed]="speed()"
        />
      </div>
    </div>
  `,
  styleUrl: './agt-reasoning.scss',
})
export class AgtReasoning {
  readonly content = input.required<string>();
  readonly streaming = input(false);
  readonly speed = input<StreamSpeed>('fast');
  /** Optional externally-provided duration (seconds); otherwise measured internally. */
  readonly duration = input<number | undefined>(undefined);

  protected readonly isOpen = signal(false);
  private readonly measured = signal<number | undefined>(undefined);
  protected readonly displayDuration = computed(
    () => this.duration() ?? this.measured(),
  );

  private startTime: number | null = null;
  private hasStreamed = false;
  private autoClosed = false;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const streaming = this.streaming();
      if (streaming) {
        this.hasStreamed = true;
        if (this.startTime === null) this.startTime = Date.now();
        if (this.closeTimer) {
          clearTimeout(this.closeTimer);
          this.closeTimer = null;
        }
        this.isOpen.set(true);
      } else {
        if (this.startTime !== null) {
          this.measured.set(
            Math.max(1, Math.ceil((Date.now() - this.startTime) / 1000)),
          );
          this.startTime = null;
        }
        if (this.hasStreamed && !this.autoClosed) {
          this.closeTimer = setTimeout(() => {
            this.isOpen.set(false);
            this.autoClosed = true;
          }, AUTO_CLOSE_DELAY);
        }
      }
    });

    inject(DestroyRef).onDestroy(() => {
      if (this.closeTimer) clearTimeout(this.closeTimer);
    });
  }

  protected toggle(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.autoClosed = true; // manual control cancels auto-close
    this.isOpen.update((open) => !open);
  }
}
