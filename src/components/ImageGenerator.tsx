"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, ImageIcon, Sparkles, Zap, RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function ImageGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [promptSuggestions] = useState([
    "A futuristic cityscape with neon lights and flying cars",
    "A serene mountain landscape at sunset with a lake reflection",
    "A magical forest with glowing plants and mythical creatures",
    "An underwater scene with colorful coral reefs and exotic fish",
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

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
        handleFile(droppedFile)
      } else {
        setError("Please upload an image file")
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
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setFile(file)
    setError(null)

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const generateAIImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    try {
      setIsGenerating(true)
      setError(null)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      } else {
        throw new Error('No image URL in response')
      }
    } catch (err) {
      console.error("Error generating image:", err)
      setError("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return

    const link = document.createElement("a")
    link.href = generatedImage
    link.download = "ai-generated-image.png"
    link.click()
  }

  const handlePromptSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5 bg-repeat"></div>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 inline-block">
            AI Image Generator
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with our cutting-edge AI image generation technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div
              ref={dropAreaRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                isDragging
                  ? "bg-purple-900/30 border-2 border-purple-400 shadow-lg shadow-purple-500/20"
                  : "bg-gray-900/40 border border-gray-700 hover:border-purple-500/50"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

              <div className="p-8 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto max-h-64 object-contain rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreview(null)
                        setFile(null)
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500/80 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-30 animate-pulse"></div>
                      <div className="relative bg-gray-800/80 rounded-full p-5 backdrop-blur-sm border border-gray-700">
                        <Upload className="h-10 w-10 text-purple-300" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mt-6 text-white">Drop your image here</h3>
                    <p className="text-gray-400 mt-2 max-w-xs">Drag and drop an image, or click to browse</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="backdrop-blur-sm bg-gray-900/40 rounded-2xl border border-gray-700 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>

              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                <span>Create with AI</span>
              </h2>

              <div className="space-y-4">
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                />

                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptSuggestionClick(suggestion)}
                      className="text-xs bg-gray-800/70 hover:bg-purple-900/50 text-gray-300 hover:text-white py-1 px-3 rounded-full border border-gray-700 hover:border-purple-500 transition-colors"
                    >
                      {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={generateAIImage}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Image
                    </span>
                  )}
                </Button>

                {error && (
                  <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="backdrop-blur-sm bg-gray-900/40 rounded-2xl border border-gray-700 p-6 h-full flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none"></div>

              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <ImageIcon className="mr-2 h-5 w-5 text-blue-400" />
                <span>Generated Masterpiece</span>
              </h2>

              <div className="flex-1 flex items-center justify-center bg-gray-800/50 rounded-xl p-4 border border-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] opacity-5 bg-repeat"></div>

                {generatedImage ? (
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={generatedImage}
                      alt="AI Generated"
                      className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"></div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-20"></div>
                      <div className="relative flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    </div>
                    <p className="text-lg">Your AI creation will appear here</p>
                    <p className="text-sm text-gray-500 mt-2">Enter a prompt and click generate</p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-gray-800 hover:text-purple-300"
                    onClick={downloadImage}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Masterpiece
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Powered by advanced AI image generation technology</p>
          <div className="mt-2 flex justify-center space-x-2">
            <span className="inline-block h-1 w-1 rounded-full bg-purple-500"></span>
            <span className="inline-block h-1 w-1 rounded-full bg-blue-500"></span>
            <span className="inline-block h-1 w-1 rounded-full bg-pink-500"></span>
          </div>
        </div>
      </main>
    </div>
  )
} 