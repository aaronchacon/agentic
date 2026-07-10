import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PlanStep } from '../../core/types';
import { AgtPlan } from './agt-plan';

function render(steps: PlanStep[], title = 'Plan') {
  const fixture = TestBed.createComponent(AgtPlan);
  fixture.componentRef.setInput('steps', steps);
  fixture.componentRef.setInput('title', title);
  fixture.detectChanges();
  return fixture;
}

const mixed: PlanStep[] = [
  { id: '1', label: 'Extract', status: 'done' },
  { id: '2', label: 'Match', status: 'done' },
  { id: '3', label: 'Screen', status: 'active' },
  { id: '4', label: 'Score', status: 'pending' },
];

describe('AgtPlan', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('renders each step with its status and a progress summary', () => {
    const el = render(mixed).nativeElement as HTMLElement;
    expect(el.querySelectorAll('.agt-plan__step').length).toBe(4);
    expect(el.querySelectorAll('.agt-plan__step--done').length).toBe(2);
    expect(el.querySelector('.agt-plan__step--active')).toBeTruthy();
    expect(el.querySelector('.agt-plan__progress')?.textContent).toContain('2/4');
    expect(el.querySelector('.agt-plan__overall--active')).toBeTruthy();
  });

  it('marks the overall status as done when every step is done', () => {
    const el = render(mixed.map((s) => ({ ...s, status: 'done' as const }))).nativeElement as HTMLElement;
    expect(el.querySelector('.agt-plan__overall--done')).toBeTruthy();
    expect(el.querySelector('.agt-plan__progress')?.textContent).toContain('4/4');
  });

  it('marks the overall status as error when a step fails', () => {
    const steps = mixed.map((s) => (s.id === '3' ? { ...s, status: 'error' as const } : s));
    const el = render(steps).nativeElement as HTMLElement;
    expect(el.querySelector('.agt-plan__overall--error')).toBeTruthy();
  });

  it('collapses when the header is clicked', () => {
    const fixture = render(mixed);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.agt-plan__panel')?.classList.contains('is-open')).toBe(true);
    (el.querySelector('.agt-plan__header') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.agt-plan__panel')?.classList.contains('is-open')).toBe(false);
  });
});
