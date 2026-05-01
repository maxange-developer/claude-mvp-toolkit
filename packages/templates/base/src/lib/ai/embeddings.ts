// Implement with your AI provider (OpenAI text-embedding-3-small recommended for pgvector)
export async function generateEmbedding(_text: string): Promise<number[]> {
  throw new Error('generateEmbedding not implemented — add your AI provider in src/lib/ai/')
}
