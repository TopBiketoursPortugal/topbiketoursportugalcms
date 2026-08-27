// Root `prepare` hook: install the lefthook git hooks for local development only.
//
// pnpm runs `prepare` on every install, including CI builds (Netlify,
// CloudCannon). Those must not install git hooks: the checkout there often has
// no `.git` at all, and `lefthook install` then aborts the whole install with
// "fatal: not a git repository". So skip when `CI` is set (same convention as
// lefthook's own npm postinstall; `LEFTHOOK=1` opts back in), skip when there is
// no git repository, and never let a hook-install failure fail the install.
import { execSync } from 'node:child_process';

const on = (v) => Boolean(v) && v !== '0' && v !== 'false';

if (on(process.env.CI) && !on(process.env.LEFTHOOK)) {
  process.exit(0);
}

try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
  console.warn('prepare: not a git repository, skipping lefthook install');
  process.exit(0);
}

try {
  execSync('lefthook install', { stdio: 'inherit' });
} catch (e) {
  console.warn(`prepare: 'lefthook install' failed, skipping.\n${e.message}`);
}
