import { Observable } from 'rxjs';
import type { AgentEvent, AgentTransport } from './types';

export interface FixtureEvent {
  event: AgentEvent;
  /** Delay before this event when not in `immediate` mode (ms). */
  delayMs?: number;
}

export type FixtureScript = ReadonlyArray<AgentEvent | FixtureEvent>;

export interface FixtureOptions {
  /** Emit synchronously with no timers — ideal for unit tests. Default `false`. */
  immediate?: boolean;
  /** Default gap between events when `delayMs` is unset (ms). Default `20`. */
  defaultDelayMs?: number;
}

function normalize(item: AgentEvent | FixtureEvent): FixtureEvent {
  return 'event' in item ? item : { event: item };
}

/**
 * A transport that replays a scripted list of {@link AgentEvent}s — used by
 * Storybook, the docs site, tests, and the demo's "no API key" mode.
 *
 * On an `approval_request` event the replay pauses until `respondToApproval()`
 * is called, so human-in-the-loop flows can be demoed without a backend.
 */
export function createFixtureTransport(
  script: FixtureScript,
  options: FixtureOptions = {},
): AgentTransport {
  const immediate = options.immediate ?? false;
  const defaultDelay = options.defaultDelayMs ?? 20;
  const events = script.map(normalize);

  let resume: (() => void) | null = null;

  function run(): Observable<AgentEvent> {
    return new Observable<AgentEvent>((subscriber) => {
      let cancelled = false;
      let index = 0;
      const timers: ReturnType<typeof setTimeout>[] = [];

      const emitNext = () => {
        if (cancelled) return;
        const item = events[index];
        index += 1;
        subscriber.next(item.event);

        if (item.event.type === 'done' || item.event.type === 'error') {
          subscriber.complete();
          return;
        }
        if (item.event.type === 'approval_request') {
          resume = () => {
            resume = null;
            scheduleNext();
          };
          return;
        }
        scheduleNext();
      };

      const scheduleNext = () => {
        if (cancelled) return;
        if (index >= events.length) {
          subscriber.complete();
          return;
        }
        if (immediate) {
          emitNext();
        } else {
          const t = setTimeout(emitNext, events[index].delayMs ?? defaultDelay);
          timers.push(t);
        }
      };

      scheduleNext();

      return () => {
        cancelled = true;
        resume = null;
        timers.forEach(clearTimeout);
      };
    });
  }

  return {
    run,
    respondToApproval: () => resume?.(),
  };
}
