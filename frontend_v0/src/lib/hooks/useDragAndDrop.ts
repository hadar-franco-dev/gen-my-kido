import { useState, DragEvent, ChangeEvent, useRef, useCallback } from "react"

interface UseDragAndDropProps {
  onFileAccepted: (file: File) => void
  onError?: (error: string) => void
  acceptedFileTypes?: string[]
  maxSizeInMB?: number
}

export function useDragAndDrop({
  onFileAccepted,
  onError,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeInMB = 5
}: UseDragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const dropAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): boolean => {
    if (!acceptedFileTypes.includes(file.type)) {
      onError?.("File type not supported")
      return false
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
      onError?.(`File size must be less than ${maxSizeInMB}MB`)
      return false
    }

    return true
  }, [acceptedFileTypes, maxSizeInMB, onError])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Check if the dragged items contain files
    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy'
    }
  }, [])

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only count drag enter if it contains files
    if (e.dataTransfer.types.includes('Files')) {
      dragCounter.current += 1
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    // Check if the dropped items contain files
    if (!e.dataTransfer.types.includes('Files')) {
      return
    }

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const file = files[0]
    if (validateFile(file)) {
      onFileAccepted(file)
    }
  }, [validateFile, onFileAccepted])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (validateFile(file)) {
      onFileAccepted(file)
    }
  }, [validateFile, onFileAccepted])

  return {
    isDragging,
    dropAreaRef,
    fileInputRef,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileChange
  }
} 