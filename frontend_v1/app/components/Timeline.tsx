"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "../contexts/language-context"

export default function Timeline() {
  const { t, language } = useLanguage()

  const steps = [
    {
      number: "1",
      title: t("timeline.step1.title"),
      description: t("timeline.step1.description"),
      imageUrl: "/placeholder.svg?height=200&width=200&text=Upload+Photo",
    },
    {
      number: "2",
      title: t("timeline.step2.title"),
      description: t("timeline.step2.description"),
      imageUrl: "/placeholder.svg?height=200&width=200&text=Choose+Story",
    },
    {
      number: "3",
      title: t("timeline.step3.title"),
      description: t("timeline.step3.description"),
      imageUrl: "/placeholder.svg?height=200&width=200&text=Final+Story",
    },
  ]

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("timeline.title")}</h2>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center">
              {/* Left column - Image */}
              <div className="col-start-1 col-end-2 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative w-32 h-32 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center"
                >
                  <Image
                    src={step.imageUrl || "/placeholder.svg"}
                    alt={step.title}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </motion.div>
              </div>

              {/* Middle column - Timeline dot */}
              <div className="col-start-2 col-end-3 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.1 }}
                  className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                >
                  <div className="w-4 h-4 bg-background rounded-full"></div>
                </motion.div>
              </div>

              {/* Right column - Step description */}
              <div className="col-start-3 col-end-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
                  className="p-6 bg-background rounded-lg shadow-md border border-primary/10"
                >
                  <div className="flex items-start mb-3">
                    <span className={`text-4xl font-black text-primary ${language === "he" ? "ml-6" : "mr-6"}`}>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

