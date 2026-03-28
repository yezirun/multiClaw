import axios from 'axios';
import { createLogger } from '../utils/logger';
import type { OpenClawConfig } from '../types';

const logger = createLogger('openclaw-gateway');

interface OpenClawRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface OpenClawResponse {
  id: string;
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenClawGateway {
  private config: OpenClawConfig;
  private baseUrl: string;

  constructor(config: OpenClawConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.openclaw.ai';
  }

  async sendRequest(prompt: string, options?: Partial<OpenClawRequest>): Promise<string> {
    try {
      const request: OpenClawRequest = {
        prompt,
        model: options?.model || 'default',
        temperature: options?.temperature || 0.7,
        max_tokens: options?.max_tokens || 2048,
      };

      logger.info('Sending request to OpenClaw', {
        model: request.model,
        promptLength: prompt.length,
      });

      const response = await axios.post<OpenClawResponse>(
        `${this.baseUrl}/v1/chat`,
        request,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('Received response from OpenClaw', {
        responseId: response.data.id,
        contentLength: response.data.content.length,
      });

      return response.data.content;
    } catch (error) {
      logger.error('OpenClaw request failed', { error });
      throw error;
    }
  }

  async sendAgentRequest(
    rolePrompt: string,
    taskPrompt: string,
    options?: Partial<OpenClawRequest>
  ): Promise<string> {
    const fullPrompt = `${rolePrompt}\n\n---\n\nTask: ${taskPrompt}`;
    return this.sendRequest(fullPrompt, options);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  getApiKey(): string {
    return this.config.apiKey;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}