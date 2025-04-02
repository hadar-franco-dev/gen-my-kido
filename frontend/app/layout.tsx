import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { LanguageProvider } from "./contexts/language-context"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata title
export const metadata = {
  title: "MyKidStory.ai",
  description: "סיפורים לילדים",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body 
        className={`${inter.className} min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'