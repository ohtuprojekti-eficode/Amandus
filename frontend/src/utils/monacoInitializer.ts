// modified version of code from https://github.com/bolinfest/monaco-tm
import type { LanguageId } from '../utils/languages'
import type { TextMateGrammar, ScopeNameInfo } from '../utils/providers'
import { createOnigScanner, createOnigString } from 'vscode-oniguruma'
import { SimpleLanguageInfoProvider } from '../utils/providers'
import { registerLanguages } from '../utils/languages'
import { rehydrateRegexps } from '../utils/configuration'
import VsCodeDarkTheme from '../themes/vs-dark-plus-theme'
import { grammar } from '../grammars/robot'
import { robotConfiguration } from '../grammars/robotConfiguration'

interface DemoScopeNameInfo extends ScopeNameInfo {
  path: string
}

export const initMonaco = async (monaco: typeof import('monaco-editor')) => {
  const languages = [
    {
      id: 'robot',
      extensions: ['.robot'],
    },
  ]

  const grammars: { [scopeName: string]: DemoScopeNameInfo } = {
    'source.robot': {
      language: 'robot',
      path: 'robotframework.tmLanguage.json',
    },
  }

  const fetchGrammar = async (): Promise<TextMateGrammar> => {
    const type = 'json'
    const json = JSON.stringify(grammar)
    return { type, grammar: json }
  }

  const fetchConfiguration = async () => {
    const rawConfiguration = JSON.stringify(robotConfiguration)
    return rehydrateRegexps(rawConfiguration)
  }

  const onigLib = Promise.resolve({
    createOnigScanner,
    createOnigString,
  })

  const provider = new SimpleLanguageInfoProvider({
    grammars,
    fetchGrammar,
    configurations: languages.map((language) => language.id),
    fetchConfiguration,
    theme: VsCodeDarkTheme,
    onigLib,
    monaco,
  })
  registerLanguages(
    languages,
    (language: LanguageId) => provider.fetchLanguageInfo(language),
    monaco
  )

  monaco.editor.setTheme('vs-dark')

  provider.injectCSS()
}
