import { loadConfig, validateConfig } from './config';
import { OpenClawGateway } from './gateway/openclaw';
import { TaskRouter } from './gateway/router';
import { FeishuBridge } from './bridge/feishu';
import { MessageHandler } from './bridge/message';
import { SessionManager } from './runtime/session';
import { WorkflowEngine } from './runtime/workflow';
import { VisibleDiscussion } from './runtime/visible';
import { createAgent } from './agents';
import { createLogger } from './utils/logger';
import type { RuntimeConfig, HealthCheckResult } from './types';

const logger = createLogger('main');

export class MultiClawRuntime {
  private config: RuntimeConfig;
  private gateway: OpenClawGateway;
  private router: TaskRouter;
  private feishu?: FeishuBridge;
  private messageHandler: MessageHandler;
  private sessionManager: SessionManager;
  private workflowEngine: WorkflowEngine;
  private visibleDiscussion: VisibleDiscussion;

  constructor(configOverride?: Partial<RuntimeConfig>) {
    this.config = configOverride ? { ...loadConfig(), ...configOverride } : loadConfig();
    validateConfig(this.config);

    this.gateway = new OpenClawGateway(this.config.openclaw);
    this.router = new TaskRouter();
    this.messageHandler = new MessageHandler();
    this.sessionManager = new SessionManager();
    this.workflowEngine = new WorkflowEngine();
    this.visibleDiscussion = new VisibleDiscussion();

    if (this.config.feishu) {
      this.feishu = new FeishuBridge(this.config.feishu);
    }

    logger.info('MultiClaw Runtime initialized');
  }

  async processTask(taskDescription: string): Promise<string> {
    logger.info('Processing task', { task: taskDescription.slice(0, 100) });

    const role = this.router.routeTask(taskDescription);
    const agent = createAgent(role);

    const session = this.sessionManager.createSession(taskDescription, [role]);

    try {
      const response = await agent.process(taskDescription);

      const message = {
        id: `msg-${Date.now()}`,
        role,
        content: response,
        timestamp: new Date(),
      };

      this.sessionManager.addMessage(session.id, message);
      this.visibleDiscussion.trackDiscussion(session.id, message);

      if (this.feishu && this.visibleDiscussion.shouldSummarize(session.id)) {
        const summary = this.visibleDiscussion.generateSummary(session.id);
        await this.feishu.sendDiscussionSummary(
          taskDescription,
          this.visibleDiscussion.getDiscussion(session.id),
          summary
        );
      }

      this.sessionManager.closeSession(session.id);
      return response;
    } catch (error) {
      logger.error('Task processing failed', { error });
      this.sessionManager.updateStatus(session.id, 'completed');
      throw error;
    }
  }

  async runWorkflow(
    name: string,
    steps: Array<{ agent: string; action: string }>
  ): Promise<void> {
    const workflow = this.workflowEngine.createSimpleWorkflow(
      steps.map((s) => ({ agent: s.agent as any, action: s.action }))
    );

    this.workflowEngine.startWorkflow(workflow.id);

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const agent = createAgent(step.agent);

      try {
        this.workflowEngine.executeStep(workflow.id, i);
        const result = await agent.process(step.action);
        this.workflowEngine.completeStep(workflow.id, i, { result });
      } catch (error) {
        this.workflowEngine.failStep(workflow.id, i, String(error));
        throw error;
      }
    }
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const openclawHealthy = await this.gateway.healthCheck();
    const feishuHealthy = this.feishu ? await this.feishu.healthCheck() : undefined;

    const status: HealthCheckResult['status'] =
      openclawHealthy && (feishuHealthy === undefined || feishuHealthy)
        ? 'healthy'
        : openclawHealthy
        ? 'degraded'
        : 'unhealthy';

    return {
      status,
      components: {
        openclaw: openclawHealthy,
        feishu: feishuHealthy,
        runtime: true,
      },
      timestamp: new Date(),
    };
  }

  getConfig(): RuntimeConfig {
    return this.config;
  }

  getSessionManager(): SessionManager {
    return this.sessionManager;
  }

  getWorkflowEngine(): WorkflowEngine {
    return this.workflowEngine;
  }

  getVisibleDiscussion(): VisibleDiscussion {
    return this.visibleDiscussion;
  }
}

export async function main(): Promise<void> {
  const runtime = new MultiClawRuntime();

  const health = await runtime.healthCheck();
  logger.info('Health check result', { health });

  if (health.status === 'unhealthy') {
    logger.error('Runtime is unhealthy, exiting');
    process.exit(1);
  }

  logger.info('MultiClaw Runtime is ready');
}

export default MultiClawRuntime;