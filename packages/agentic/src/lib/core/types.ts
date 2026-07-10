import type { Observable } from 'rxjs';

export type ToolCallStatus = 'running' | 'success' | 'error';
export type PlanStepStatus = 'pending' | 'active' | 'done' | 'error';
export type MessageRole = 'user' | 'agent';

/**
 * The event contract an agent backend streams to the UI. Intentionally a small,
 * AG-UI-compatible subset: text deltas, tool calls, plan steps, human-in-the-loop
 * approvals, and terminal done/error. A consumer's transport (SSE/WebSocket/fixtures)
 * emits these; the kit only renders them.
 */
export type AgentEvent =
  | { type: 'text'; delta: string }
  | { type: 'tool_call'; id: string; name: string; status: ToolCallStatus; detail?: unknown }
  | { type: 'step'; id: string; label: string; status: PlanStepStatus }
  | { type: 'approval_request'; id: string; action: string; payload?: unknown }
  | { type: 'done' }
  | { type: 'error'; message: string };

export interface AgentMessage {
  id: string;
  role: MessageRole;
  content: string;
  streaming: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  status: ToolCallStatus;
  detail?: unknown;
}

export interface PlanStep {
  id: string;
  label: string;
  status: PlanStepStatus;
}

export interface ApprovalRequest {
  id: string;
  action: string;
  payload?: unknown;
}

export interface AgentInput {
  message: string;
  context?: unknown;
}

/**
 * Bridges an agent backend to the kit. `run()` streams {@link AgentEvent}s for a
 * turn; `respondToApproval()` optionally resumes a human-in-the-loop run.
 */
export interface AgentTransport {
  run(input: AgentInput): Observable<AgentEvent>;
  respondToApproval?(id: string, approved: boolean): void;
}
