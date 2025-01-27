import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whisper Meeting Minutes',
  description: 'Real-time Arabic speech transcription and summarization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}