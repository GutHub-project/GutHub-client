// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Enable package exports 및 proper resolution
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
