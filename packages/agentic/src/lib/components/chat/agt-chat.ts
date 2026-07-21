import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { AgentStore } from '../../core/agent-store';
import { AgtReasoning } from './agt-reasoning';
import { AgtStreamText, type StreamSpeed } from './agt-stream-text';

/**
 * Full chat surface: a centered conversation column with right-aligned
 * user bubbles and full-width assistant turns (no avatar), smooth markdown
 * streaming, a collapsible reasoning block, a thinking indicator, an empty state
 * with suggestions, and an auto-growing rounded composer.
 *
 * Presentational: reads/writes a shared {@link AgentStore} passed in.
 */
@Component({
  selector: 'agt-chat',
  imports: [AgtStreamText, AgtReasoning],
  templateUrl: './agt-chat.html',
  styleUrl: './agt-chat.scss',
  host: { class: 'agt-chat' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgtChat {
  readonly store = input.required<AgentStore>();
  readonly placeholder = input('Ask anything');
  /** Accessible label for the composer (a placeholder is not a reliable label). */
  readonly ariaLabel = input('Message');
  readonly emptyTitle = input('What can I help with?');
  readonly suggestions = input<string[]>([]);
  /** Streaming reveal speed: `'instant' | 'slow' | 'smooth' | 'fast'` or words/second. */
  readonly streamSpeed = input<StreamSpeed>('smooth');

  protected readonly draft = signal('');

  private readonly scrollEl = viewChild<ElementRef<HTMLElement>>('scroll');
  private readonly inputEl =
    viewChild<ElementRef<HTMLTextAreaElement>>('input');
  /** Whether the transcript is pinned to the bottom (auto-scroll follows new content). */
  private stick = true;

  /** Show the thinking indicator while running and before the first agent token. */
  protected readonly thinking = computed(() => {
    const store = this.store();
    const messages = store.messages();
    return (
      store.isRunning() &&
      (messages.length === 0 || messages[messages.length - 1].role === 'user')
    );
  });

  constructor() {
    // Keep the transcript pinned to the bottom as content streams in — unless the user scrolled up.
    afterRenderEffect(() => {
      this.store().messages();
      this.thinking();
      if (!this.stick) return;
      const el = this.scrollEl()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  protected onScroll(el: HTMLElement): void {
    this.stick = el.scrollHeight - el.scrollTop - el.clientHeight < 64;
  }

  protected onInput(el: HTMLTextAreaElement): void {
    this.draft.set(el.value);
    this.grow(el);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.dispatch();
  }

  // Angular types `$event` for the `keydown.enter` pseudo-event as the generic
  // `Event`, so we narrow to `KeyboardEvent` here to read `shiftKey`.
  protected onEnter(event: Event): void {
    if (!(event as KeyboardEvent).shiftKey) {
      event.preventDefault();
      this.dispatch();
    }
  }

  protected sendSuggestion(text: string): void {
    this.draft.set(text);
    this.dispatch();
  }

  private dispatch(): void {
    const text = this.draft().trim();
    if (!text || this.store().isRunning()) return;
    this.store().send(text);
    this.draft.set('');
    const el = this.inputEl()?.nativeElement;
    if (el) el.style.height = 'auto';
  }

  private grow(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }
}
