export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">__PROJECT_NAME__</h1>
        <p className="text-lg text-gray-600">
          Built with{' '}
          <span className="font-semibold text-orange-500">claude-mvp-toolkit</span>
        </p>
        <p className="mt-8 text-sm text-gray-400">
          Edit <code className="font-mono bg-gray-100 px-1 rounded">src/app/page.tsx</code> to get started
        </p>
      </div>
    </main>
  )
}
