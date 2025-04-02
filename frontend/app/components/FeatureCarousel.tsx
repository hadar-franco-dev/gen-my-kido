"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import { useLanguage } from "../contexts/language-context"

export default function FeatureCarousel() {
  const { t } = useLanguage()

  const features = [
    {
      title: t("features.feature1.title"),
      description: t("features.feature1.description"),
      icon: "🎓",
    },
    {
      title: t("features.feature2.title"),
      description: t("features.feature2.description"),
      icon: "🎨",
    },
    {
      title: t("features.feature3.title"),
      description: t("features.feature3.description"),
      icon: "📱",
    },
  ]

  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  const handleDragEnd = () => {
    const currentX = x.get()
    if (currentX > 0) {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } })
    } else if (currentX < -width) {
      controls.start({ x: -width, transition: { type: "spring", stiffness: 300, damping: 30 } })
    }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t("features.title")}</h2>
        <motion.div ref={carousel} className="cursor-grab overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            whileTap={{ cursor: "grabbing" }}
            animate={controls}
            style={{ x }}
            onDragEnd={handleDragEnd}
            className="flex"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] h-[320px] p-8 m-4 bg-background rounded-3xl shadow-lg flex flex-col justify-start hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10 text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="text-6xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  {feature.description && <p className="text-muted-foreground text-sm">{feature.description}</p>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

