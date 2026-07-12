// ng-packagr strips custom package.json fields; re-add the ng-add wiring so
// `ng add @aaronch/agentic` works from the published package.
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/packages/agentic/package.json';
const pkg = JSON.parse(readFileSync(path, 'utf8'));
pkg.schematics = './schematics/collection.json';
pkg['ng-add'] = { save: 'dependencies' };
writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log(
  'Patched dist/packages/agentic/package.json (schematics + ng-add).',
);
