import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Varun Sehgal - Frontend & UI/UX Developer',
  description: 'Portfolio of Varun Sehgal, a passionate Frontend & UI/UX Developer specializing in React, Next.js, Three.js, and modern web technologies. Currently pursuing B.Tech in CSE at JUET, Guna.',
  keywords: ['Varun Sehgal', 'Frontend Developer', 'UI/UX Designer', 'React Developer', 'Next.js', 'Three.js', 'Web Developer', 'Portfolio'],
  authors: [{ name: 'Varun Sehgal' }],
  creator: 'Varun Sehgal',
  publisher: 'Varun Sehgal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://varunsehgal-portfolio.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Varun Sehgal - Frontend & UI/UX Developer',
    description: 'Portfolio showcasing modern web development projects built with React, Next.js, Three.js, and cutting-edge technologies.',
    url: 'https://varunsehgal-portfolio.vercel.app',
    siteName: 'Varun Sehgal Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Varun Sehgal - Frontend & UI/UX Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Varun Sehgal - Frontend & UI/UX Developer',
    description: 'Portfolio showcasing modern web development projects built with React, Next.js, Three.js, and cutting-edge technologies.',
    images: ['/og-image.jpg'],
    creator: '@varunsehgal02',
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
