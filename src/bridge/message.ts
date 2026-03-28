import type { Message, HandoffResult, AgentRole } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('message-handler');

export interface MessageHandlerOptions {
  maxHistory?: number;
  summarizeThreshold?: number;
}

export class MessageHandler {
  private messages: Message[] = [];
  private maxHistory: number;
  private summarizeThreshold: number;

  constructor(options: MessageHandlerOptions = {}) {
    this.maxHistory = options.maxHistory || 100;
    this.summarizeThreshold = options.summarizeThreshold || 10;
  }

  addMessage(message: Message): void {
    this.messages.push(message);

    // Keep only the last maxHistory messages
    if (this.messages.length > this.maxHistory) {
      this.messages = this.messages.slice(-this.maxHistory);
    }

    logger.info(`Message added from ${message.role}`, { messageId: message.id });
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getLastMessages(count: number): Message[] {
    return this.messages.slice(-count);
  }

  clear(): void {
    this.messages = [];
    logger.info('Message history cleared');
  }

  createHandoff(from: AgentRole, to: AgentRole, context: Record<string, unknown>): HandoffResult {
    const handoff: HandoffResult = {
      from,
      to,
      context,
      timestamp: new Date(),
    };

    logger.info(`Handoff created: ${from} -> ${to}`);
    return handoff;
  }

  shouldSummarize(): boolean {
    return this.messages.length >= this.summarizeThreshold;
  }

  generateSummary(): string {
    const recentMessages = this.getLastMessages(this.summarizeThreshold);

    const summary = recentMessages
      .map((msg) => `[${msg.role}]: ${msg.content.slice(0, 50)}...`)
      .join('\n');

    return summary;
  }

  formatForDisplay(): string {
    return this.messages
      .map((msg) => {
        const timestamp = msg.timestamp.toISOString();
        return `[${timestamp}] ${msg.role}: ${msg.content}`;
      })
      .join('\n');
  }

  getMessagesByRole(role: AgentRole): Message[] {
    return this.messages.filter((msg) => msg.role === role);
  }

  getMessageCount(): number {
    return this.messages.length;
  }
}