// modified version of code from https://github.com/bolinfest/monaco-tm
import type { LanguageId } from '../utils/languages'
import type { TextMateGrammar, ScopeNameInfo } from '../utils/providers'
import { createOnigScanner, createOnigString } from 'vscode-oniguruma'
import { SimpleLanguageInfoProvider } from '../utils/providers'
import { registerLanguages } from '../utils/languages'
import { rehydrateRegexps } from '../utils/configuration'
import VsCodeDarkTheme from '../styles/editor-themes/vs-dark-plus-theme'
import VsCodeLightTheme from '../styles/editor-themes/vs-light-plus-theme'
import { grammar } from '../grammars/robot'
import { robotConfiguration } from '../grammars/robotConfiguration'

import { listen } from '@codingame/monaco-jsonrpc'
import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from '@codingame/monaco-languageclient'
import normalizeUrl from 'normalize-url'
import ReconnectingWebSocket from 'reconnecting-websocket'

interface DemoScopeNameInfo extends ScopeNameInfo {
  path: string
}

export const initLanguageClient = (monaco: typeof import('monaco-editor')) => {
  monaco.languages.register({
    id: 'robot',
    extensions: ['.robot'],
    aliases: ['Robot', 'robot'],
  })

  // install Monaco language client services
  MonacoServices.install(monaco)

  const LANGUAGE_SERVER_PORT = process.env.LANGUAGE_SERVER_PORT ?? 5555

  // create the web socket
  const url = normalizeUrl(
    `ws://${window.location.hostname}:${LANGUAGE_SERVER_PORT}/robot`
  )

  const socketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 10000,
    maxRetries: Infinity,
    debug: false,
  }
  const webSocket = new ReconnectingWebSocket(
    url,
    [],
    socketOptions
  ) as WebSocket

  listen({
    webSocket,
    onConnection: (connection) => {
      // create the language client
      const languageClient = new MonacoLanguageClient({
        name: 'Sample Language Client',
        clientOptions: {
          // use a language id as a document selector
          documentSelector: ['robot'],
          // disable the default error handler
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart,
          },
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
          get: (errorHandler, closeHandler) => {
            return Promise.resolve(
              createConnection(connection, errorHandler, closeHandler)
            )
          },
        },
      })

      // start the language client
      const disposable = languageClient.start()
      connection.onClose(() => disposable.dispose())
    },
  })
}

export const initMonaco = (
  monaco: typeof import('monaco-editor'),
  themeName: string
) => {
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
    theme: themeName === 'light' ? VsCodeLightTheme : VsCodeDarkTheme,
    onigLib,
    monaco,
  })
  registerLanguages(
    languages,
    (language: LanguageId) => provider.fetchLanguageInfo(language),
    monaco
  )

  provider.injectCSS()

  return provider
}
