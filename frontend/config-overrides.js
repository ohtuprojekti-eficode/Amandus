module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      vscode: require.resolve(
        '@codingame/monaco-languageclient/lib/vscode-compatibility'
      ),
    },
  }
  return config
}
