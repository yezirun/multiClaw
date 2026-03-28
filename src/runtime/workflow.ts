import { createLogger } from '../utils/logger';
import type { Workflow, WorkflowStep, AgentRole } from '../types';

const logger = createLogger('workflow');

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();

  createWorkflow(name: string, description: string, steps: WorkflowStep[]): Workflow {
    const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const workflow: Workflow = {
      id: workflowId,
      name,
      description,
      steps,
      currentStep: 0,
      status: 'idle',
    };

    this.workflows.set(workflowId, workflow);
    logger.info(`Workflow created: ${workflowId}`, { name, stepCount: steps.length });

    return workflow;
  }

  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  startWorkflow(workflowId: string): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    workflow.status = 'running';
    workflow.currentStep = 0;

    logger.info(`Workflow ${workflowId} started`);
  }

  executeStep(workflowId: string, stepIndex: number): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (stepIndex >= workflow.steps.length) {
      workflow.status = 'completed';
      logger.info(`Workflow ${workflowId} completed`);
      return;
    }

    const step = workflow.steps[stepIndex];
    step.status = 'running';
    workflow.currentStep = stepIndex;

    logger.info(`Executing step ${stepIndex} in workflow ${workflowId}`, {
      agent: step.agent,
      action: step.action,
    });
  }

  completeStep(workflowId: string, stepIndex: number, output: Record<string, unknown>): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const step = workflow.steps[stepIndex];
    step.status = 'completed';
    step.output = output;

    logger.info(`Step ${stepIndex} completed in workflow ${workflowId}`);

    // Move to next step
    if (stepIndex + 1 < workflow.steps.length) {
      this.executeStep(workflowId, stepIndex + 1);
    } else {
      workflow.status = 'completed';
      logger.info(`Workflow ${workflowId} completed`);
    }
  }

  failStep(workflowId: string, stepIndex: number, error: string): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const step = workflow.steps[stepIndex];
    step.status = 'failed';

    workflow.status = 'failed';
    logger.error(`Step ${stepIndex} failed in workflow ${workflowId}`, { error });
  }

  getWorkflowStatus(workflowId: string): Workflow['status'] | null {
    const workflow = this.workflows.get(workflowId);
    return workflow ? workflow.status : null;
  }

  createSimpleWorkflow(
    steps: Array<{ agent: AgentRole; action: string }>
  ): Workflow {
    const workflowSteps: WorkflowStep[] = steps.map((step, index) => ({
      id: `step-${index}`,
      agent: step.agent,
      action: step.action,
      input: {},
      status: 'pending',
      dependencies: index > 0 ? [`step-${index - 1}`] : [],
    }));

    return this.createWorkflow(
      'Simple Workflow',
      'A simple linear workflow',
      workflowSteps
    );
  }

  listWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }
}