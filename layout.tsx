import type React from "react"
import "@/app/globals.css"

import { Inter } from "next/font/google"
import localFont from "next/font/local"

import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// Use local font to avoid external loading issues
const bebasNeue = localFont({
  src: "../public/fonts/BebasNeue-Regular.woff2",
  variable: "--font-bebas-neue",
  display: "swap",
})

export const metadata = {
  title: "Euphony - Music Recommendation Player",
  description: "A music player with mood and artist-based recommendations",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${bebasNeue.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

