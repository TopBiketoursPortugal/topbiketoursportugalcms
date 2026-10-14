// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
// pnpm workspace root — dependencies resolve through the workspace's
// node_modules/.pnpm store, so Metro must be allowed to watch and resolve
// from there, not only from this app's folder.
const workspaceRoot = path.resolve(projectRoot, '../..');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Watch this app plus the workspace root (for hoisted/shared deps), but not
// the sibling Astro apps' large content trees.
config.watchFolders = [projectRoot, workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
];

module.exports = config;
