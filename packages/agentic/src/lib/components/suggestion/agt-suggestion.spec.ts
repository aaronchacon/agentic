import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AgtSuggestion } from './agt-suggestion';

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(AgtSuggestion);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return fixture;
}

function stateOf(el: HTMLElement): string | null {
  return el.querySelector('.agt-suggestion__field')?.getAttribute('data-state') ?? null;
}

describe('AgtSuggestion', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('shows the suggested state with ghost text, confidence and accept/reject', () => {
    const el = render({ label: 'Full name', suggestion: 'Ada Lovelace', confidence: 0.98 })
      .nativeElement as HTMLElement;
    expect(stateOf(el)).toBe('suggested');
    expect(el.querySelector('.agt-suggestion__ghost')?.textContent).toContain('Ada Lovelace');
    expect(el.querySelector('.agt-suggestion__accept')).toBeTruthy();
    expect(el.querySelector('.agt-suggestion__hint')?.textContent).toContain('98%');
  });

  it('accepts the suggestion → AI badge with confidence', () => {
    const fixture = render({ suggestion: 'Ada Lovelace', confidence: 0.98 });
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.agt-suggestion__accept') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('Ada Lovelace');
    expect(stateOf(el)).toBe('accepted');
    expect(el.querySelector('.agt-suggestion__badge--ai')?.textContent).toContain('98%');
  });

  it('marks an edited AI value as "Edited by human"', () => {
    const el = render({ suggestion: 'Ada Lovelace', value: 'Ada K. Lovelace', accepted: true })
      .nativeElement as HTMLElement;
    expect(stateOf(el)).toBe('edited');
    expect(el.querySelector('.agt-suggestion__badge--edited')?.textContent).toContain(
      'Edited by human',
    );
  });

  it('reject dismisses the suggestion', () => {
    const fixture = render({ suggestion: 'Ada Lovelace' });
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.agt-suggestion__reject') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(stateOf(el)).toBe('idle');
  });
});
