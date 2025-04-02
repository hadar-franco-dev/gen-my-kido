"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "../contexts/language-context"

export default function Hero() {
  const { t, language } = useLanguage()

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background image with 30% opacity */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/book-pattern.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      />

      {/* Outer container with padding for overall section positioning */}
      <div className="relative z-10 max-w-7xl mx-auto px-6" style={{ paddingTop: "10vh", paddingBottom: "20vh" }}>
        {/* Inner container with additional margin-top to push content down by 10% */}
        <div className="mx-auto max-w-3xl text-center" style={{ marginTop: "20vh" }}>
          <div className="relative inline-block">
            {/* Cute child image positioned above the title, smaller and offset */}
            <motion.div
              className="absolute"
              style={{
                bottom: "80%",
                left: "30%",
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image src="/images/cute-child.png" alt="Cute child" width={90} height={90} className="object-contain" />
            </motion.div>

            <motion.h1
              className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gradient">{t("hero.title")}</span>
            </motion.h1>
          </div>

          <motion.p
            className="mt-6 text-[1.3rem] leading-8 text-muted-foreground font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.p
            className="mt-3 text-base leading-7 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t("hero.description")}
          </motion.p>
          <motion.div
            className="mt-10 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/upload" className="apple-button">
              {t("hero.cta")}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

