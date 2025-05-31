import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { BackgroundEffects } from '@/components/effects/background-effects'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZenBotTX9000 - Advanced AI Assistant',
  description: 'Premium enterprise-grade AI chatbot with cutting-edge UI/UX',
  keywords: 'AI, chatbot, assistant, enterprise, premium, ZenBot',
  authors: [{ name: 'ZenBot Technologies' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#1e293b',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ZenBotTX9000 - Advanced AI Assistant',
    description: 'Premium enterprise-grade AI chatbot with cutting-edge UI/UX',
    type: 'website',
    siteName: 'ZenBotTX9000',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenBotTX9000 - Advanced AI Assistant',
    description: 'Premium enterprise-grade AI chatbot with cutting-edge UI/UX',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <BackgroundEffects />
        <Providers>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}