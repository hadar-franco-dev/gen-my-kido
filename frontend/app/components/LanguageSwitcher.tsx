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
        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
          <Image
            src={language === "he" ? "/images/israel-flag.svg" : "/images/us-flag.svg"}
            alt={language === "he" ? "Hebrew" : "English"}
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("he")}
          className={`flex items-center gap-2 ${language === "he" ? "bg-primary/10" : ""}`}
        >
          <Image src="/images/israel-flag.svg" alt="Hebrew" width={20} height={20} className="rounded-full" />
          {t("language.he")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`flex items-center gap-2 ${language === "en" ? "bg-primary/10" : ""}`}
        >
          <Image src="/images/us-flag.svg" alt="English" width={20} height={20} className="rounded-full" />
          {t("language.en")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

