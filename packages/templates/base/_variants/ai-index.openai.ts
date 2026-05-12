/**
 * AI client — OpenAI only.
 *
 * Models:
 *   AI_MODEL_CHAT — default: gpt-4o-mini
 *   AI_MODEL_EMBED — default: text-embedding-3-small
 *
 * Required API key: OPENAI_API_KEY
 */

import { openaiProvider } from './providers/openai'
import type { AIProvider } from './types'

export async function getProvider(): Promise<AIProvider> {
  return openaiProvider
}

export function getProviderSync(): AIProvider {
  return openaiProvider
}

export * from './types'
