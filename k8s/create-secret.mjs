// Parse quoted .env values correctly without writing credentials to disk or logs.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parseEnv } from 'node:util';

const stringData = parseEnv(readFileSync(new URL('../backend/.env', import.meta.url), 'utf8'));
if (!stringData.DATABASE_URL) throw new Error('backend/.env must contain DATABASE_URL');
const result = spawnSync('kubectl', [
  '--context=docker-desktop', '--namespace=default', 'apply', '-f', '-',
], {
  input: JSON.stringify({
    apiVersion: 'v1', kind: 'Secret',
    metadata: { name: 'backend-env' }, type: 'Opaque', stringData,
  }),
  encoding: 'utf8',
});
if (result.error || result.status !== 0) {
  // Do not echo kubectl errors that might contain submitted Secret data.
  console.error('Secret apply failed. Check Docker Desktop cluster access.');
  process.exit(1);
}
console.log('backend-env Secret applied to docker-desktop/default.');
