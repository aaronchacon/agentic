// ng-packagr strips custom package.json fields; re-add the ng-add wiring so
// `ng add @ng-agentic/core` works from the published package.
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/packages/agentic/package.json';
const pkg = JSON.parse(readFileSync(path, 'utf8'));
pkg.schematics = './schematics/collection.json';
pkg['ng-add'] = { save: 'dependencies' };

// dist/ is outside the pnpm workspace, so neither pnpm nor changesets rewrite
// the `workspace:` protocol here. Replace it with the sibling package's real
// version so the published package resolves for consumers.
const themesVersion = JSON.parse(
  readFileSync('dist/packages/agentic-themes/package.json', 'utf8'),
).version;
for (const field of [
  'dependencies',
  'peerDependencies',
  'optionalDependencies',
]) {
  const deps = pkg[field];
  if (!deps) continue;
  for (const [name, range] of Object.entries(deps)) {
    if (typeof range === 'string' && range.startsWith('workspace:')) {
      deps[name] = `^${themesVersion}`;
    }
  }
}

writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log(
  `Patched dist/packages/agentic/package.json (schematics + ng-add; workspace: -> ^${themesVersion}).`,
);
