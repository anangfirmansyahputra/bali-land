import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bali.land - Discover Vacant Land and Land Plots in Bali',
  description: 'Explore a wide range of vacant land and land plots in Bali with ease on Bali Land. Your trusted source for comprehensive information, current prices, and strategic locations. Find the perfect land for your property investment journey today.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
