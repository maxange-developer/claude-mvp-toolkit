/**
 * Provider-agnostic AI types.
 * Implementations live in ./providers/{claude,openai}.ts
 */

export type ChatRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface GenerateOptions {
  messages: ChatMessage[]
  model?: string
  maxTokens?: number
  temperature?: number
  /** System prompt — extracted from messages or passed separately. */
  system?: string
}

export interface GenerateResult {
  text: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
  /** Provider-specific raw response for debugging. */
  raw: unknown
}

export interface EmbedOptions {
  /** Single text or batch. Implementations should handle batching. */
  input: string | string[]
  model?: string
}

export interface EmbedResult {
  embeddings: number[][]
  usage: {
    inputTokens: number
  }
}

export interface AIProvider {
  /** Non-streaming generation. */
  generate(opts: GenerateOptions): Promise<GenerateResult>
  /** Streaming generation. Yields text chunks. */
  stream(opts: GenerateOptions): AsyncIterable<string>
  /** Generate embeddings for retrieval. */
  embed(opts: EmbedOptions): Promise<EmbedResult>
}

export class AIError extends Error {
  constructor(
    message: string,
    public readonly code: 'auth' | 'rate_limit' | 'server' | 'invalid' | 'network',
    public readonly provider: string,
    public readonly cause?: unknown,
  ) {
    super(`[ai:${provider}:${code}] ${message}`)
    this.name = 'AIError'
  }
}
