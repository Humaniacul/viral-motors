import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://viralmotors.com' : 'http://localhost:3000'),
  title: 'Viral Motors - Automotive News & Reviews',
  description: 'Your premier destination for automotive news, reviews, and viral content. Stay updated with the latest in the automotive world.',
  keywords: ['automotive', 'cars', 'news', 'reviews', 'viral', 'motors', 'technology'],
  authors: [{ name: 'Viral Motors Team' }],
  creator: 'Viral Motors',
  publisher: 'Viral Motors',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viralmotors.com',
    siteName: 'Viral Motors',
    title: 'Viral Motors - Automotive News & Reviews',
    description: 'Your premier destination for automotive news, reviews, and viral content.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Viral Motors - Automotive News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viral Motors - Automotive News & Reviews',
    description: 'Your premier destination for automotive news, reviews, and viral content.',
    images: ['/og-image.jpg'],
    creator: '@viralmotors',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/images/vm-logo.png" />
        <link rel="apple-touch-icon" href="/images/vm-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": "Viral Motors",
              "url": "https://viralmotors.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://viralmotors.com/images/vm-logo.png"
              },
              "description": "Premier automotive news and reviews platform",
              "sameAs": [
                "https://twitter.com/viralmotors",
                "https://facebook.com/viralmotors",
                "https://instagram.com/viralmotors",
                "https://youtube.com/viralmotors"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-dark-bg text-dark-text">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
