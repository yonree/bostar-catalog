import test from 'node:test';
import assert from 'node:assert/strict';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

test('prisma migrate diff from empty contains structured lead artifacts', async () => {
  const command =
    process.platform === 'win32' ? 'cmd /c npm run prisma:diff:empty' : 'npm run prisma:diff:empty';
  const { stdout } = await execAsync(command, {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024,
  });

  assert.match(stdout, /LeadAttachment/);
  assert.match(stdout, /LeadEvent/);
  assert.match(stdout, /NotificationLog/);
});
