// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// This app lives inside the topbiketoursportugalcms repo, alongside the
// unrelated Astro site and its own (pnpm-managed) node_modules. Scope
// Metro's file watching to this folder so it isn't also watching/rebuilding
// on changes to that much larger, unrelated tree.
config.watchFolders = [__dirname];

module.exports = config;
