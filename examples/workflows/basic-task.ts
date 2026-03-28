// Example: Basic workflow execution

import MultiClawRuntime from '../src/index';

async function main() {
  const runtime = new MultiClawRuntime();

  // Simple task processing
  const response = await runtime.processTask(
    'Design a REST API for user management'
  );

  console.log('Response:', response);
}

main().catch(console.error);