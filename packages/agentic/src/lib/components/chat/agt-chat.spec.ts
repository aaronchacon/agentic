import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { injectAgent, type AgentStore } from '../../core/agent-store';
import { createFixtureTransport } from '../../core/fixture-transport';
import { AgtChat } from './agt-chat';

function storeWith(events: Parameters<typeof createFixtureTransport>[0]): AgentStore {
  return TestBed.runInInjectionContext(() =>
    injectAgent({ transport: createFixtureTransport(events, { immediate: true }) }),
  );
}

describe('AgtChat', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('shows the empty state with suggestions and sends on click', () => {
    const store = storeWith([{ type: 'text', delta: 'Hi there' }, { type: 'done' }]);
    const fixture = TestBed.createComponent(AgtChat);
    fixture.componentRef.setInput('store', store);
    fixture.componentRef.setInput('suggestions', ['Summarize this case']);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.agt-chat__empty')).toBeTruthy();

    (host.querySelector('.agt-chat__suggestion') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(store.messages().map((m) => m.role)).toEqual(['user', 'agent']);
    expect(host.textContent).toContain('Hi there');
    expect(host.querySelector('.agt-chat__empty')).toBeNull();
  });

  it('disables the composer while a run is streaming', () => {
    // No `done` event -> the run stays "running".
    const store = storeWith([{ type: 'text', delta: '...' }]);
    const fixture = TestBed.createComponent(AgtChat);
    fixture.componentRef.setInput('store', store);
    fixture.detectChanges();

    store.send('hello');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('.agt-chat__textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
    expect(store.isRunning()).toBe(true);
  });
});
