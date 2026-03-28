import type { AgentConfig, AgentRole, Message } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('base-agent');

export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  get name(): string {
    return this.config.name;
  }

  get role(): AgentRole {
    return this.config.role;
  }

  get description(): string {
    return this.config.description;
  }

  get capabilities(): string[] {
    return this.config.capabilities;
  }

  abstract process(input: string, context?: Record<string, unknown>): Promise<string>;

  protected logActivity(action: string, details?: Record<string, unknown>): void {
    logger.info(`[${this.config.role}] ${action}`, {
      agent: this.config.name,
      ...details,
    });
  }

  canHandle(taskType: string): boolean {
    return this.config.capabilities.includes(taskType);
  }

  toJSON(): AgentConfig {
    return this.config;
  }
}

export function createAgentMessage(
  role: AgentRole,
  content: string,
  metadata?: Record<string, unknown>
): Message {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    timestamp: new Date(),
    metadata,
  };
}