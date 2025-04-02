"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Book, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Define the two categories
const categories = ["חוויות ראשונות", "ידע כללי"]

// Define the projects for each category
const firstExperiencesProjects = [
  {
    id: 1,
    title: "שלום כיתה א׳",
    description: "סיפור על הכנה והתמודדות עם היום הראשון בבית הספר",
    imageUrl: "/placeholder.svg?height=600&width=800",
    category: "חוויות ראשונות",
  },
  {
    id: 2,
    title: "שלום לאח החדש",
    description: "סיפור על המפגש הראשון עם אח חדש במשפחה",
    imageUrl: "/placeholder.svg?height=800&width=600",
    category: "חוויות ראשונות",
  },
  {
    id: 3,
    title: "שלום לחיתול",
    description: "סיפור על תהליך הגמילה מחיתולים",
    imageUrl: "/placeholder.svg?height=600&width=800",
    category: "חוויות ראשונות",
  },
  {
    id: 4,
    title: "שלום לטיסה ראשונה",
    description: "סיפור על החוויה של טיסה ראשונה",
    imageUrl: "/placeholder.svg?height=800&width=600",
    category: "חוויות ראשונות",
  },
]

const generalKnowledgeProjects = [
  {
    id: 5,
    title: "בואו לגלות את עולם הצמחים",
    description: "סיפור חינוכי על עולם הצמחים והטבע",
    imageUrl: "/placeholder.svg?height=600&width=800",
    category: "ידע כללי",
  },
  {
    id: 6,
    title: "בואו לגלות את עולם החיות",
    description: "סיפור חינוכי על חיות ובתי גידול",
    imageUrl: "/placeholder.svg?height=800&width=600",
    category: "ידע כללי",
  },
  {
    id: 7,
    title: "בואו לגלות את עולם האותיות",
    description: "סיפור חינוכי על אותיות ומילים ראשונות",
    imageUrl: "/placeholder.svg?height=600&width=800",
    category: "ידע כללי",
  },
  {
    id: 8,
    title: "בואו לגלות את עולם הדינוזאורים",
    description: "סיפור חינוכי על דינוזאורים ועולם העבר",
    imageUrl: "/placeholder.svg?height=800&width=600",
    category: "ידע כללי",
  },
]

// Combine all projects
const allProjects = [...firstExperiencesProjects, ...generalKnowledgeProjects]

export default function CategoriesPage() {
  const [filter, setFilter] = useState("חוויות ראשונות")
  const router = useRouter()

  const filteredProjects = allProjects.filter((project) => project.category === filter)

  const handleProjectClick = (projectId: number) => {
    // Navigate to the cover selection page
    router.push("/cover")
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8 border-b pb-4"
      >
        <div className="flex items-center">
          <Book className="w-8 h-8 text-primary ml-2" />
          <h2 className="text-2xl font-bold">MyKidStory.ai</h2>
        </div>
        <Link href="/upload" className="flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowRight className="w-5 h-5 ml-1 rotate-180" />
          <span>חזרה לעמוד הקודם</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold mb-6">קטגוריות</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          בחרו את הקטגוריה המתאימה לסיפור שלכם. אנו מציעים מגוון סיפורים בנושאים שונים המותאמים לילדים.
        </p>
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

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleProjectClick(project.id)}
            className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10 cursor-pointer"
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
              <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

