import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AgtSidebar } from './agt-sidebar';

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(AgtSidebar);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return fixture;
}

describe('AgtSidebar', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('shows the FAB with a badge and an inert panel when closed', () => {
    const el = render({ badge: 3 }).nativeElement as HTMLElement;
    const fab = el.querySelector('.agt-sidebar__fab');
    expect(fab?.classList.contains('is-hidden')).toBe(false);
    expect(el.querySelector('.agt-sidebar__badge')?.textContent).toContain('3');
    expect(fab?.getAttribute('aria-label')).toContain('3 new');
    expect(el.querySelector('.agt-sidebar__panel')?.hasAttribute('inert')).toBe(true);
  });

  it('opens the panel when the FAB is clicked', () => {
    const fixture = render();
    (fixture.nativeElement.querySelector('.agt-sidebar__fab') as HTMLButtonElement).click();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.open()).toBe(true);
    expect(el.querySelector('.agt-sidebar__panel')?.classList.contains('is-open')).toBe(true);
    expect(el.querySelector('.agt-sidebar__fab')?.classList.contains('is-hidden')).toBe(true);
  });

  it('closes when the close button is clicked', () => {
    const fixture = render({ open: true });
    (fixture.nativeElement.querySelector('.agt-sidebar__close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
