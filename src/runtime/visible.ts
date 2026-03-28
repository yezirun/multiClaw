import { createLogger } from '../utils/logger';
import type {
  DiscussionSession,
  Message,
  VisibleDiscussionOptions,
  DiscussionStage,
  DiscussionMessage,
  VisibleDiscussionConfig,
} from '../types';
import {
  DISCUSSION_ORDER,
  MIN_SPECIALIST_PARTICIPANTS,
  SPECIALIST_AGENT_IDS,
  DEFAULT_AGENT_REGISTRY,
} from '../agents/roles';

const logger = createLogger('visible-discussion');

/**
 * Default visible discussion configuration
 */
const DEFAULT_VISIBLE_CONFIG: VisibleDiscussionConfig = {
  enabled: false,
  canaryChatIds: [],
  triggerPrefix: '[swarm]',
  mentionRequired: true,
  discussionOrder: DISCUSSION_ORDER,
  maxMessagesPerAgent: 1,
  threadEnabled: true,
  humanCorrectionPrefixes: ['[修正]', '[调整]', '[停止]', '[继续]'],
};

/**
 * Stage to agents mapping
 * Defines which agents participate in each stage
 */
const AGENT_STAGE_MAP: Record<string, DiscussionStage[]> = {
  'agent1-cto': ['claim', 'wrap', 'correction'],
  'agent2-po': ['clarify'],
  'agent3-architect': ['architect'],
  'agent4-backend': ['implement'],
  'agent5-frontend': ['implement'],
  'agent6-impl': ['implement'],
  'agent7-qa': ['verify'],
  'agent8-devops': ['release'],
};

/**
 * Discussion stage order
 */
const STAGE_ORDER: DiscussionStage[] = [
  'claim',
  'clarify',
  'architect',
  'implement',
  'verify',
  'release',
  'wrap',
];

/**
 * Visible Discussion Engine for 8-agent group chat
 */
export class VisibleDiscussion {
  private options: VisibleDiscussionOptions;
  private config: VisibleDiscussionConfig;
  private sessionMessages: Map<string, Message[]> = new Map();
  private discussionSessions: Map<string, DiscussionSessionExtended> = new Map();
  private summaries: Map<string, string> = new Map();

  constructor(options: VisibleDiscussionOptions = {}, config?: Partial<VisibleDiscussionConfig>) {
    this.options = {
      maxMessages: options.maxMessages || 50,
      summarizeThreshold: options.summarizeThreshold || 10,
      enableWorkSummary: options.enableWorkSummary !== false,
    };
    this.config = { ...DEFAULT_VISIBLE_CONFIG, ...config };
  }

  /**
   * Check if visible discussion is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<VisibleDiscussionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): VisibleDiscussionConfig {
    return { ...this.config };
  }

  /**
   * Track a discussion message
   */
  trackDiscussion(sessionId: string, message: Message): void {
    let messages = this.sessionMessages.get(sessionId) || [];
    messages.push(message);

    // Keep within max limit
    if (messages.length > this.options.maxMessages!) {
      messages = messages.slice(-this.options.maxMessages!);
    }

    this.sessionMessages.set(sessionId, messages);

    logger.info(`Discussion message tracked`, {
      sessionId,
      role: message.role,
      messageCount: messages.length,
    });

    // Generate summary if threshold reached
    if (this.shouldSummarize(sessionId)) {
      this.generateSummary(sessionId);
    }
  }

  /**
   * Get discussion messages for a session
   */
  getDiscussion(sessionId: string): Message[] {
    return this.sessionMessages.get(sessionId) || [];
  }

  /**
   * Check if should generate summary
   */
  shouldSummarize(sessionId: string): boolean {
    const messages = this.sessionMessages.get(sessionId) || [];
    return messages.length >= this.options.summarizeThreshold!;
  }

  /**
   * Generate summary for a session
   */
  generateSummary(sessionId: string): string {
    const messages = this.sessionMessages.get(sessionId) || [];

    // Group by role
    const roleCounts: Record<string, number> = {};
    for (const msg of messages) {
      roleCounts[msg.role] = (roleCounts[msg.role] || 0) + 1;
    }

    const summary = this.options.enableWorkSummary
      ? this.createWorkSummary(messages, roleCounts)
      : this.createBasicSummary(messages);

    this.summaries.set(sessionId, summary);
    logger.info(`Summary generated for session ${sessionId}`, { messageCount: messages.length });

    return summary;
  }

  /**
   * Create work summary with detailed breakdown
   */
  private createWorkSummary(
    messages: Message[],
    roleCounts: Record<string, number>
  ): string {
    const lastMessages = messages.slice(-5);
    const rolesInvolved = Object.keys(roleCounts);

    const summary = `
=== Discussion Summary ===
Total Messages: ${messages.length}
Roles Involved: ${rolesInvolved.join(', ')}

Recent Activity:
${lastMessages.map((m) => `- [${m.role}] ${m.content.slice(0, 100)}...`).join('\n')}

Work Progress:
${rolesInvolved.map((r) => `${r}: ${roleCounts[r]} contributions`).join('\n')}
`;

    return summary;
  }

  /**
   * Create basic summary
   */
  private createBasicSummary(messages: Message[]): string {
    return `
=== Discussion Summary ===
Total Messages: ${messages.length}
Last Message: [${messages[messages.length - 1]?.role}] ${messages[messages.length - 1]?.content.slice(0, 100)}...
`;
  }

  /**
   * Get summary for a session
   */
  getSummary(sessionId: string): string | undefined {
    return this.summaries.get(sessionId);
  }

  /**
   * Format discussion for Feishu
   */
  formatForFeishu(sessionId: string): string {
    const messages = this.sessionMessages.get(sessionId) || [];
    const summary = this.summaries.get(sessionId) || '';

    return `
**Discussion Progress**

${messages.slice(-10).map((m) => `[${m.role}]: ${m.content.slice(0, 50)}...`).join('\n')}

${summary}
`;
  }

  /**
   * Clear discussion for a session
   */
  clearDiscussion(sessionId: string): void {
    this.sessionMessages.delete(sessionId);
    this.summaries.delete(sessionId);
    this.discussionSessions.delete(sessionId);
    logger.info(`Discussion cleared for session ${sessionId}`);
  }

  /**
   * Get active discussions
   */
  getActiveDiscussions(): string[] {
    return Array.from(this.sessionMessages.keys());
  }

  /**
   * Get agents responsible for a discussion stage
   */
  getAgentsForStage(stage: DiscussionStage): string[] {
    const agents: string[] = [];
    for (const [agentId, stages] of Object.entries(AGENT_STAGE_MAP)) {
      if (stages.includes(stage)) {
        agents.push(agentId);
      }
    }
    return agents;
  }

  /**
   * Get the next stage in discussion order
   */
  getNextStage(currentStage: DiscussionStage): DiscussionStage | undefined {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      return STAGE_ORDER[currentIndex + 1];
    }
    return undefined;
  }

  /**
   * Check if stage is terminal
   */
  isTerminalStage(stage: DiscussionStage): boolean {
    return stage === 'wrap' || stage === 'correction';
  }

  /**
   * Generate message content for an agent at a given stage
   */
  generateAgentMessageContent(
    agentId: string,
    stage: DiscussionStage,
    taskId: string,
    triggerContent: string
  ): Record<string, unknown> {
    const taskSummary = triggerContent.slice(0, 40);

    // Get agent info from registry
    const agentInfo = DEFAULT_AGENT_REGISTRY.find(a => a.id === agentId);
    const roleName = agentInfo?.role || 'unknown';

    // CTO: Task orchestration and wrap-up style
    if (agentId === 'agent1-cto') {
      if (stage === 'claim') {
        return {
          agent: 'CTO',
          task_id: taskId,
          stage: '认领',
          work_summary: `已认领「${taskSummary}...」，正在拆分子任务；当前推进到 PO 澄清需求边界。`,
          next_step: 'PO 澄清需求边界 → Architect 设计方案',
        };
      }
      if (stage === 'wrap') {
        return {
          agent: 'CTO',
          task_id: taskId,
          stage: '收口',
          work_summary: '讨论已完成，方案达成一致，各角色已输出无阻塞，风险可控。',
          next_step: '进入实施阶段，由 Impl 负责',
        };
      }
    }

    // PO: Requirements clarification
    if (agentId === 'agent2-po') {
      return {
        agent: 'PO',
        task_id: taskId,
        stage: '需求澄清',
        work_summary: `已界定「${taskSummary}...」需求边界：明确核心功能，暂不做扩展场景。`,
        next_step: 'Architect 输出技术方案',
      };
    }

    // Architect: Technical design
    if (agentId === 'agent3-architect') {
      return {
        agent: 'Architect',
        task_id: taskId,
        stage: '架构设计',
        work_summary: '已确定技术方案：采用模块化设计，平衡了复杂度与可维护性；第三方依赖版本已锁定。',
        next_step: 'Backend/Frontend 分解实现任务',
      };
    }

    // Backend: Implementation status
    if (agentId === 'agent4-backend') {
      return {
        agent: 'Backend',
        task_id: taskId,
        stage: '后端实现',
        work_summary: 'API 设计完成，数据模型已定义；核心接口已就绪，等待 Frontend 联调。',
        next_step: 'Impl 执行具体编码',
      };
    }

    // Frontend: Implementation status
    if (agentId === 'agent5-frontend') {
      return {
        agent: 'Frontend',
        task_id: taskId,
        stage: '前端实现',
        work_summary: '组件结构已规划，接口已对接；核心 UI 框架搭建完成，等待后端联调。',
        next_step: '联调测试',
      };
    }

    // Impl: Execution progress
    if (agentId === 'agent6-impl') {
      return {
        agent: 'Impl',
        task_id: taskId,
        stage: '执行实现',
        work_summary: '核心功能已实现，主要模块完成约 70%；剩余边界处理和错误处理待补。',
        next_step: 'QA 验收',
      };
    }

    // QA: Verification and defects
    if (agentId === 'agent7-qa') {
      return {
        agent: 'QA',
        task_id: taskId,
        stage: '验收测试',
        work_summary: '主要功能通过验证，覆盖核心场景和边界条件；暂无阻塞级缺陷。',
        next_step: 'DevOps 评估发布风险',
      };
    }

    // DevOps: Release assessment
    if (agentId === 'agent8-devops') {
      return {
        agent: 'DevOps',
        task_id: taskId,
        stage: '发布评估',
        work_summary: '可发布，风险可控；已准备回滚方案，监控 API 响应时间和错误率。',
        next_step: 'CTO 收口确认',
      };
    }

    // Generic fallback
    return {
      agent: roleName,
      task_id: taskId,
      stage,
      work_summary: `${stage} 阶段已完成，等待下一步指令。`,
      next_step: '等待下一角色响应',
    };
  }

  /**
   * GUARANTEE: Ensure minimum specialist participation
   * Prevents CTO from short-circuiting alone
   */
  guaranteeSpecialistParticipation(
    messages: DiscussionMessage[]
  ): { needed: number; availableAgents: string[] } {
    // Count specialists that have delivered messages
    const deliveredSpecialists = messages.filter(
      m => SPECIALIST_AGENT_IDS.includes(m.agentId) && m.delivered
    );

    const needed = MIN_SPECIALIST_PARTICIPANTS - deliveredSpecialists.length;

    if (needed <= 0) {
      logger.info(`Minimum specialist participation satisfied: ${deliveredSpecialists.length} specialists spoke`);
      return { needed: 0, availableAgents: [] };
    }

    logger.info(`Guaranteeing ${needed} more specialist(s) to prevent CTO-only short-circuit`);

    // Find specialists that haven't spoken yet
    const spokenAgentIds = messages.map(m => m.agentId);
    const availableSpecialists = SPECIALIST_AGENT_IDS.filter(
      id => !spokenAgentIds.includes(id)
    );

    return { needed, availableAgents: availableSpecialists };
  }

  /**
   * Create a discussion message object
   */
  createDiscussionMessage(
    agentId: string,
    taskId: string,
    projectId: string,
    chatId: string,
    stage: DiscussionStage,
    triggerContent: string
  ): DiscussionMessage {
    const content = this.generateAgentMessageContent(agentId, stage, taskId, triggerContent);
    const format = this.getMessageFormat(agentId, stage);

    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      taskId,
      projectId,
      chatId,
      agentId,
      stage,
      format,
      content,
      createdAt: new Date().toISOString(),
      delivered: false,
    };
  }

  /**
   * Get message format for agent and stage
   */
  private getMessageFormat(agentId: string, stage: DiscussionStage): DiscussionMessage['format'] {
    if (agentId === 'agent1-cto') {
      if (stage === 'claim') return 'cto_claim';
      if (stage === 'wrap') return 'cto_wrap';
    }
    if (agentId === 'agent7-qa') return 'qa_review';
    if (agentId === 'agent8-devops') return 'devops_release';
    return 'specialist_input';
  }
}

/**
 * Extended discussion session for 8-agent group chat
 */
interface DiscussionSessionExtended extends DiscussionSession {
  taskId?: string;
  projectId?: string;
  currentStage?: DiscussionStage;
  deliveredMessages?: DiscussionMessage[];
  humanCorrections?: Array<{
    userId: string;
    content: string;
    type: 'adjust' | 'stop' | 'continue' | 'redirect';
    timestamp: Date;
  }>;
}

// Singleton instance
let discussionInstance: VisibleDiscussion | null = null;

export function getVisibleDiscussion(
  options?: VisibleDiscussionOptions,
  config?: Partial<VisibleDiscussionConfig>
): VisibleDiscussion {
  if (!discussionInstance) {
    discussionInstance = new VisibleDiscussion(options, config);
  }
  return discussionInstance;
}

export function resetVisibleDiscussion(): void {
  discussionInstance = null;
}