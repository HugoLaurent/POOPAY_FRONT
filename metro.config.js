const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  "@": path.resolve(projectRoot),
  ...config.resolver.extraNodeModules,
};

config.watchFolders = config.watchFolders || [];
config.watchFolders.push(path.resolve(projectRoot));

module.exports = config;
