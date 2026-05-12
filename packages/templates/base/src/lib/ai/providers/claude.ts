import Anthropic from '@anthropic-ai/sdk'
import { VoyageAIClient } from 'voyageai'
import {
  type AIProvider,
  type GenerateOptions,
  type GenerateResult,
  type EmbedOptions,
  type EmbedResult,
  AIError,
} from '../types'

const DEFAULT_CHAT_MODEL = process.env.AI_MODEL_CHAT ?? 'claude-sonnet-4-6'
const DEFAULT_EMBED_MODEL = process.env.AI_MODEL_EMBED ?? 'voyage-3'

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new AIError('ANTHROPIC_API_KEY not set in environment', 'auth', 'anthropic')
  }
  return new Anthropic({ apiKey })
}

function getVoyageClient(): VoyageAIClient {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) {
    throw new AIError(
      'VOYAGE_API_KEY not set in environment (required for embeddings on Anthropic)',
      'auth',
      'voyage',
    )
  }
  return new VoyageAIClient({ apiKey })
}

function extractSystem(opts: GenerateOptions): {
  system: string | undefined
  messages: { role: 'user' | 'assistant'; content: string }[]
} {
  let system = opts.system
  const filtered: { role: 'user' | 'assistant'; content: string }[] = []
  for (const m of opts.messages) {
    if (m.role === 'system') {
      system = system ? `${system}\n\n${m.content}` : m.content
    } else {
      filtered.push({ role: m.role, content: m.content })
    }
  }
  return { system, messages: filtered }
}

function mapError(e: unknown): AIError {
  if (e instanceof AIError) return e
  const err = e as { status?: number; message?: string }
  if (err.status === 401 || err.status === 403) {
    return new AIError('Authentication failed', 'auth', 'anthropic', e)
  }
  if (err.status === 429) {
    return new AIError('Rate limit exceeded', 'rate_limit', 'anthropic', e)
  }
  if (err.status && err.status >= 500) {
    return new AIError('Provider server error', 'server', 'anthropic', e)
  }
  if (err.status && err.status >= 400) {
    return new AIError(err.message ?? 'Invalid request', 'invalid', 'anthropic', e)
  }
  return new AIError(err.message ?? 'Network error', 'network', 'anthropic', e)
}

export const claudeProvider: AIProvider = {
  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const client = getAnthropicClient()
    const { system, messages } = extractSystem(opts)
    try {
      const response = await client.messages.create({
        model: opts.model ?? DEFAULT_CHAT_MODEL,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.7,
        system,
        messages,
      })

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('')

      return {
        text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
        raw: response,
      }
    } catch (e) {
      throw mapError(e)
    }
  },

  async *stream(opts: GenerateOptions): AsyncIterable<string> {
    const client = getAnthropicClient()
    const { system, messages } = extractSystem(opts)
    try {
      const stream = await client.messages.create({
        model: opts.model ?? DEFAULT_CHAT_MODEL,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.7,
        system,
        messages,
        stream: true,
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield event.delta.text
        }
      }
    } catch (e) {
      throw mapError(e)
    }
  },

  async embed(opts: EmbedOptions): Promise<EmbedResult> {
    const client = getVoyageClient()
    const inputs = Array.isArray(opts.input) ? opts.input : [opts.input]
    try {
      const response = await client.embed({
        input: inputs,
        model: opts.model ?? DEFAULT_EMBED_MODEL,
      })

      const embeddings = (response.data ?? []).map((d) => d.embedding ?? [])

      return {
        embeddings,
        usage: {
          inputTokens: response.usage?.totalTokens ?? 0,
        },
      }
    } catch (e) {
      throw mapError(e)
    }
  },
}
