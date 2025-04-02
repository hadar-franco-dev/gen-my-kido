"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useLanguage } from "../contexts/language-context"
import LanguageSwitcher from "./LanguageSwitcher"
import { usePathname } from "next/navigation"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const pathname = usePathname()

  // Only show language switcher on the homepage
  const isHomePage = pathname === "/"

  useEffect(() => setMounted(true), [])

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">MyKidStory.ai</span>
          <img
            className="h-8 w-auto"
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creative-SW6QDQbcVuwPgb6a2CYtYmRbsJa4k1.png"
            alt="MyKidStory.ai Logo"
          />
        </Link>
        {isHomePage && (
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </motion.header>
  )
}

