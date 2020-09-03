
import { listen, MessageConnection } from 'vscode-ws-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');
const ReconnectingWebSocket = require('reconnecting-websocket');

// register Monaco languages
monaco.languages.register({
    id: 'robot',
    extensions: ['.robot'],
    aliases: ['Robot','robot']
})

// create Monaco editor
const value = '';
const editor = monaco.editor.create(document.getElementById("container")!, {
    model: monaco.editor.createModel(value, 'robot', monaco.Uri.parse('file:///abs/path/to/demo/robot/file.robot')),
    glyphMargin: true,
    theme: "vs-dark",
    lightbulb: {
        enabled: true
    }
});

// install Monaco language client services
MonacoServices.install(editor,{rootUri: "file:///abs/path/to/demo/robot"});

// create the web socket
const url = createUrl('ws://localhost:3000/robotti')
const webSocket = createWebSocket(url);
// listen when the web socket is opened
listen({
    webSocket,
    onConnection: connection => {
        // create and start the language client
        const languageClient = createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
    }
});

function createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['robot'],
            // disable the default error handler
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
            }
        }
    });
}

function createUrl(path: string): string {
    return normalizeUrl(path);
}

function createWebSocket(url: string): WebSocket {
    const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
    };
    return new ReconnectingWebSocket(url, [], socketOptions);
}