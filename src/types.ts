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

export interface OpenClawConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface RuntimeConfig {
  openclaw: OpenClawConfig;
  feishu?: FeishuConfig;
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