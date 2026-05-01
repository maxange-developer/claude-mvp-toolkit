import Anthropic from '@anthropic-ai/sdk'

export function createClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function chat(messages: Anthropic.MessageParam[]): Promise<string> {
  const client = createClient()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages,
  })
  const block = response.content[0]
  return block.type === 'text' ? block.text : ''
}
