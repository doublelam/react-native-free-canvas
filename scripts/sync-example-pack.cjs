'use strict';

/**
 * Build the library, npm pack into `.pack/`, copy to a stable filename, and
 * reinstall expo-example so it consumes the tarball (same layout as npm users).
 *
 * Skip the build step with: SKIP_LIB_BUILD=1 node scripts/sync-example-pack.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packDir = path.join(root, '.pack');
const exampleDir = path.join(root, 'expo-example');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const { version } = pkg;

fs.mkdirSync(packDir, { recursive: true });

if (process.env.SKIP_LIB_BUILD !== '1') {
  execSync('yarn build', { cwd: root, stdio: 'inherit' });
}

execSync('npm pack --pack-destination .pack', { cwd: root, stdio: 'inherit' });

const named = path.join(packDir, `react-native-free-canvas-${version}.tgz`);
const stable = path.join(packDir, 'react-native-free-canvas.tgz');
if (!fs.existsSync(named)) {
  throw new Error(`Expected pack at ${named}`);
}
fs.copyFileSync(named, stable);

execSync(
  `tar -tzf "${stable}" | grep -q 'package/lib/module/index.js' && tar -tzf "${stable}" | grep -q 'package/package.json'`,
  { stdio: 'inherit', shell: '/bin/bash' },
);

execSync('yarn install --non-interactive', { cwd: exampleDir, stdio: 'inherit' });
