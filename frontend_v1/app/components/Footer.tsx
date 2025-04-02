"use client"

import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="flex items-start justify-center mb-6 text-center">
          <div className="relative w-5 h-5 ml-2 flex-shrink-0 mt-0.5">
            <Image
              src="/images/security-shield.png"
              alt="Security Shield"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <p className="text-sm leading-6 text-muted-foreground max-w-3xl text-right">
            שירות MyKidStory.ai הוא פרטי ומאובטח. התמונות והמידע שלכם נשארים בטוחים ומוגנים.
          </p>
        </div>
        <p className="text-center text-sm leading-5 text-muted-foreground">כל הזכויות שמורות ל-MyKidStory.ai</p>
      </div>
    </footer>
  )
}

