module.exports = {
  webpack: (config) => {
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
  },
  jest: (config) => {
    config.moduleNameMapper = {
      '^vscode$': require.resolve(
        '@codingame/monaco-languageclient/lib/vscode-compatibility'
      ),
    }

    config.transformIgnorePatterns = ['node_modules/(?!@monaco-editor)/']

    return config
  },
}
