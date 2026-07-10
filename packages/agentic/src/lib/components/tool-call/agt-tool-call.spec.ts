import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ToolCall } from '../../core/types';
import { AgtToolCall } from './agt-tool-call';

function render(toolCall: ToolCall, steps: string[] = []) {
  const fixture = TestBed.createComponent(AgtToolCall);
  fixture.componentRef.setInput('toolCall', toolCall);
  fixture.componentRef.setInput('steps', steps);
  fixture.detectChanges();
  return fixture;
}

describe('AgtToolCall', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('shows a running badge, spinner and steps (expanded)', () => {
    const el = render({ id: '1', name: 'verify_document', status: 'running' }, ['Scoring risk'])
      .nativeElement as HTMLElement;
    expect(el.querySelector('.agt-tool__badge--running')?.textContent).toContain('Running');
    expect(el.querySelector('.agt-tool__spinner')).toBeTruthy();
    expect(el.querySelector('.agt-tool__name')?.textContent).toContain('verify_document');
    expect(el.textContent).toContain('Scoring risk');
    expect(el.querySelector('.agt-tool__panel')?.classList.contains('is-open')).toBe(true);
  });

  it('renders a success detail as a JSON result', () => {
    const el = render({ id: '2', name: 'verify_document', status: 'success', detail: { confidence: 0.98 } })
      .nativeElement as HTMLElement;
    expect(el.querySelector('.agt-tool__badge--success')?.textContent).toContain('Completed');
    expect(el.textContent).toContain('Result');
    expect(el.textContent).toContain('0.98');
  });

  it('shows the error detail expanded', () => {
    const el = render({ id: '3', name: 'screen_sanctions', status: 'error', detail: 'Timeout (503).' })
      .nativeElement as HTMLElement;
    expect(el.querySelector('.agt-tool__badge--error')?.textContent).toContain('Error');
    expect(el.querySelector('.agt-tool__panel')?.classList.contains('is-open')).toBe(true);
    expect(el.textContent).toContain('Timeout (503).');
  });

  it('toggles open state on header click', () => {
    const fixture = render({ id: '4', name: 'x', status: 'error', detail: 'boom' });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.agt-tool__panel')?.classList.contains('is-open')).toBe(true);

    (el.querySelector('.agt-tool__header') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.agt-tool__panel')?.classList.contains('is-open')).toBe(false);
  });
});
