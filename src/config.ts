import dotenv from 'dotenv';
import type { RuntimeConfig, FeishuConfig, OpenClawConfig, MultiBotFeishuConfig, FeishuAgentBotConfig } from './types';

dotenv.config();

/**
 * Load 8-bot Feishu configuration from environment
 * Each agent has its own bot identity
 */
function loadMultiBotFeishuConfig(): MultiBotFeishuConfig | undefined {
  const chatId = process.env.FEISHU_CHAT_ID;
  if (!chatId) {
    return undefined;
  }

  // Check if single bot mode is enabled
  const singleBotMode = process.env.FEISHU_SINGLE_BOT_MODE === 'true';

  if (singleBotMode) {
    // Use single bot for all agents (backward compatibility)
    const appId = process.env.FEISHU_APP_ID;
    const appSecret = process.env.FEISHU_APP_SECRET;
    if (!appId || !appSecret) {
      return undefined;
    }
    const agents: Record<string, FeishuAgentBotConfig> = {};
    for (let i = 1; i <= 8; i++) {
      agents[`agent${i}-${getAgentSuffix(i)}`] = { appId, appSecret };
    }
    return { chatId, agents, singleBotMode };
  }

  // Load individual bot credentials for each agent
  const agents: Record<string, FeishuAgentBotConfig> = {};
  const agentSuffixes = ['cto', 'po', 'architect', 'backend', 'frontend', 'impl', 'qa', 'devops'];

  for (let i = 1; i <= 8; i++) {
    const suffix = agentSuffixes[i - 1];
    const appId = process.env[`FEISHU_AGENT${i}_APP_ID`];
    const appSecret = process.env[`FEISHU_AGENT${i}_APP_SECRET`];
    if (appId && appSecret) {
      agents[`agent${i}-${suffix}`] = { appId, appSecret };
    }
  }

  // Return undefined if no agent credentials found
  if (Object.keys(agents).length === 0) {
    return undefined;
  }

  return { chatId, agents, singleBotMode };
}

function getAgentSuffix(index: number): string {
  const suffixes = ['cto', 'po', 'architect', 'backend', 'frontend', 'impl', 'qa', 'devops'];
  return suffixes[index - 1] || 'unknown';
}

export function loadConfig(): RuntimeConfig {
  const openclaw: OpenClawConfig = {
    apiKey: process.env.OPENCLAW_API_KEY || '',
    baseUrl: process.env.OPENCLAW_BASE_URL || 'https://api.openclaw.ai',
  };

  // Load single-bot config for backward compatibility
  const feishu: FeishuConfig | undefined = process.env.FEISHU_APP_ID
    ? {
        appId: process.env.FEISHU_APP_ID || '',
        appSecret: process.env.FEISHU_APP_SECRET || '',
        chatId: process.env.FEISHU_CHAT_ID || '',
      }
    : undefined;

  // Load multi-bot config for 8-agent group chat
  const multiBotFeishu = loadMultiBotFeishuConfig();

  return {
    openclaw,
    feishu,
    multiBotFeishu,
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}

export function validateConfig(config: RuntimeConfig): void {
  if (!config.openclaw.apiKey) {
    throw new Error('OPENCLAW_API_KEY is required');
  }

  // Validate single-bot config if present
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

  // Validate multi-bot config if present
  if (config.multiBotFeishu) {
    if (!config.multiBotFeishu.chatId) {
      throw new Error('FEISHU_CHAT_ID is required for multi-bot mode');
    }
    if (Object.keys(config.multiBotFeishu.agents).length === 0) {
      throw new Error('At least one agent bot configuration is required for multi-bot mode');
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

/**
 * Get Feishu bot config for a specific agent
 */
export function getAgentBotConfig(config: RuntimeConfig, agentId: string): FeishuAgentBotConfig | undefined {
  // Prefer multi-bot config
  if (config.multiBotFeishu?.agents[agentId]) {
    return config.multiBotFeishu.agents[agentId];
  }

  // Fall back to single-bot config
  if (config.feishu) {
    return {
      appId: config.feishu.appId,
      appSecret: config.feishu.appSecret,
    };
  }

  return undefined;
}

/**
 * Check if multi-bot mode is enabled
 */
export function isMultiBotMode(config: RuntimeConfig): boolean {
  return config.multiBotFeishu !== undefined && !config.multiBotFeishu.singleBotMode;
}