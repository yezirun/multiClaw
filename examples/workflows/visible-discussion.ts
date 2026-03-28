// Example: Visible discussion tracking

import MultiClawRuntime from '../src/index';
import { VisibleDiscussion } from '../src/runtime';
import { createAgentMessage } from '../src/agents';

async function main() {
  const runtime = new MultiClawRuntime();
  const discussion = runtime.getVisibleDiscussion();

  // Create a session
  const sessionId = 'example-session';

  // Track messages
  discussion.trackDiscussion(sessionId, createAgentMessage('po', 'Let me define the requirements first...'));
  discussion.trackDiscussion(sessionId, createAgentMessage('architect', 'Based on requirements, here is the design...'));
  discussion.trackDiscussion(sessionId, createAgentMessage('backend', 'Implementing the API as designed...'));

  // Check if summary needed
  if (discussion.shouldSummarize(sessionId)) {
    const summary = discussion.generateSummary(sessionId);
    console.log('Summary:', summary);
  }

  // Format for Feishu
  const feishuFormat = discussion.formatForFeishu(sessionId);
  console.log('Feishu format:', feishuFormat);
}

main().catch(console.error);