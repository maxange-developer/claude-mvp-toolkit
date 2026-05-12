import { getProvider, AIError } from '@/lib/ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  let body: { messages: { role: 'user' | 'assistant'; content: string }[] }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response('messages required', { status: 400 })
  }

  try {
    const ai = await getProvider()
    const stream = ai.stream({
      messages: body.messages,
      system: 'You are a helpful assistant.',
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    if (e instanceof AIError) {
      const status =
        e.code === 'auth' ? 401 : e.code === 'rate_limit' ? 429 : e.code === 'invalid' ? 400 : 500
      return new Response(e.message, { status })
    }
    return new Response('Server error', { status: 500 })
  }
}
