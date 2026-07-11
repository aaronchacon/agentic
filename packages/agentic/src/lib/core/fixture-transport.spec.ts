import { describe, expect, it } from 'vitest';
import { createFixtureTransport } from './fixture-transport';
import type { AgentEvent } from './types';

describe('createFixtureTransport', () => {
  it('replays events synchronously and completes in immediate mode', () => {
    const received: AgentEvent[] = [];
    let completed = false;
    const transport = createFixtureTransport(
      [
        { type: 'text', delta: 'Hi' },
        { type: 'text', delta: '!' },
        { type: 'done' },
      ],
      { immediate: true },
    );

    transport.run({ message: 'x' }).subscribe({
      next: (e) => received.push(e),
      complete: () => (completed = true),
    });

    expect(received.map((e) => e.type)).toEqual(['text', 'text', 'done']);
    expect(completed).toBe(true);
  });

  it('pauses on approval_request and resumes via respondToApproval', () => {
    const received: AgentEvent[] = [];
    const transport = createFixtureTransport(
      [
        { type: 'approval_request', id: 'a1', action: 'transfer' },
        { type: 'text', delta: 'approved' },
        { type: 'done' },
      ],
      { immediate: true },
    );

    transport
      .run({ message: 'x' })
      .subscribe({ next: (e) => received.push(e) });
    expect(received.map((e) => e.type)).toEqual(['approval_request']);

    transport.respondToApproval?.('a1', true);
    expect(received.map((e) => e.type)).toEqual([
      'approval_request',
      'text',
      'done',
    ]);
  });

  it('does not emit synchronously in timer mode and stops after unsubscribe', () => {
    const received: AgentEvent[] = [];
    const transport = createFixtureTransport([
      { type: 'text', delta: 'a' },
      { type: 'done' },
    ]);

    const sub = transport
      .run({ message: 'x' })
      .subscribe({ next: (e) => received.push(e) });
    sub.unsubscribe();

    expect(received).toEqual([]);
  });
});
