export async function loadVSCodeOnigurumWASM(): Promise<
  Response | ArrayBuffer
> {
  //   const response = await fetch(
  //     './node_modules/vscode-oniguruma/release/onig.wasm'
  //   )
  const response = await fetch('http://localhost:3001/onig')
  //   console.log(response)
  const contentType = response.headers.get('content-type')
  console.log(contentType)
  if (contentType === 'application/wasm') {
    // console.log('oikein')
    return response
  }

  // Using the response directly only works if the server sets the MIME type 'application/wasm'.
  // Otherwise, a TypeError is thrown when using the streaming compiler.
  // We therefore use the non-streaming compiler :(.
  return await response.arrayBuffer()
}
