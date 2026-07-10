import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AgtReasoning } from './agt-reasoning';

describe('AgtReasoning', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('shows a "Thought for…" trigger and renders the reasoning markdown when idle', () => {
    const fixture = TestBed.createComponent(AgtReasoning);
    fixture.componentRef.setInput('content', 'Step one is **important**');
    fixture.componentRef.setInput('streaming', false);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Thought for');
    expect(el.querySelector('.agt-reasoning__panel')?.classList.contains('is-open')).toBe(false);
    expect(el.innerHTML).toContain('<strong>important</strong>');
  });

  it('shows the shimmering "Thinking…" label and opens while streaming', () => {
    const fixture = TestBed.createComponent(AgtReasoning);
    fixture.componentRef.setInput('content', 'Let me think');
    fixture.componentRef.setInput('streaming', true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.agt-reasoning__shimmer')?.textContent).toContain('Thinking');
    expect(el.querySelector('.agt-reasoning__panel')?.classList.contains('is-open')).toBe(true);
  });
});
