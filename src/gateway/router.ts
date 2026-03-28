import type { AgentRole } from '../types';
import { createLogger } from '../utils/logger';
import { getRoleDefinition } from '../agents/roles';

const logger = createLogger('router');

export interface RouterConfig {
  defaultRole?: AgentRole;
  roleMapping?: Record<string, AgentRole>;
}

export class TaskRouter {
  private config: RouterConfig;
  private roleMapping: Record<string, AgentRole>;

  constructor(config: RouterConfig = {}) {
    this.config = config;
    this.roleMapping = config.roleMapping || this.getDefaultRoleMapping();
  }

  private getDefaultRoleMapping(): Record<string, AgentRole> {
    return {
      'architecture': 'architect',
      'system-design': 'architect',
      'design': 'architect',
      'requirement': 'po',
      'feature': 'po',
      'user-story': 'po',
      'decision': 'cto',
      'strategy': 'cto',
      'review': 'cto',
      'api': 'backend',
      'server': 'backend',
      'database': 'backend',
      'ui': 'frontend',
      'frontend': 'frontend',
      'interface': 'frontend',
      'test': 'qa',
      'quality': 'qa',
      'validation': 'qa',
      'deploy': 'devops',
      'pipeline': 'devops',
      'infrastructure': 'devops',
    };
  }

  routeTask(taskDescription: string): AgentRole {
    const lowerTask = taskDescription.toLowerCase();

    // Check custom mapping first
    for (const [keyword, role] of Object.entries(this.roleMapping)) {
      if (lowerTask.includes(keyword)) {
        logger.info(`Task routed to ${role} based on keyword: ${keyword}`);
        return role;
      }
    }

    // Default role
    const defaultRole = this.config.defaultRole || 'po';
    logger.info(`Task routed to default role: ${defaultRole}`);
    return defaultRole;
  }

  routeByCapability(requiredCapability: string): AgentRole | null {
    const allRoles = Object.values(getRoleDefinition);

    for (const roleDef of allRoles) {
      if (roleDef.capabilities.includes(requiredCapability)) {
        logger.info(`Capability ${requiredCapability} routed to ${roleDef.role}`);
        return roleDef.role;
      }
    }

    logger.warn(`No agent found for capability: ${requiredCapability}`);
    return null;
  }

  getAgentSequence(taskType: 'feature' | 'bug' | 'refactor' | 'deploy'): AgentRole[] {
    switch (taskType) {
      case 'feature':
        return ['po', 'architect', 'backend', 'frontend', 'qa', 'devops'];
      case 'bug':
        return ['qa', 'backend', 'frontend', 'qa'];
      case 'refactor':
        return ['architect', 'backend', 'frontend', 'qa'];
      case 'deploy':
        return ['devops', 'qa'];
      default:
        return ['po'];
    }
  }

  updateMapping(keyword: string, role: AgentRole): void {
    this.roleMapping[keyword] = role;
    logger.info(`Updated role mapping: ${keyword} -> ${role}`);
  }
}