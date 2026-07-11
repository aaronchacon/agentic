import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { injectAgent, type AgentStore } from './agent-store';
import { createFixtureTransport } from './fixture-transport';
import type { AgentTransport } from './types';

function makeStore(transport: AgentTransport): AgentStore {
  return TestBed.runInInjectionContext(() => injectAgent({ transport }));
}

describe('injectAgent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('accumulates streaming text into a single agent message', () => {
    const store = makeStore(
      createFixtureTransport(
        [
          { type: 'text', delta: 'Hel' },
          { type: 'text', delta: 'lo' },
          { type: 'done' },
        ],
        { immediate: true },
      ),
    );

    store.send('hi');

    const messages = store.messages();
    expect(messages.map((m) => m.role)).toEqual(['user', 'agent']);
    expect(messages[1].content).toBe('Hello');
    expect(messages[1].streaming).toBe(false);
    expect(store.isRunning()).toBe(false);
  });

  it('tracks tool calls and plan steps, updating by id', () => {
    const store = makeStore(
      createFixtureTransport(
        [
          {
            type: 'tool_call',
            id: 'tc1',
            name: 'verify_document',
            status: 'running',
          },
          { type: 'step', id: 's1', label: 'Extract', status: 'active' },
          {
            type: 'tool_call',
            id: 'tc1',
            name: 'verify_document',
            status: 'success',
          },
          { type: 'step', id: 's1', label: 'Extract', status: 'done' },
          { type: 'done' },
        ],
        { immediate: true },
      ),
    );

    store.send('go');

    expect(store.toolCalls()).toHaveLength(1);
    expect(store.toolCalls()[0].status).toBe('success');
    expect(store.plan()).toHaveLength(1);
    expect(store.plan()[0].status).toBe('done');
  });

  it('surfaces human-in-the-loop approvals and resumes on approve()', () => {
    const store = makeStore(
      createFixtureTransport(
        [
          { type: 'approval_request', id: 'a1', action: 'run_check' },
          { type: 'text', delta: 'done check' },
          { type: 'done' },
        ],
        { immediate: true },
      ),
    );

    store.send('go');
    expect(store.pendingApproval()?.id).toBe('a1');
    expect(store.isRunning()).toBe(true);

    store.approve('a1');
    expect(store.pendingApproval()).toBeNull();
    const afterApproval = store.messages();
    expect(afterApproval[afterApproval.length - 1].content).toBe('done check');
    expect(store.isRunning()).toBe(false);
  });

  it('captures error events and stops streaming', () => {
    const store = makeStore(
      createFixtureTransport(
        [
          { type: 'text', delta: 'partial' },
          { type: 'error', message: 'rate limited' },
        ],
        { immediate: true },
      ),
    );

    store.send('go');
    expect(store.error()).toBe('rate limited');
    expect(store.isRunning()).toBe(false);
    const finalMessages = store.messages();
    expect(finalMessages[finalMessages.length - 1].streaming).toBe(false);
  });

  it('attaches streamed reasoning to the agent message before the answer', () => {
    const store = makeStore(
      createFixtureTransport(
        [
          { type: 'reasoning', delta: 'Checking the case… ' },
          { type: 'reasoning', delta: 'no sanctions hits.' },
          { type: 'text', delta: 'Approved.' },
          { type: 'done' },
        ],
        { immediate: true },
      ),
    );

    store.send('go');
    const agent = store.messages()[1];
    expect(agent.reasoning).toBe('Checking the case… no sanctions hits.');
    expect(agent.reasoningStreaming).toBe(false);
    expect(agent.content).toBe('Approved.');
    expect(agent.streaming).toBe(false);
  });

  it('keeps reasoningStreaming true while only reasoning arrives', () => {
    const store = makeStore(
      createFixtureTransport([{ type: 'reasoning', delta: 'thinking…' }], {
        immediate: true,
      }),
    );

    store.send('go');
    const agent = store.messages()[1];
    expect(agent.reasoning).toBe('thinking…');
    expect(agent.reasoningStreaming).toBe(true);
  });

  it('reset() clears all state', () => {
    const store = makeStore(
      createFixtureTransport([{ type: 'text', delta: 'x' }, { type: 'done' }], {
        immediate: true,
      }),
    );
    store.send('go');
    store.reset();
    expect(store.messages()).toEqual([]);
    expect(store.toolCalls()).toEqual([]);
    expect(store.isRunning()).toBe(false);
  });
});
