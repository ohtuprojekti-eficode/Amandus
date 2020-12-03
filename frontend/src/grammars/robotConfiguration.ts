// from https://github.com/robocorp/robotframework-lsp/blob/master/robotframework-ls/language-configuration.json
export const robotConfiguration = {
  comments: {
    lineComment: '#',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: "'",
      close: "'",
    },
  ],
  surroundingPairs: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
    ['"', '"'],
    ["'", "'"],
    ['*', '*'],
    ['_', '_'],
  ],
}
