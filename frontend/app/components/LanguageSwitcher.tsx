"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/language-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (lang: "he" | "en") => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-8 h-8 overflow-hidden rounded-full border border-border/50 hover:border-border"
        >
          <Image
            src={language === "he" ? "/images/israel-flag.svg" : "/images/us-flag.svg"}
            alt={language === "he" ? "Hebrew" : "English"}
            fill
            className="object-cover"
            priority
            sizes="32px"
          />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("he")}
          className={`flex items-center gap-3 ${language === "he" ? "bg-primary/10" : ""}`}
        >
          <div className="relative w-6 h-6 overflow-hidden rounded-full border border-border/50">
            <Image 
              src="/images/israel-flag.svg" 
              alt="Hebrew" 
              fill
              className="object-cover" 
              sizes="24px"
              priority
            />
          </div>
          <span className="font-medium">{t("language.he")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`flex items-center gap-3 ${language === "en" ? "bg-primary/10" : ""}`}
        >
          <div className="relative w-6 h-6 overflow-hidden rounded-full border border-border/50">
            <Image 
              src="/images/us-flag.svg" 
              alt="English" 
              fill
              className="object-cover" 
              sizes="24px"
              priority
            />
          </div>
          <span className="font-medium">{t("language.en")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

