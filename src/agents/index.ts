import { BaseAgent, createAgentMessage } from './base';
import { ROLE_DEFINITIONS } from './roles';
import type { AgentRole, Message } from '../types';

export class CTOAgent extends BaseAgent {
  constructor() {
    super({
      name: ROLE_DEFINITIONS.cto.name,
      role: 'cto',
      description: ROLE_DEFINITIONS.cto.description,
      capabilities: ROLE_DEFINITIONS.cto.capabilities,
    });
  }

  async process(input: string, context?: Record<string, unknown>): Promise<string> {
    this.logActivity('Processing technical decision request', { input: input.slice(0, 100) });

    // In a real implementation, this would call the OpenClaw API
    const response = `[CTO Analysis] Based on the request "${input.slice(0, 50)}...", I recommend...`;

    return response;
  }

  async reviewArchitecture(proposal: string): Promise<Message> {
    this.logActivity('Reviewing architecture proposal');

    const analysis = await this.process(proposal, { type: 'architecture-review' });

    return createAgentMessage('cto', analysis, { reviewType: 'architecture' });
  }

  async makeTechDecision(options: string[]): Promise<Message> {
    this.logActivity('Making technical decision', { options });

    const decision = await this.process(
      `Choose the best option from: ${options.join(', ')}`,
      { type: 'tech-decision' }
    );

    return createAgentMessage('cto', decision, { decisionType: 'technical' });
  }
}

export class POAgent extends BaseAgent {
  constructor() {
    super({
      name: ROLE_DEFINITIONS.po.name,
      role: 'po',
      description: ROLE_DEFINITIONS.po.description,
      capabilities: ROLE_DEFINITIONS.po.capabilities,
    });
  }

  async process(input: string, context?: Record<string, unknown>): Promise<string> {
    this.logActivity('Processing product request', { input: input.slice(0, 100) });

    const response = `[PO Analysis] For the requirement "${input.slice(0, 50)}...", I suggest...`;

    return response;
  }

  async createUserStory(requirement: string): Promise<Message> {
    this.logActivity('Creating user story');

    const story = await this.process(requirement, { type: 'user-story' });

    return createAgentMessage('po', story, { type: 'user-story' });
  }

  async prioritizeBacklog(items: string[]): Promise<Message> {
    this.logActivity('Prioritizing backlog', { itemCount: items.length });

    const prioritized = await this.process(
      `Prioritize these items: ${items.join(', ')}`,
      { type: 'prioritization' }
    );

    return createAgentMessage('po', prioritized, { type: 'backlog-priority' });
  }
}

export class ArchitectAgent extends BaseAgent {
  constructor() {
    super({
      name: ROLE_DEFINITIONS.architect.name,
      role: 'architect',
      description: ROLE_DEFINITIONS.architect.description,
      capabilities: ROLE_DEFINITIONS.architect.capabilities,
    });
  }

  async process(input: string, context?: Record<string, unknown>): Promise<string> {
    this.logActivity('Processing architecture request', { input: input.slice(0, 100) });

    const response = `[Architecture Design] For "${input.slice(0, 50)}...", the design is...`;

    return response;
  }

  async designSystem(requirements: string): Promise<Message> {
    this.logActivity('Designing system architecture');

    const design = await this.process(requirements, { type: 'system-design' });

    return createAgentMessage('architect', design, { type: 'system-design' });
  }
}

export class BackendAgent extends BaseAgent {
  constructor() {
    super({
      name: ROLE_DEFINITIONS.backend.name,
      role: 'backend',
      description: ROLE_DEFINITIONS.backend.description,
      capabilities: ROLE_DEFINITIONS.backend.capabilities,
    });
  }

  async process(input: string, context?: Record<string, unknown>): Promise<string> {
    this.logActivity('Processing backend task', { input: input.slice(0, 100) });

    const response = `[Backend Implementation] "${input.slice(0, 50)}..." completed.`;

    return response;
  }
}

export class FrontendAgent extends BaseAgent {
  constructor() {
    super({
      name: ROLE_DEFINITIONS.frontend.name,
      role: 'frontend',
      description: ROLE_DEFINITIONS.frontend.description,
      capabilities: ROLE_DEFINITIONS.frontend.capabilities,
    });
  }

  async process(input: string, context?: Record<string, unknown>): Promise<string> {
    this.logActivity('Processing frontend task', { input: input.slice(0, 100) });

    const response = `[Frontend Implementation] "${input.slice(0, 50)}..." completed.`;

    return response;
  }
}

export class QAAgent extends BaseAgent {
  constructor() {
    super({
      name: ROLE_DEFINITIONS.qa.name,
      role: 'qa',
      description: ROLE_DEFINITIONS.qa.description,
      capabilities: ROLE_DEFINITIONS.qa.capabilities,
    });
  }

  async process(input: string, context?: Record<string, unknown>): Promise<string> {
    this.logActivity('Processing QA task', { input: input.slice(0, 100) });

    const response = `[QA Analysis] "${input.slice(0, 50)}..." validated.`;

    return response;
  }
}

export class DevOpsAgent extends BaseAgent {
  constructor() {
    super({
      name: ROLE_DEFINITIONS.devops.name,
      role: 'devops',
      description: ROLE_DEFINITIONS.devops.description,
      capabilities: ROLE_DEFINITIONS.devops.capabilities,
    });
  }

  async process(input: string, context?: Record<string, unknown>): Promise<string> {
    this.logActivity('Processing DevOps task', { input: input.slice(0, 100) });

    const response = `[DevOps Action] "${input.slice(0, 50)}..." executed.`;

    return response;
  }
}

export function createAgent(role: AgentRole): BaseAgent {
  switch (role) {
    case 'cto':
      return new CTOAgent();
    case 'po':
      return new POAgent();
    case 'architect':
      return new ArchitectAgent();
    case 'backend':
      return new BackendAgent();
    case 'frontend':
      return new FrontendAgent();
    case 'qa':
      return new QAAgent();
    case 'devops':
      return new DevOpsAgent();
    default:
      throw new Error(`Unknown agent role: ${role}`);
  }
}