import axios from 'axios';
import { createLogger } from '../utils/logger';
import type { FeishuConfig, FeishuAgentBotConfig, DiscussionMessage } from '../types';

const logger = createLogger('feishu-bridge');

interface FeishuMessage {
  msg_type: string;
  content: Record<string, unknown>;
}

interface FeishuResponse {
  code: number;
  msg: string;
  data?: Record<string, unknown>;
}

/**
 * Feishu API client for bot messaging
 */
class FeishuApiClient {
  private tenantTokens: Map<string, { token: string; expiresAt: number }> = new Map();

  async getTenantAccessToken(appId: string, appSecret: string): Promise<string> {
    // Check cache
    const cached = this.tenantTokens.get(appId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    try {
      const response = await axios.post(
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        {
          app_id: appId,
          app_secret: appSecret,
        }
      );

      const data = response.data as FeishuResponse & { tenant_access_token?: string; expire?: number };
      if (data.code !== 0 || !data.tenant_access_token) {
        throw new Error(`Feishu auth failed: ${data.msg}`);
      }

      // Cache token (expires in 2 hours, refresh 1 minute before expiry)
      const expiresAt = Date.now() + (data.expire || 7200) * 1000 - 60000;
      this.tenantTokens.set(appId, {
        token: data.tenant_access_token,
        expiresAt,
      });

      logger.info('Feishu access token obtained', { appId });
      return data.tenant_access_token;
    } catch (error) {
      logger.error('Failed to get Feishu access token', { error });
      throw error;
    }
  }

  async sendMessage(params: {
    appId: string;
    appSecret: string;
    receiveId: string;
    receiveIdType: string;
    msgType: string;
    content: string;
  }): Promise<string | undefined> {
    const token = await this.getTenantAccessToken(params.appId, params.appSecret);

    const response = await axios.post(
      `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=${params.receiveIdType}`,
      {
        receive_id: params.receiveId,
        msg_type: params.msgType,
        content: params.content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data as FeishuResponse & { data?: { message_id?: string } };
    if (data.code !== 0) {
      throw new Error(`Feishu message failed: ${data.msg}`);
    }

    return data.data?.message_id;
  }
}

/**
 * Single bot Feishu bridge (backward compatibility)
 */
export class FeishuBridge {
  private config: FeishuConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: FeishuConfig) {
    this.config = config;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        {
          app_id: this.config.appId,
          app_secret: this.config.appSecret,
        }
      );

      const data = response.data as FeishuResponse & { tenant_access_token?: string };
      if (data.code !== 0) {
        throw new Error(`Feishu auth failed: ${data.msg}`);
      }

      this.accessToken = data.tenant_access_token || null;
      // Token expires in 2 hours, refresh 5 minutes before expiry
      this.tokenExpiresAt = Date.now() + (7200 - 300) * 1000;

      logger.info('Feishu access token obtained');
      return this.accessToken || '';
    } catch (error) {
      logger.error('Failed to get Feishu access token', { error });
      throw error;
    }
  }

  async sendMessage(content: string, msgType: string = 'text'): Promise<boolean> {
    try {
      const token = await this.getAccessToken();

      const message: FeishuMessage = {
        msg_type: msgType,
        content: msgType === 'text' ? { text: content } : { content },
      };

      const response = await axios.post(
        `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id`,
        {
          receive_id: this.config.chatId,
          content: JSON.stringify(message.content),
          msg_type: message.msg_type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as FeishuResponse;
      if (data.code !== 0) {
        throw new Error(`Feishu message failed: ${data.msg}`);
      }

      logger.info('Message sent to Feishu', { chatId: this.config.chatId });
      return true;
    } catch (error) {
      logger.error('Failed to send message to Feishu', { error });
      throw error;
    }
  }

  async sendCard(card: Record<string, unknown>): Promise<boolean> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id`,
        {
          receive_id: this.config.chatId,
          content: JSON.stringify(card),
          msg_type: 'interactive',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as FeishuResponse;
      if (data.code !== 0) {
        throw new Error(`Feishu card failed: ${data.msg}`);
      }

      logger.info('Card sent to Feishu');
      return true;
    } catch (error) {
      logger.error('Failed to send card to Feishu', { error });
      throw error;
    }
  }

  async sendDiscussionSummary(
    topic: string,
    messages: Array<{ role: string; content: string }>,
    summary: string
  ): Promise<boolean> {
    const cardContent = {
      config: {
        wide_screen_mode: true,
      },
      elements: [
        {
          tag: 'div',
          text: {
            content: `**Discussion Topic:** ${topic}`,
            tag: 'lark_md',
          },
        },
        {
          tag: 'div',
          text: {
            content: '**Messages:**',
            tag: 'lark_md',
          },
        },
        ...messages.slice(0, 5).map((msg) => ({
          tag: 'div',
          text: {
            content: `**${msg.role}:** ${msg.content.slice(0, 100)}...`,
            tag: 'lark_md',
          },
        })),
        {
          tag: 'divider',
        },
        {
          tag: 'div',
          text: {
            content: `**Summary:**\n${summary}`,
            tag: 'lark_md',
          },
        },
      ],
    };

    return this.sendCard(cardContent);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.getAccessToken();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Multi-bot Feishu message sender for 8-agent group chat
 * Each agent speaks with its own bot identity
 */
export class FeishuMessageSender {
  private accountConfigs: Map<string, FeishuAgentBotConfig>;
  private chatId: string;
  private feishuApi: FeishuApiClient;

  constructor(chatId: string, accountConfigs?: Map<string, FeishuAgentBotConfig>) {
    this.chatId = chatId;
    // Use provided configs or empty map
    this.accountConfigs = accountConfigs || new Map();
    this.feishuApi = new FeishuApiClient();

    if (this.accountConfigs.size === 0) {
      logger.warn('No Feishu credentials configured - messages will be logged only');
    } else {
      logger.info(`Initialized with ${this.accountConfigs.size} bot accounts`);
    }
  }

  /**
   * Set bot config for a specific agent
   */
  setAgentBotConfig(agentId: string, config: FeishuAgentBotConfig): void {
    this.accountConfigs.set(agentId, config);
    logger.info(`Bot config set for agent: ${agentId}`);
  }

  /**
   * Send message as a specific agent
   */
  async sendAsAgent(agentId: string, content: string, msgType: string = 'text'): Promise<string | undefined> {
    const accountConfig = this.accountConfigs.get(agentId);
    if (!accountConfig) {
      // Log message instead of throwing - allows graceful degradation
      logger.warn(`No Feishu credentials for ${agentId} - logging message only`);
      logger.info(`Message content: ${content.slice(0, 200)}...`);
      return undefined;
    }

    logger.info(`Sending to chat ${this.chatId} as ${agentId}`);
    logger.debug(`Message: ${content.slice(0, 100)}...`);

    return this.feishuApi.sendMessage({
      appId: accountConfig.appId,
      appSecret: accountConfig.appSecret,
      receiveId: this.chatId,
      receiveIdType: 'chat_id',
      msgType,
      content: msgType === 'text' ? JSON.stringify({ text: content }) : content,
    });
  }

  /**
   * Send discussion message with formatted content
   */
  async sendDiscussionMessage(message: DiscussionMessage): Promise<string | undefined> {
    const accountConfig = this.accountConfigs.get(message.agentId);
    if (!accountConfig) {
      logger.warn(`No Feishu credentials for ${message.agentId} - logging message only`);
      logger.info(`Discussion message: ${JSON.stringify(message.content).slice(0, 200)}...`);
      return undefined;
    }

    const text = this.formatDiscussionText(message);

    return this.feishuApi.sendMessage({
      appId: accountConfig.appId,
      appSecret: accountConfig.appSecret,
      receiveId: message.chatId,
      receiveIdType: 'chat_id',
      msgType: 'text',
      content: JSON.stringify({ text }),
    });
  }

  /**
   * Format discussion message for Feishu
   */
  private formatDiscussionText(message: DiscussionMessage): string {
    const content = message.content;
    const lines: string[] = [];

    // Agent + Stage header
    const agent = (content.agent as string) || 'Agent';
    const stage = (content.stage as string) || '';
    lines.push(`【${agent}·${stage}】`);

    // task_id (compact)
    if (content.task_id) {
      const taskId = content.task_id as string;
      lines.push(`task: ${taskId.slice(0, 12)}`);
    }

    // work_summary - THE HERO
    if (content.work_summary) {
      const summary = content.work_summary as string;
      // Enforce 100 char limit
      lines.push(`摘要: ${summary.length > 100 ? summary.slice(0, 97) + '...' : summary}`);
    }

    // next_step (only if meaningful)
    if (content.next_step) {
      const next = content.next_step as string;
      if (!next.includes('等待') && !next.includes('待') && next.length > 5) {
        lines.push(`下一步: ${next}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Check if agent has bot config
   */
  hasAgentBotConfig(agentId: string): boolean {
    return this.accountConfigs.has(agentId);
  }

  /**
   * Get number of configured bots
   */
  getBotCount(): number {
    return this.accountConfigs.size;
  }

  /**
   * Health check for all configured bots
   */
  async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    for (const [agentId, config] of this.accountConfigs.entries()) {
      try {
        await this.feishuApi.getTenantAccessToken(config.appId, config.appSecret);
        results[agentId] = true;
      } catch {
        results[agentId] = false;
      }
    }
    return results;
  }
}