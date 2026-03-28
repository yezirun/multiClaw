// Example: Multi-agent workflow

import MultiClawRuntime from '../src/index';
import type { AgentRole } from '../src/types';

async function main() {
  const runtime = new MultiClawRuntime();

  // Define workflow steps
  const steps: Array<{ agent: AgentRole; action: string }> = [
    { agent: 'po', action: 'Analyze requirements for the feature' },
    { agent: 'architect', action: 'Design system architecture' },
    { agent: 'backend', action: 'Implement API endpoints' },
    { agent: 'frontend', action: 'Create user interface' },
    { agent: 'qa', action: 'Write tests and validate' },
    { agent: 'devops', action: 'Setup deployment pipeline' },
  ];

  // Run workflow
  await runtime.runWorkflow('Feature Development', steps);

  console.log('Workflow completed');
}

main().catch(console.error);