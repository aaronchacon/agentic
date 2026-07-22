// Theming
export { provideAgentic } from './lib/theming/provide-agentic';
export type {
  AgenticConfig,
  AgenticThemeConfig,
} from './lib/theming/provide-agentic';
export { AgenticThemeService } from './lib/theming/agentic-theme.service';

// Labels / i18n
export {
  AGT_DEFAULT_LABELS,
  AGT_LABELS,
  injectLabels,
} from './lib/core/labels';
export type { AgtLabels, AgtLabelsInput } from './lib/core/labels';

// Components
export { AgtChat } from './lib/components/chat/agt-chat';
export { AgtReasoning } from './lib/components/chat/agt-reasoning';
export { AgtStreamText } from './lib/components/chat/agt-stream-text';
export type { StreamSpeed } from './lib/components/chat/agt-stream-text';
export { AgtToolCall } from './lib/components/tool-call/agt-tool-call';
export { AgtSuggestion } from './lib/components/suggestion/agt-suggestion';
export { AgtSummary } from './lib/components/summary/agt-summary';
export { AgtSidebar } from './lib/components/sidebar/agt-sidebar';
export { AgtPlan } from './lib/components/plan/agt-plan';
export { AgtApproval } from './lib/components/approval/agt-approval';

// Runtime
export { injectAgent } from './lib/core/agent-store';
export type { AgentStore, AgentConfig } from './lib/core/agent-store';
export { createFixtureTransport } from './lib/core/fixture-transport';
export type {
  FixtureScript,
  FixtureEvent,
  FixtureOptions,
} from './lib/core/fixture-transport';
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
