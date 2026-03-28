import { createLogger } from '../utils/logger';
import type { DiscussionSession, Message, AgentRole, VisibleDiscussionOptions } from '../types';
import { createAgentMessage } from '../agents/base';

const logger = createLogger('session');

export class SessionManager {
  private sessions: Map<string, DiscussionSession> = new Map();

  createSession(topic: string, participants: AgentRole[]): DiscussionSession {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session: DiscussionSession = {
      id: sessionId,
      topic,
      participants,
      messages: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    logger.info(`Session created: ${sessionId}`, { topic, participants });

    return session;
  }

  getSession(sessionId: string): DiscussionSession | undefined {
    return this.sessions.get(sessionId);
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.messages.push(message);
    session.updatedAt = new Date();

    logger.info(`Message added to session ${sessionId}`, {
      messageId: message.id,
      role: message.role,
    });
  }

  updateStatus(sessionId: string, status: 'active' | 'paused' | 'completed'): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = status;
    session.updatedAt = new Date();

    logger.info(`Session ${sessionId} status updated to ${status}`);
  }

  getActiveSessions(): DiscussionSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.status === 'active');
  }

  closeSession(sessionId: string): void {
    this.updateStatus(sessionId, 'completed');
    logger.info(`Session ${sessionId} closed`);
  }

  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      logger.info(`Session ${sessionId} deleted`);
    }
    return deleted;
  }

  getSessionCount(): number {
    return this.sessions.size;
  }

  listSessions(): DiscussionSession[] {
    return Array.from(this.sessions.values());
  }
}