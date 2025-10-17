import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LyricSearch',
  description: 'Find songs by lyrics, filter by artists, and sort by popularity.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}> 
        {children}
      </body>
    </html>
  )
}
