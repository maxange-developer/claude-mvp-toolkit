import OpenAI from 'openai'
import {
  type AIProvider,
  type GenerateOptions,
  type GenerateResult,
  type EmbedOptions,
  type EmbedResult,
  AIError,
} from '../types'

const DEFAULT_CHAT_MODEL = process.env.AI_MODEL_CHAT ?? 'gpt-4o-mini'
const DEFAULT_EMBED_MODEL = process.env.AI_MODEL_EMBED ?? 'text-embedding-3-small'

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new AIError('OPENAI_API_KEY not set in environment', 'auth', 'openai')
  }
  return new OpenAI({ apiKey })
}

function mapError(e: unknown): AIError {
  if (e instanceof AIError) return e
  const err = e as { status?: number; message?: string }
  if (err.status === 401 || err.status === 403) {
    return new AIError('Authentication failed', 'auth', 'openai', e)
  }
  if (err.status === 429) {
    return new AIError('Rate limit exceeded', 'rate_limit', 'openai', e)
  }
  if (err.status && err.status >= 500) {
    return new AIError('Provider server error', 'server', 'openai', e)
  }
  if (err.status && err.status >= 400) {
    return new AIError(err.message ?? 'Invalid request', 'invalid', 'openai', e)
  }
  return new AIError(err.message ?? 'Network error', 'network', 'openai', e)
}

export const openaiProvider: AIProvider = {
  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const client = getClient()
    const messages = [
      ...(opts.system ? [{ role: 'system' as const, content: opts.system }] : []),
      ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
    ]
    try {
      const response = await client.chat.completions.create({
        model: opts.model ?? DEFAULT_CHAT_MODEL,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.7,
        messages,
      })

      const text = response.choices[0]?.message?.content ?? ''

      return {
        text,
        usage: {
          inputTokens: response.usage?.prompt_tokens ?? 0,
          outputTokens: response.usage?.completion_tokens ?? 0,
        },
        raw: response,
      }
    } catch (e) {
      throw mapError(e)
    }
  },

  async *stream(opts: GenerateOptions): AsyncIterable<string> {
    const client = getClient()
    const messages = [
      ...(opts.system ? [{ role: 'system' as const, content: opts.system }] : []),
      ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
    ]
    try {
      const stream = await client.chat.completions.create({
        model: opts.model ?? DEFAULT_CHAT_MODEL,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.7,
        messages,
        stream: true,
      })

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) yield delta
      }
    } catch (e) {
      throw mapError(e)
    }
  },

  async embed(opts: EmbedOptions): Promise<EmbedResult> {
    const client = getClient()
    const inputs = Array.isArray(opts.input) ? opts.input : [opts.input]
    try {
      const response = await client.embeddings.create({
        input: inputs,
        model: opts.model ?? DEFAULT_EMBED_MODEL,
      })

      return {
        embeddings: response.data.map((d) => d.embedding),
        usage: {
          inputTokens: response.usage.prompt_tokens,
        },
      }
    } catch (e) {
      throw mapError(e)
    }
  },
}
