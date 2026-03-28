// Core type definitions for MultiClaw

export interface AgentConfig {
  name: string;
  role: AgentRole;
  description: string;
  capabilities: string[];
}

export type AgentRole =
  | 'cto'
  | 'po'
  | 'architect'
  | 'backend'
  | 'frontend'
  | 'impl'
  | 'qa'
  | 'devops'
  | 'custom';

export interface Message {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface DiscussionSession {
  id: string;
  topic: string;
  participants: AgentRole[];
  messages: Message[];
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  agent: AgentRole;
  action: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  dependencies: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface FeishuConfig {
  appId: string;
  appSecret: string;
  chatId: string;
}

/**
 * Multi-bot configuration for 8-agent group chat
 * Each agent can have its own bot identity
 */
export interface FeishuAgentBotConfig {
  appId: string;
  appSecret: string;
}

export interface MultiBotFeishuConfig {
  chatId: string;
  agents: Record<string, FeishuAgentBotConfig>;
  /**
   * Enable single bot mode for backward compatibility
   * When true, uses only FEISHU_APP_ID/FEISHU_APP_SECRET for all agents
   */
  singleBotMode?: boolean;
}

export interface OpenClawConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface RuntimeConfig {
  openclaw: OpenClawConfig;
  feishu?: FeishuConfig;
  multiBotFeishu?: MultiBotFeishuConfig;
  logLevel?: string;
}

export interface VisibleDiscussionOptions {
  maxMessages?: number;
  summarizeThreshold?: number;
  enableWorkSummary?: boolean;
}

export interface HandoffResult {
  from: AgentRole;
  to: AgentRole;
  context: Record<string, unknown>;
  timestamp: Date;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: {
    openclaw: boolean;
    feishu?: boolean;
    runtime: boolean;
  };
  timestamp: Date;
}

// ===========================================
// 8-Agent Group Chat Types
// ===========================================

/**
 * Agent type classification
 */
export type AgentType = 'master' | 'specialist' | 'worker';

/**
 * Agent capability categories
 */
export type AgentCapability =
  | 'orchestration'
  | 'planning'
  | 'coordination'
  | 'requirement_analysis'
  | 'scope_definition'
  | 'acceptance_criteria'
  | 'architecture_design'
  | 'tech_selection'
  | 'problem_solving'
  | 'backend_development'
  | 'api_design'
  | 'database'
  | 'frontend_development'
  | 'ui_design'
  | 'interaction'
  | 'implementation'
  | 'scaffolding'
  | 'bulk_tasks'
  | 'testing'
  | 'verification'
  | 'quality_assurance'
  | 'deployment'
  | 'release'
  | 'monitoring';

/**
 * Full agent information for 8-agent registry
 */
export interface AgentInfo {
  id: string;
  role: AgentRole;
  type: AgentType;
  description: string;
  capabilities: AgentCapability[];
  permissions?: string[];
  canDelegateTo?: string[];
}

/**
 * Discussion stage in visible group chat
 */
export type DiscussionStage =
  | 'claim'      // CTO claims task
  | 'clarify'    // PO clarifies requirements
  | 'architect'  // Architect designs
  | 'implement'  // Implementation phase
  | 'verify'     // QA verification
  | 'release'    // DevOps release
  | 'wrap'       // CTO wrap-up
  | 'correction'; // Human correction

/**
 * Discussion message in visible group chat
 */
export interface DiscussionMessage {
  id: string;
  taskId: string;
  projectId: string;
  chatId: string;
  agentId: string;
  stage: DiscussionStage;
  format: 'cto_claim' | 'specialist_input' | 'qa_review' | 'devops_release' | 'cto_wrap' | 'correction';
  content: Record<string, unknown>;
  parentMessageId?: string;
  createdAt: string;
  delivered: boolean;
  feishuMessageId?: string;
}

/**
 * Visible discussion configuration
 */
export interface VisibleDiscussionConfig {
  enabled: boolean;
  canaryChatIds: string[];
  triggerPrefix: string;
  mentionRequired: boolean;
  discussionOrder: string[];
  maxMessagesPerAgent: number;
  threadEnabled: boolean;
  humanCorrectionPrefixes: string[];
}