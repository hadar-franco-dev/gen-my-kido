import { useState, useRef, useEffect } from "react"

interface UseDragAndDropProps {
  onFileAccepted: (file: File) => void
  onError: (error: string) => void
}

export function useDragAndDrop({ onFileAccepted, onError }: UseDragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dropAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropAreaRef.current && !dropAreaRef.current.contains(e.target as Node)) {
        setIsDragging(false)
      }
    }

    document.addEventListener("mouseup", handleOutsideClick)
    return () => document.removeEventListener("mouseup", handleOutsideClick)
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("image/")) {
        onFileAccepted(droppedFile)
      } else {
        onError("Please upload an image file")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileAccepted(e.target.files[0])
    }
  }

  return {
    isDragging,
    dropAreaRef,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileChange
  }
} 