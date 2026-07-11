import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AgtApproval } from './agt-approval';

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(AgtApproval);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return fixture;
}

describe('AgtApproval', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('shows the action and approve/reject controls when pending', () => {
    const el = render({
      action: 'Auto-approve case #1',
      detail: { risk: 'low' },
    }).nativeElement as HTMLElement;
    expect(el.querySelector('.agt-approval__action')?.textContent).toContain(
      'Auto-approve case #1',
    );
    expect(el.textContent).toContain('risk');
    expect(el.querySelector('.agt-approval__btn--approve')).toBeTruthy();
    expect(el.querySelector('.agt-approval__btn--reject')).toBeTruthy();
    expect(el.querySelector('.agt-approval__btn--ghost')).toBeNull(); // no Edit unless editable
  });

  it('emits approve and moves to the approved state', () => {
    const fixture = render({ action: 'x' });
    let emitted = false;
    fixture.componentInstance.approve.subscribe(() => (emitted = true));
    (
      fixture.nativeElement.querySelector(
        '.agt-approval__btn--approve',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(emitted).toBe(true);
    expect(fixture.componentInstance.state()).toBe('approved');
    expect(
      el.querySelector('.agt-approval__status--approved')?.textContent,
    ).toContain('Approved');
    expect(el.querySelector('.agt-approval__actions')).toBeNull();
  });

  it('emits reject and moves to the rejected state', () => {
    const fixture = render({ action: 'x' });
    let emitted = false;
    fixture.componentInstance.reject.subscribe(() => (emitted = true));
    (
      fixture.nativeElement.querySelector(
        '.agt-approval__btn--reject',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(emitted).toBe(true);
    expect(fixture.componentInstance.state()).toBe('rejected');
    expect(
      fixture.nativeElement.querySelector('.agt-approval__status--rejected'),
    ).toBeTruthy();
  });

  it('shows an Edit button when editable', () => {
    const el = render({ action: 'x', editable: true })
      .nativeElement as HTMLElement;
    expect(
      el.querySelector('.agt-approval__btn--ghost')?.textContent,
    ).toContain('Edit');
  });
});
