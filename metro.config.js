const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-css-transformer"),
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
    resolver: {
      sourceExts: [...sourceExts, "css"],
    },
  };
})();