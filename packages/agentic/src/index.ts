// Theming
export { provideAgentic } from './lib/theming/provide-agentic';
export type { AgenticConfig, AgenticThemeConfig } from './lib/theming/provide-agentic';
export { AgenticThemeService } from './lib/theming/agentic-theme.service';

// Runtime
export { injectAgent } from './lib/core/agent-store';
export type { AgentStore, AgentConfig } from './lib/core/agent-store';
export { createFixtureTransport } from './lib/core/fixture-transport';
export type { FixtureScript, FixtureEvent, FixtureOptions } from './lib/core/fixture-transport';
export type {
  AgentEvent,
  AgentTransport,
  AgentInput,
  AgentMessage,
  ToolCall,
  PlanStep,
  ApprovalRequest,
  ToolCallStatus,
  PlanStepStatus,
  MessageRole,
} from './lib/core/types';
