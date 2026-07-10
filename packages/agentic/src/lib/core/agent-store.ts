import { DestroyRef, Signal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Subscription } from 'rxjs';
import type {
  AgentEvent,
  AgentMessage,
  AgentTransport,
  ApprovalRequest,
  PlanStep,
  ToolCall,
} from './types';

export interface AgentConfig {
  transport: AgentTransport;
}

/** Reactive, signal-based view over an agent run. Returned by {@link injectAgent}. */
export interface AgentStore {
  readonly messages: Signal<AgentMessage[]>;
  readonly toolCalls: Signal<ToolCall[]>;
  readonly plan: Signal<PlanStep[]>;
  readonly pendingApproval: Signal<ApprovalRequest | null>;
  readonly isRunning: Signal<boolean>;
  readonly error: Signal<string | null>;
  /** Send a user message and start streaming the agent's response. */
  send(message: string, context?: unknown): void;
  /** Approve a pending human-in-the-loop request and resume the run. */
  approve(id: string): void;
  /** Reject a pending human-in-the-loop request and resume the run. */
  reject(id: string): void;
  /** Clear all state and cancel any in-flight run. */
  reset(): void;
}

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

/**
 * Wires a {@link AgentTransport} into reactive signals. Call from an injection
 * context (component/directive/service). Auto-unsubscribes on destroy.
 *
 * ```ts
 * readonly agent = injectAgent({ transport: createFixtureTransport(script) });
 * // template: @for (m of agent.messages(); track m.id) { ... }
 * ```
 */
export function injectAgent(config: AgentConfig): AgentStore {
  const destroyRef = inject(DestroyRef);
  const { transport } = config;

  const messages = signal<AgentMessage[]>([]);
  const toolCalls = signal<ToolCall[]>([]);
  const plan = signal<PlanStep[]>([]);
  const pendingApproval = signal<ApprovalRequest | null>(null);
  const isRunning = signal(false);
  const error = signal<string | null>(null);

  let activeAgentId: string | null = null;
  let sub: Subscription | null = null;

  function ensureAgentMessage(): string {
    if (activeAgentId === null) {
      const id = uid('agent');
      activeAgentId = id;
      messages.update((list) => [
        ...list,
        { id, role: 'agent', content: '', reasoning: '', streaming: true, reasoningStreaming: false },
      ]);
    }
    return activeAgentId;
  }

  function appendReasoning(delta: string): void {
    const id = ensureAgentMessage();
    messages.update((list) =>
      list.map((m) =>
        m.id === id ? { ...m, reasoning: m.reasoning + delta, reasoningStreaming: true } : m,
      ),
    );
  }

  function appendDelta(delta: string): void {
    const id = ensureAgentMessage();
    messages.update((list) =>
      list.map((m) =>
        m.id === id ? { ...m, content: m.content + delta, reasoningStreaming: false } : m,
      ),
    );
  }

  function finishStreaming(): void {
    const id = activeAgentId;
    if (id !== null) {
      messages.update((list) =>
        list.map((m) => (m.id === id ? { ...m, streaming: false, reasoningStreaming: false } : m)),
      );
    }
    activeAgentId = null;
  }

  function upsertToolCall(next: ToolCall): void {
    toolCalls.update((list) => {
      const i = list.findIndex((t) => t.id === next.id);
      if (i === -1) return [...list, next];
      const copy = [...list];
      copy[i] = { ...copy[i], ...next };
      return copy;
    });
  }

  function upsertStep(next: PlanStep): void {
    plan.update((list) => {
      const i = list.findIndex((s) => s.id === next.id);
      if (i === -1) return [...list, next];
      const copy = [...list];
      copy[i] = { ...copy[i], ...next };
      return copy;
    });
  }

  function handle(event: AgentEvent): void {
    switch (event.type) {
      case 'reasoning':
        appendReasoning(event.delta);
        break;
      case 'text':
        appendDelta(event.delta);
        break;
      case 'tool_call':
        upsertToolCall({ id: event.id, name: event.name, status: event.status, detail: event.detail });
        break;
      case 'step':
        upsertStep({ id: event.id, label: event.label, status: event.status });
        break;
      case 'approval_request':
        pendingApproval.set({ id: event.id, action: event.action, payload: event.payload });
        break;
      case 'done':
        finishStreaming();
        isRunning.set(false);
        break;
      case 'error':
        error.set(event.message);
        finishStreaming();
        isRunning.set(false);
        break;
    }
  }

  function send(message: string, context?: unknown): void {
    error.set(null);
    activeAgentId = null;
    messages.update((list) => [
      ...list,
      {
        id: uid('user'),
        role: 'user',
        content: message,
        reasoning: '',
        streaming: false,
        reasoningStreaming: false,
      },
    ]);
    isRunning.set(true);
    sub?.unsubscribe();
    sub = transport
      .run({ message, context })
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: handle,
        error: (err: unknown) => {
          error.set(err instanceof Error ? err.message : String(err));
          finishStreaming();
          isRunning.set(false);
        },
      });
  }

  function approve(id: string): void {
    pendingApproval.set(null);
    transport.respondToApproval?.(id, true);
  }

  function reject(id: string): void {
    pendingApproval.set(null);
    transport.respondToApproval?.(id, false);
  }

  function reset(): void {
    sub?.unsubscribe();
    sub = null;
    activeAgentId = null;
    messages.set([]);
    toolCalls.set([]);
    plan.set([]);
    pendingApproval.set(null);
    isRunning.set(false);
    error.set(null);
  }

  return {
    messages: messages.asReadonly(),
    toolCalls: toolCalls.asReadonly(),
    plan: plan.asReadonly(),
    pendingApproval: pendingApproval.asReadonly(),
    isRunning: isRunning.asReadonly(),
    error: error.asReadonly(),
    send,
    approve,
    reject,
    reset,
  };
}
