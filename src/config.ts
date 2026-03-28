import dotenv from 'dotenv';
import type { RuntimeConfig, FeishuConfig, OpenClawConfig } from './types';

dotenv.config();

export function loadConfig(): RuntimeConfig {
  const openclaw: OpenClawConfig = {
    apiKey: process.env.OPENCLAW_API_KEY || '',
    baseUrl: process.env.OPENCLAW_BASE_URL || 'https://api.openclaw.ai',
  };

  const feishu: FeishuConfig | undefined = process.env.FEISHU_APP_ID
    ? {
        appId: process.env.FEISHU_APP_ID || '',
        appSecret: process.env.FEISHU_APP_SECRET || '',
        chatId: process.env.FEISHU_CHAT_ID || '',
      }
    : undefined;

  return {
    openclaw,
    feishu,
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}

export function validateConfig(config: RuntimeConfig): void {
  if (!config.openclaw.apiKey) {
    throw new Error('OPENCLAW_API_KEY is required');
  }

  if (config.feishu) {
    if (!config.feishu.appId) {
      throw new Error('FEISHU_APP_ID is required when Feishu integration is enabled');
    }
    if (!config.feishu.appSecret) {
      throw new Error('FEISHU_APP_SECRET is required when Feishu integration is enabled');
    }
    if (!config.feishu.chatId) {
      throw new Error('FEISHU_CHAT_ID is required when Feishu integration is enabled');
    }
  }
}

export function getConfigValue(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue || '';
}