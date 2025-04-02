"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "../contexts/language-context"
import Link from "next/link"

export default function BackNavigation() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full border-b">
      <div className="container flex h-14 items-center justify-between">
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          {t("back.home")}
        </Button>
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            MyKidStory.ai
          </Link>
          {/* Small black icon removed */}
        </div>
      </div>
    </div>
  )
}

