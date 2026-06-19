import type { Metadata } from 'next'
import './globals.css'
import { ViewTransitions } from 'next-view-transitions'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'

export const metadata: Metadata = {
  title: 'Pamedia Media Agency',
  description: 'A creative agency built for the modern era.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ViewTransitions>
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to Supabase CDN so video/image requests don't pay DNS+TLS on first use */}
        <link rel="preconnect" href="https://ggdflkchtogsssnakxsh.supabase.co" />
        <link rel="dns-prefetch" href="https://ggdflkchtogsssnakxsh.supabase.co" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
    </ViewTransitions>
  )
}
