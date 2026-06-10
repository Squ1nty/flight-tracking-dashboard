// app/layout.tsx
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import { ThemeProvider } from './contextFiles/ThemeContext'

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
      <body className={`${nunitoSans.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}