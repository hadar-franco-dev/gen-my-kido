"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "../contexts/language-context"

export default function PortfolioGrid() {
  const { t, language } = useLanguage()

  // Define the two categories
  const categories = [t("portfolio.category1"), t("portfolio.category2")]

  // Define the projects for each category
  const firstExperiencesProjects = [
    {
      id: 1,
      title: "שלום כיתה א׳",
      description: "סיפור על הכנה והתמודדות עם היום הראשון בבית הספר",
      imageUrl: "/placeholder.svg?height=600&width=800",
      category: t("portfolio.category1"),
    },
    {
      id: 2,
      title: "שלום לאח החדש",
      description: "סיפור על המפגש הראשון עם אח חדש במשפחה",
      imageUrl: "/placeholder.svg?height=800&width=600",
      category: t("portfolio.category1"),
    },
    {
      id: 3,
      title: "שלום לחיתול",
      description: "סיפור על תהליך הגמילה מחיתולים",
      imageUrl: "/placeholder.svg?height=600&width=800",
      category: t("portfolio.category1"),
    },
    {
      id: 4,
      title: "שלום לטיסה ראשונה",
      description: "סיפור על החוויה של טיסה ראשונה",
      imageUrl: "/placeholder.svg?height=800&width=600",
      category: t("portfolio.category1"),
    },
  ]

  const generalKnowledgeProjects = [
    {
      id: 5,
      title: "בואו לגלות את עולם הצמחים",
      description: "סיפור חינוכי על עולם הצמחים והטבע",
      imageUrl: "/placeholder.svg?height=600&width=800",
      category: t("portfolio.category2"),
    },
    {
      id: 6,
      title: "בואו לגלות את עולם החיות",
      description: "סיפור חינוכי על חיות ובתי גידול",
      imageUrl: "/placeholder.svg?height=800&width=600",
      category: t("portfolio.category2"),
    },
    {
      id: 7,
      title: "בואו לגלות את עולם האותיות",
      description: "סיפור חינוכי על אותיות ומילים ראשונות",
      imageUrl: "/placeholder.svg?height=600&width=800",
      category: t("portfolio.category2"),
    },
    {
      id: 8,
      title: "בואו לגלות את עולם הדינוזאורים",
      description: "סיפור חינוכי על דינוזאורים ועולם העבר",
      imageUrl: "/placeholder.svg?height=800&width=600",
      category: t("portfolio.category2"),
    },
  ]

  // Combine all projects
  const allProjects = [...firstExperiencesProjects, ...generalKnowledgeProjects]

  const [filter, setFilter] = useState(t("portfolio.category1"))

  const filteredProjects = allProjects.filter((project) => project.category === filter)

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("portfolio.title")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("portfolio.description")}</p>
        </motion.div>

        <div className="flex justify-center space-x-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full text-base font-medium transition-colors ${
                filter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  >
                    <p className="text-white text-center px-4">{project.description}</p>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <Link href="/upload" className="text-primary hover:underline inline-flex items-center">
                    {t("portfolio.viewStory")}
                    <svg
                      className={`w-4 h-4 ${language === "he" ? "mr-2 rotate-180" : "ml-2"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

