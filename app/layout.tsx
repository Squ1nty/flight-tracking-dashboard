// app/layout.tsx
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import { ThemeProvider } from './contextFiles/ThemeContext'
import SessionProvider from './components/SessionProvider'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800'],
  variable: '--font-nunito-sans',
})

export const metadata: Metadata = {
  title: 'FlightTrack',
  description: 'Live AUS/NZ flight tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} font-sans antialiased flex h-screen flex-col overflow-hidden`}>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}