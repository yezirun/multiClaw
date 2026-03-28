import type { AgentRole, WorkflowStep, DiscussionSession } from '../types';

const VALID_ROLES: AgentRole[] = [
  'cto',
  'po',
  'architect',
  'backend',
  'frontend',
  'qa',
  'devops',
  'custom',
];

export function isValidRole(role: string): role is AgentRole {
  return VALID_ROLES.includes(role as AgentRole);
}

export function validateWorkflowStep(step: WorkflowStep): boolean {
  if (!step.id || !step.agent || !step.action) {
    return false;
  }

  if (!isValidRole(step.agent)) {
    return false;
  }

  if (!['pending', 'running', 'completed', 'failed'].includes(step.status)) {
    return false;
  }

  return true;
}

export function validateSession(session: DiscussionSession): boolean {
  if (!session.id || !session.topic) {
    return false;
  }

  if (!Array.isArray(session.participants)) {
    return false;
  }

  if (!Array.isArray(session.messages)) {
    return false;
  }

  return true;
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function validateEnvFile(content: string): boolean {
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Check for KEY=VALUE format
    if (!trimmed.includes('=')) {
      return false;
    }

    const [key] = trimmed.split('=');
    if (!key || !key.match(/^[A-Z_][A-Z0-9_]*$/)) {
      return false;
    }
  }

  return true;
}