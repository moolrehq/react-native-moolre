const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');

const root = path.resolve(__dirname, '..');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  'react': path.resolve(root, 'node_modules/react'),
  'react-native': path.resolve(root, 'node_modules/react-native'),
  'react-dom': path.resolve(root, 'node_modules/react-dom'),
};

defaultConfig.watchFolders = [root]; // Ensure Metro watches the root folder

module.exports = getConfig(defaultConfig, {
  root,
  project: __dirname,
});
