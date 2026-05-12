/**
 * AI client — Anthropic only.
 *
 * Models:
 *   AI_MODEL_CHAT — default: claude-sonnet-4-6
 *   AI_MODEL_EMBED — default: voyage-3
 *
 * Required API keys: ANTHROPIC_API_KEY + VOYAGE_API_KEY
 */

import { claudeProvider } from './providers/claude'
import type { AIProvider } from './types'

export async function getProvider(): Promise<AIProvider> {
  return claudeProvider
}

export function getProviderSync(): AIProvider {
  return claudeProvider
}

export * from './types'
