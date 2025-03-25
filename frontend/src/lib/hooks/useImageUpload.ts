import { useState } from "react"

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setPreview(null)
    setFile(null)
  }

  return {
    file,
    preview,
    handleFile,
    clearImage
  }
} 