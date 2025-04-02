"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X, FileText, Book, ArrowRight, User, ImageIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useLanguage } from "../contexts/language-context"

export default function UploadPage() {
  const { t, language } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [gender, setGender] = useState<string>("boy")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    setUploadedFiles((prev) => [...prev, ...imageFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Example photos with their labels and status
  const photoExamples = [
    {
      src: "/placeholder.svg?height=150&width=150&text=Covered+Face",
      label: t("upload.faceCovered"),
      isValid: false,
    },
    {
      src: "/placeholder.svg?height=150&width=150&text=Tilted+Head",
      label: t("upload.headTilted"),
      isValid: false,
    },
    {
      src: "/placeholder.svg?height=150&width=150&text=Multiple+People",
      label: t("upload.multipleFigures"),
      isValid: false,
    },
    {
      src: "/placeholder.svg?height=150&width=150&text=Clear+Photo",
      label: t("upload.clearPhoto"),
      isValid: true,
    },
  ]

  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8 border-b pb-4"
      >
        <div className="flex items-center">
          <Book className={`w-8 h-8 text-primary ${language === "he" ? "ml-2" : "mr-2"}`} />
          <h2 className="text-2xl font-bold">MyKidStory.ai</h2>
        </div>
        <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowRight className={`w-5 h-5 ${language === "he" ? "ml-1 rotate-180" : "mr-1"}`} />
          <span>{t("back.home")}</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        {/* Child information section with examples and drag & drop included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 max-w-xl mx-auto"
        >
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <User className={`w-5 h-5 text-primary ${language === "he" ? "ml-2" : "mr-2"}`} />
              <h3 className="text-xl font-bold">{t("upload.title")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="childName" className={`block mb-2 ${language === "he" ? "text-right" : "text-left"}`}>
                  {t("upload.childName")}
                </Label>
                <Input
                  id="childName"
                  placeholder={t("upload.childName")}
                  className={language === "he" ? "text-right" : "text-left"}
                  maxLength={10}
                />
              </div>
              <div>
                <Label htmlFor="childAge" className={`block mb-2 ${language === "he" ? "text-right" : "text-left"}`}>
                  {t("upload.childAge")} {t("upload.ageRange")}
                </Label>
                <Input
                  id="childAge"
                  type="number"
                  min="0"
                  max="14"
                  placeholder={t("upload.childAge")}
                  className={language === "he" ? "text-right" : "text-left"}
                />
              </div>
            </div>

            {/* Gender toggle */}
            <div className="mb-6">
              <div className="text-center mb-2">
                <Label>{t("upload.gender")}</Label>
              </div>
              <div className="flex justify-center">
                <div className="bg-background rounded-full p-1 border border-input inline-flex">
                  <button
                    className={`px-6 py-2 rounded-full transition-colors ${
                      gender === "boy" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => setGender("boy")}
                  >
                    {t("upload.boy")}
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full transition-colors ${
                      gender === "girl" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => setGender("girl")}
                  >
                    {t("upload.girl")}
                  </button>
                </div>
              </div>
            </div>

            {/* Image examples section now inside the child info card */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center justify-center mb-4">
                <ImageIcon className={`w-5 h-5 text-primary ${language === "he" ? "ml-2" : "mr-2"}`} />
                <h3 className="text-xl font-bold">{t("upload.photoTitle")}</h3>
              </div>

              {/* Updated photo examples to match the provided image */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {photoExamples.map((example, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative">
                      {/* Circular photo with gray border */}
                      <div
                        className={`w-24 h-24 rounded-full overflow-hidden border-4 ${example.isValid ? "border-green-500" : "border-gray-300"} relative`}
                      >
                        <img
                          src={example.src || "/placeholder.svg"}
                          alt={example.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Status indicator (X or check mark) */}
                      <div
                        className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${example.isValid ? "bg-green-500" : "bg-red-500"}`}
                      >
                        {example.isValid ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <X className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                    {/* Label below the photo */}
                    <p className="text-xs text-center mt-2 max-w-[80px]">{example.label}</p>
                  </div>
                ))}
              </div>

              {/* Drag & drop area now inside the child info card */}
              <div
                className={`border-2 border-dashed rounded-full mx-auto flex flex-col items-center justify-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300"
                }`}
                style={{ width: "300px", height: "150px" }} /* Slightly smaller elliptical dimensions */
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <h3 className="text-base font-medium mb-1 text-center px-4">{t("upload.dragDrop")}</h3>
                <p className="text-xs text-muted-foreground mb-2 text-center px-4">{t("upload.orClick")}</p>
                <Button variant="outline" className="rounded-full" size="sm">
                  {t("upload.choosePhotos")}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blue button - Updated to link to categories page */}
        <div className="text-center mt-8">
          <Link href="/categories">
            <button className="apple-button inline-flex items-center">{t("upload.continue")}</button>
          </Link>
        </div>

        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <h3 className="text-lg font-medium mb-4">
              {t("upload.uploadedPhotos")} ({uploadedFiles.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0 relative">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-6 h-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="p-3 text-sm truncate">{file.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button className="mr-2">
                <FileText className="w-4 h-4 mr-2" />
                {t("upload.createStory")}
              </Button>
              <Button variant="outline" onClick={() => setUploadedFiles([])}>
                {t("upload.clearAll")}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

