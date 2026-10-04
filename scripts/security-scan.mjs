import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Findings contain locations only. Never print a matched credential.
const patterns = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/g],
  ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['openai-key', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/g],
  ['google-api-key', /\bAIza[A-Za-z0-9_-]{35}\b/g],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ['credential-url', /https?:\/\/[^\s/<>"']+:[^\s/<>"']+@/g],
];
const ignored = new Set(['.git', 'node_modules', 'dist', '.npm-security-cache']);
const results = [];
let files = 0;
function scan(buffer, location) {
  if (buffer.includes(0)) return;
  const text = buffer.toString('utf8');
  files++;
  for (const [kind, pattern] of patterns) {
    for (const match of text.matchAll(pattern)) {
      results.push({ location, kind, line: text.slice(0, match.index).split('\n').length });
    }
  }
}
function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.isSymbolicLink() || ignored.has(item.name)) continue;
    const file = path.join(directory, item.name);
    if (item.isDirectory()) walk(file);
    else if (fs.statSync(file).size < 2_000_000) scan(fs.readFileSync(file), file);
  }
}
walk('.');
// Also inspect the exact files that will be deployed, even though dist is
// excluded from the source traversal to avoid scanning it twice.
if (fs.existsSync('dist')) walk('dist');
const revisions = execFileSync('git', ['rev-list', '--all'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const seen = new Set();
for (const revision of revisions) {
  const entries = execFileSync('git', ['ls-tree', '-r', revision], { encoding: 'utf8', maxBuffer: 20_000_000 });
  for (const entry of entries.trim().split('\n')) {
    const match = entry.match(/^\d+ blob ([a-f0-9]+)\t(.+)$/);
    if (!match || seen.has(match[1])) continue;
    seen.add(match[1]);
    const size = Number(execFileSync('git', ['cat-file', '-s', match[1]], { encoding: 'utf8' }));
    if (size < 2_000_000) scan(execFileSync('git', ['cat-file', 'blob', match[1]], { maxBuffer: 2_000_000 }), `${revision.slice(0, 8)}:${match[2]}`);
  }
}
console.log(JSON.stringify({ textFilesScanned: files, revisions: revisions.length, findings: results }, null, 2));
if (results.length) process.exitCode = 1;
