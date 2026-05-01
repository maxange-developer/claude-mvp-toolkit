import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '__PROJECT_NAME__',
  description: 'Built with claude-mvp-toolkit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
