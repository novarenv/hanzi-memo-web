import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Hanzi Memo',
  description: 'Learning Hanzi made easy',
}

export default function RootLayout({children}: {
  children: React.ReactNode,
}) {
  return (
      <html lang="en">
      <body className={`bg-black ${inter.className}`}>{children}</body>
      </html>
  )
}
