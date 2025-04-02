"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Page {
  content: React.ReactNode
  background?: string
  text?: string
  title?: string
  isImage?: boolean
}

interface FlipBookProps {
  pages: Page[]
  width?: number
  height?: number
  showCover?: boolean
  editable?: boolean
}

export default function FlipBook({
  pages: initialPages = [],
  width = 800,
  height = 500,
  showCover = true,
  editable = true,
}: FlipBookProps) {
  // Initialize with empty array if initialPages is undefined
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [pages, setPages] = useState<Page[]>(initialPages || [])
  const [editMode, setEditMode] = useState(false)
  const [editingText, setEditingText] = useState<string>("")
  const [editingTitle, setEditingTitle] = useState<string>("")
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null)

  // Safely get total pages
  const totalPages = pages?.length || 0
  const bookRef = useRef<HTMLDivElement>(null)

  // Calculate total spreads (pairs of pages)
  const totalSpreads = Math.ceil(totalPages / 2)

  // Update pages state if initialPages prop changes
  useEffect(() => {
    if (initialPages && initialPages.length > 0) {
      setPages(initialPages)
    }
  }, [initialPages])

  const nextPage = () => {
    if (currentPage < totalPages - 2 && !isFlipping) {
      setIsFlipping(true)
      setCurrentPage(currentPage + 2)
      setTimeout(() => setIsFlipping(false), 500)
    }
  }

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      setCurrentPage(Math.max(currentPage - 2, 0))
      setTimeout(() => setIsFlipping(false), 500)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        prevPage()
      } else if (e.key === "ArrowLeft") {
        nextPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, isFlipping])

  // Get current spread (two pages) - with safety checks
  const getCurrentSpread = () => {
    if (!pages || pages.length === 0) {
      return { leftPage: null, rightPage: null }
    }

    const leftPage = currentPage < totalPages ? pages[currentPage] : null
    const rightPage = currentPage + 1 < totalPages ? pages[currentPage + 1] : null
    return { leftPage, rightPage }
  }

  const { leftPage, rightPage } = getCurrentSpread()

  // Extract text and title from a page
  const extractPageContent = (pageIndex: number) => {
    if (!pages || pageIndex >= pages.length) return { text: "", title: "" }

    const page = pages[pageIndex]
    if (!page || page.isImage) return { text: "", title: "" }

    // Try to extract title and text from the page content
    let title = ""
    let text = ""

    if (page.title) {
      title = page.title
    } else if (
      typeof page.content === "object" &&
      page.content !== null &&
      "props" in page.content &&
      page.content.props.children &&
      Array.isArray(page.content.props.children)
    ) {
      // Try to find the h2 element which contains the title
      const titleElement = page.content.props.children.find(
        (child: any) => child && typeof child === "object" && "type" in child && child.type === "h2",
      )
      if (titleElement && "props" in titleElement && titleElement.props.children) {
        title = titleElement.props.children
      }
    }

    // Use the stored text if available, otherwise try to extract it
    if (page.text) {
      text = page.text
    }

    return { text, title }
  }

  // Start editing a page
  const startEditing = (pageIndex: number) => {
    if (!editable || !pages || pageIndex >= pages.length) return

    const { text, title } = extractPageContent(pageIndex)

    setEditingPageIndex(pageIndex)
    setEditingText(text)
    setEditingTitle(title)
    setEditMode(true)
  }

  // Save edited text
  const saveEdit = () => {
    if (editingPageIndex === null || !pages || editingPageIndex >= pages.length) return

    const updatedPages = [...pages]
    const pageToUpdate = { ...updatedPages[editingPageIndex] }

    // Only update if it's not an image page
    if (!pageToUpdate.isImage) {
      // Store the edited text and title
      pageToUpdate.text = editingText
      pageToUpdate.title = editingTitle

      // Create new content with the updated text and title
      pageToUpdate.content = (
        <div className="text-right p-6">
          <h2 className="text-2xl font-bold mb-4">{editingTitle}</h2>
          <div className="whitespace-pre-wrap">{editingText}</div>
        </div>
      )

      updatedPages[editingPageIndex] = pageToUpdate
      setPages(updatedPages)
    }

    setEditMode(false)
    setEditingPageIndex(null)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditMode(false)
    setEditingPageIndex(null)
  }

  // If no pages, show a placeholder
  if (!pages || pages.length === 0) {
    return (
      <div
        className="flex items-center justify-center shadow-lg rounded-lg"
        style={{ width: `${width}px`, height: `${height}px`, background: "#f8f9fa" }}
      >
        <p className="text-gray-400">אין תוכן להצגה</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        ref={bookRef}
        className="relative shadow-2xl rounded-lg overflow-hidden flex"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          perspective: "1500px",
        }}
      >
        {/* Book spread (two pages side by side) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`spread-${currentPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex w-full h-full"
          >
            {/* Left Page */}
            <div
              className="w-1/2 h-full flex items-center justify-center p-4 rounded-l-lg border-r border-gray-200 relative"
              style={{
                background: leftPage?.background || "white",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
              }}
            >
              <div className="w-full h-full flex items-center justify-center">{leftPage?.content}</div>
              {editable && leftPage && !leftPage.isImage && currentPage > 1 && (
                <button
                  onClick={() => startEditing(currentPage)}
                  className="absolute bottom-4 right-4 p-2 bg-primary/80 text-white rounded-full hover:bg-primary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Page */}
            {rightPage && (
              <div
                className="w-1/2 h-full flex items-center justify-center p-4 rounded-r-lg relative"
                style={{
                  background: rightPage?.background || "white",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">{rightPage?.content}</div>
                {editable && !rightPage.isImage && currentPage + 1 < totalPages - 1 && (
                  <button
                    onClick={() => startEditing(currentPage + 1)}
                    className="absolute bottom-4 right-4 p-2 bg-primary/80 text-white rounded-full hover:bg-primary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Empty right page if we're at the last page and it's odd */}
            {!rightPage && (
              <div
                className="w-1/2 h-full flex items-center justify-center p-4 rounded-r-lg"
                style={{
                  background: "white",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-300">סוף הספר</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Page turning controls */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className={`pointer-events-auto p-3 bg-white/80 rounded-full shadow-lg m-4 transition-opacity ${
              currentPage === 0 || isFlipping ? "opacity-30 cursor-not-allowed" : "opacity-80 hover:opacity-100"
            }`}
            aria-label="Previous page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages - 2 || isFlipping}
            className={`pointer-events-auto p-3 bg-white/80 rounded-full shadow-lg m-4 transition-opacity ${
              currentPage >= totalPages - 2 || isFlipping
                ? "opacity-30 cursor-not-allowed"
                : "opacity-80 hover:opacity-100"
            }`}
            aria-label="Next page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Page indicator */}
      <div className="mt-4 text-center">
        <span className="text-sm text-muted-foreground">
          עמודים {currentPage + 1}-{Math.min(currentPage + 2, totalPages)} מתוך {totalPages}
        </span>
      </div>

      {/* Edit modal */}
      {editMode && editingPageIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4">עריכת עמוד</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-right">כותרת</label>
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-right">תוכן</label>
              <Textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="min-h-[300px] text-right p-4"
                dir="rtl"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEdit}>
                ביטול
              </Button>
              <Button onClick={saveEdit}>שמירה</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

