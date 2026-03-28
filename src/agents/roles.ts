import type { AgentRole } from '../types';

export interface RoleDefinition {
  role: AgentRole;
  name: string;
  description: string;
  capabilities: string[];
  promptTemplate: string;
}

/**
 * 8-Agent Role Definitions
 * Each role has distinct responsibilities in the group chat workflow
 */
export const ROLE_DEFINITIONS: Record<AgentRole, RoleDefinition> = {
  cto: {
    role: 'cto',
    name: 'CTO Agent',
    description: 'Technical leadership and strategic decision-making (Master Agent)',
    capabilities: ['orchestration', 'planning', 'coordination', 'escalation'],
    promptTemplate: `You are the CTO Agent responsible for technical leadership.
Your role is to:
- Make high-level technical decisions
- Review architectural proposals
- Coordinate between different technical teams
- Ensure technical alignment with business goals
- Orchestrate task assignment and wrap-up`,
  },

  po: {
    role: 'po',
    name: 'Product Owner Agent',
    description: 'Product strategy and requirement management',
    capabilities: ['requirements', 'prioritization', 'user-stories', 'backlog'],
    promptTemplate: `You are the Product Owner Agent responsible for product direction.
Your role is to:
- Define and prioritize product requirements
- Create and maintain user stories
- Manage the product backlog
- Ensure deliverables meet business needs
- Clarify requirement boundaries and acceptance criteria`,
  },

  architect: {
    role: 'architect',
    name: 'Architect Agent',
    description: 'System architecture and design patterns',
    capabilities: ['system-design', 'patterns', 'scalability', 'documentation'],
    promptTemplate: `You are the Architect Agent responsible for system design.
Your role is to:
- Design system architecture
- Define technical standards and patterns
- Ensure scalability and maintainability
- Create technical documentation
- Solve complex technical problems`,
  },

  backend: {
    role: 'backend',
    name: 'Backend Agent',
    description: 'Server-side development and APIs',
    capabilities: ['api-development', 'database', 'integration', 'testing'],
    promptTemplate: `You are the Backend Agent responsible for server-side development.
Your role is to:
- Develop APIs and services
- Design and implement data models
- Handle integrations with external systems
- Write tests for backend code`,
  },

  frontend: {
    role: 'frontend',
    name: 'Frontend Agent',
    description: 'User interface and client-side development',
    capabilities: ['ui-development', 'ux', 'components', 'testing'],
    promptTemplate: `You are the Frontend Agent responsible for user interface development.
Your role is to:
- Build user interfaces
- Implement responsive designs
- Create reusable components
- Ensure accessibility and performance`,
  },

  impl: {
    role: 'impl',
    name: 'Implementation Agent',
    description: 'Implementation execution and bulk task handling',
    capabilities: ['implementation', 'scaffolding', 'bulk-tasks', 'execution'],
    promptTemplate: `You are the Implementation Agent responsible for hands-on execution.
Your role is to:
- Execute implementation tasks
- Handle scaffolding and setup
- Process bulk operations efficiently
- Bridge design to actual code`,
  },

  qa: {
    role: 'qa',
    name: 'QA Agent',
    description: 'Quality assurance and testing',
    capabilities: ['test-planning', 'automation', 'bugs', 'validation'],
    promptTemplate: `You are the QA Agent responsible for quality assurance.
Your role is to:
- Plan and execute test strategies
- Automate testing workflows
- Identify and track bugs
- Validate deliverables meet requirements`,
  },

  devops: {
    role: 'devops',
    name: 'DevOps Agent',
    description: 'Infrastructure and deployment automation',
    capabilities: ['ci-cd', 'infrastructure', 'monitoring', 'security'],
    promptTemplate: `You are the DevOps Agent responsible for infrastructure and deployment.
Your role is to:
- Set up CI/CD pipelines
- Manage infrastructure
- Implement monitoring and alerting
- Ensure security best practices`,
  },

  custom: {
    role: 'custom',
    name: 'Custom Agent',
    description: 'Custom agent for specialized tasks',
    capabilities: ['custom'],
    promptTemplate: `You are a Custom Agent for specialized tasks.`,
  },
};

/**
 * Default 8-Agent Registry Configuration
 * Maps agent IDs to their role definitions
 */
export const DEFAULT_AGENT_REGISTRY = [
  {
    id: 'agent1-cto',
    role: 'cto',
    type: 'master' as const,
    description: 'Master agent responsible for orchestration, task assignment, and wrap-up',
    capabilities: ['orchestration', 'planning', 'coordination', 'escalation'],
    canDelegateTo: [
      'agent2-po',
      'agent3-architect',
      'agent4-backend',
      'agent5-frontend',
      'agent6-impl',
      'agent7-qa',
      'agent8-devops',
    ],
  },
  {
    id: 'agent2-po',
    role: 'po',
    type: 'specialist' as const,
    description: 'Requirements analysis, scope definition, acceptance criteria',
    capabilities: ['requirement_analysis', 'scope_definition', 'acceptance_criteria'],
  },
  {
    id: 'agent3-architect',
    role: 'architect',
    type: 'specialist' as const,
    description: 'Architecture design, tech selection, problem solving',
    capabilities: ['architecture_design', 'tech_selection', 'problem_solving'],
  },
  {
    id: 'agent4-backend',
    role: 'backend',
    type: 'worker' as const,
    description: 'Backend development, API design, database',
    capabilities: ['backend_development', 'api_design', 'database'],
  },
  {
    id: 'agent5-frontend',
    role: 'frontend',
    type: 'worker' as const,
    description: 'Frontend development, UI design, interaction',
    capabilities: ['frontend_development', 'ui_design', 'interaction'],
  },
  {
    id: 'agent6-impl',
    role: 'impl',
    type: 'worker' as const,
    description: 'Implementation execution, scaffolding, bulk tasks',
    capabilities: ['implementation', 'scaffolding', 'bulk_tasks'],
  },
  {
    id: 'agent7-qa',
    role: 'qa',
    type: 'specialist' as const,
    description: 'Testing, verification, quality assurance',
    capabilities: ['testing', 'verification', 'quality_assurance'],
  },
  {
    id: 'agent8-devops',
    role: 'devops',
    type: 'specialist' as const,
    description: 'Deployment, release, monitoring',
    capabilities: ['deployment', 'release', 'monitoring'],
  },
];

/**
 * Discussion order for visible group chat
 * Defines the sequence of agent participation
 */
export const DISCUSSION_ORDER = [
  'agent1-cto',     // CTO claims
  'agent2-po',      // PO clarifies
  'agent3-architect', // Architect designs
  'agent4-backend',  // Backend plans
  'agent5-frontend', // Frontend plans
  'agent6-impl',     // Implementation
  'agent7-qa',       // QA reviews
  'agent8-devops',   // DevOps releases
  'agent1-cto',      // CTO wraps
];

/**
 * Minimum specialists that must participate in discussion
 * Prevents CTO from short-circuiting alone
 */
export const MIN_SPECIALIST_PARTICIPANTS = 2;

/**
 * Specialist agent IDs (non-CTO)
 */
export const SPECIALIST_AGENT_IDS = [
  'agent2-po',
  'agent3-architect',
  'agent4-backend',
  'agent5-frontend',
  'agent6-impl',
  'agent7-qa',
  'agent8-devops',
];

export function getRoleDefinition(role: AgentRole): RoleDefinition {
  return ROLE_DEFINITIONS[role];
}

export function getAvailableRoles(): AgentRole[] {
  return Object.keys(ROLE_DEFINITIONS) as AgentRole[];
}

export function getAgentRegistry(): typeof DEFAULT_AGENT_REGISTRY {
  return DEFAULT_AGENT_REGISTRY;
}