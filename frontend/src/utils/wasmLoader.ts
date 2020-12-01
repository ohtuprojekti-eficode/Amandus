export async function loadVSCodeOnigurumWASM(): Promise<
  Response | ArrayBuffer
> {
  const wasmUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/onig'
      : '/onig'
  const response = await fetch(wasmUrl)
  const contentType = response.headers.get('content-type')
  if (contentType === 'application/wasm') {
    return response
  }

  // Using the response directly only works if the server sets the MIME type 'application/wasm'.
  // Otherwise, a TypeError is thrown when using the streaming compiler.
  // We therefore use the non-streaming compiler :(.
  return await response.arrayBuffer()
}
