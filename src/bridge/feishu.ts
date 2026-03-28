import axios from 'axios';
import { createLogger } from '../utils/logger';
import type { FeishuConfig } from '../types';

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

      const data = response.data as FeishuResponse;
      if (data.code !== 0) {
        throw new Error(`Feishu auth failed: ${data.msg}`);
      }

      this.accessToken = (data.data as { tenant_access_token: string }).tenant_access_token;
      // Token expires in 2 hours, refresh 5 minutes before expiry
      this.tokenExpiresAt = Date.now() + (7200 - 300) * 1000;

      logger.info('Feishu access token obtained');
      return this.accessToken;
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