import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { renderMarkdown } from './markdown';

/** How fast streamed text is revealed. Named presets are words/second; a number is words/second too. */
export type StreamSpeed = 'instant' | 'slow' | 'smooth' | 'fast' | number;

const WORDS_PER_SECOND: Record<string, number> = {
  slow: 7,
  smooth: 16,
  fast: 36,
};

function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Renders streamed agent text as **markdown** (headings, lists, tables, links,
 * inline + fenced code with a copy button). Text is revealed at a steady,
 * configurable cadence (buffered) so bursty token arrival still reads smoothly,
 * with a trailing gradient cursor while streaming. Falls back to instant render
 * when not streaming, for `speed: 'instant'`, under reduced-motion, or without rAF.
 */
@Component({
  selector: 'agt-stream-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    #md
    class="agt-md"
    [class.agt-md--streaming]="streaming()"
    [innerHTML]="html()"
  ></div>`,
  styleUrl: './agt-stream-text.scss',
})
export class AgtStreamText {
  readonly text = input.required<string>();
  readonly streaming = input(false);
  readonly speed = input<StreamSpeed>('smooth');

  private readonly mdEl = viewChild<ElementRef<HTMLElement>>('md');
  private readonly targetTokens = signal<string[]>([]);
  private readonly revealedCount = signal(0);
  protected readonly html = computed(() =>
    renderMarkdown(this.targetTokens().slice(0, this.revealedCount()).join('')),
  );

  private wps = WORDS_PER_SECOND['smooth'];
  private running = false;
  private raf = 0;
  private lastTime = 0;
  private carry = 0;

  constructor() {
    const hasRaf = typeof requestAnimationFrame !== 'undefined';

    effect(() => {
      const tokens = tokenize(this.text());
      this.targetTokens.set(tokens);
      const speed = this.speed();
      this.wps =
        typeof speed === 'number'
          ? speed
          : (WORDS_PER_SECOND[speed] ?? WORDS_PER_SECOND['smooth']);

      const instant =
        speed === 'instant' ||
        this.streaming() === false ||
        prefersReducedMotion() ||
        !hasRaf;
      if (instant) {
        this.stop();
        this.revealedCount.set(tokens.length);
      } else if (!this.running) {
        this.start();
      }
    });

    // Attach "copy" buttons to code blocks after each markdown render.
    afterRenderEffect(() => {
      this.html();
      this.enhanceCodeBlocks();
    });

    inject(DestroyRef).onDestroy(() => this.stop());
  }

  private start(): void {
    this.running = true;
    this.lastTime = 0;
    this.carry = 0;

    const tick = (now: number) => {
      if (!this.running) return;
      if (this.lastTime === 0) this.lastTime = now;
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;

      const total = this.targetTokens().length;
      const current = this.revealedCount();
      if (current >= total) {
        // Caught up: stop the loop (no idle 60fps spin). The effect restarts it
        // when more tokens arrive; once streaming ends the effect reveals the rest.
        this.carry = 0;
        this.running = false;
        return;
      }
      this.carry += dt * this.wps;
      const step = Math.floor(this.carry);
      if (step >= 1) {
        const next = Math.min(total, current + step);
        this.carry -= next - current;
        this.revealedCount.set(next);
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stop(): void {
    this.running = false;
    if (typeof cancelAnimationFrame !== 'undefined')
      cancelAnimationFrame(this.raf);
  }

  /** Wrap each `<pre>` in a VS Code-like card with a header (language + copy button). */
  private enhanceCodeBlocks(): void {
    const root = this.mdEl()?.nativeElement;
    if (!root) return;
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement?.classList.contains('agt-code')) return;
      const codeEl = pre.querySelector('code');

      const card = document.createElement('div');
      card.className = 'agt-code';

      const head = document.createElement('div');
      head.className = 'agt-code__head';

      const lang = document.createElement('span');
      lang.className = 'agt-code__lang';
      lang.textContent = languageOf(codeEl);

      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'agt-code__copy';
      copy.setAttribute('aria-label', 'Copy code');
      copy.textContent = 'Copy';
      copy.addEventListener('click', () => {
        const text = codeEl?.textContent ?? pre.textContent ?? '';
        navigator.clipboard?.writeText(text);
        copy.textContent = 'Copied';
        setTimeout(() => (copy.textContent = 'Copy'), 1200);
      });

      head.append(lang, copy);
      pre.parentNode?.insertBefore(card, pre);
      card.append(head, pre);
    });
  }
}

function languageOf(codeEl: Element | null): string {
  const match = /language-(\w+)/.exec(codeEl?.className ?? '');
  return match ? match[1] : 'code';
}
