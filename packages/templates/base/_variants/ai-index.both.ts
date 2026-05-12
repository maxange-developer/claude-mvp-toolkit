/**
 * Provider-agnostic AI client.
 *
 * Set AI_PROVIDER=anthropic or AI_PROVIDER=openai in .env.
 * Default: anthropic.
 *
 * Models:
 *   AI_MODEL_CHAT — defaults: claude-sonnet-4-6 / gpt-4o-mini
 *   AI_MODEL_EMBED — defaults: voyage-3 / text-embedding-3-small
 *
 * Required API keys:
 *   anthropic: ANTHROPIC_API_KEY + VOYAGE_API_KEY (for embeddings)
 *   openai:    OPENAI_API_KEY
 */

import type { AIProvider } from './types'

type ProviderName = 'anthropic' | 'openai'

function resolveProvider(): ProviderName {
  const raw = process.env.AI_PROVIDER?.toLowerCase()
  if (raw === 'openai') return 'openai'
  if (raw === 'anthropic') return 'anthropic'
  if (!raw) return 'anthropic'
  throw new Error(`Invalid AI_PROVIDER="${raw}". Must be "anthropic" or "openai".`)
}

let _provider: AIProvider | null = null

export async function getProvider(): Promise<AIProvider> {
  if (_provider) return _provider
  const name = resolveProvider()
  if (name === 'anthropic') {
    const { claudeProvider } = await import('./providers/claude')
    _provider = claudeProvider
  } else {
    const { openaiProvider } = await import('./providers/openai')
    _provider = openaiProvider
  }
  return _provider
}

/**
 * Convenience: get provider sync if already initialized.
 * Throws if not yet initialized. Useful in API routes after warmup.
 */
export function getProviderSync(): AIProvider {
  if (!_provider) {
    throw new Error(
      'AI provider not initialized. Call getProvider() first or use it in an async context.',
    )
  }
  return _provider
}

export * from './types'
