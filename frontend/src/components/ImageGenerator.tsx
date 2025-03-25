"use client"

import { useState } from "react"
import { useImageUpload } from "@/lib/hooks/useImageUpload"
import { ImageUploadArea } from "./ImageUploadArea"
import { PromptInput } from "./PromptInput"
import { GeneratedImage } from "./GeneratedImage"

const PROMPT_SUGGESTIONS = [
  "A futuristic cityscape with neon lights and flying cars",
  "A serene mountain landscape at sunset with a lake reflection",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater scene with colorful coral reefs and exotic fish",
] as string[]

export function ImageGenerator() {
  const { preview, handleFile, clearImage } = useImageUpload()
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
            <ImageUploadArea
              preview={preview}
              onFileAccepted={handleFile}
              onError={setError}
              onClearPreview={clearImage}
            />

            <PromptInput
              prompt={prompt}
              isGenerating={isGenerating}
              error={error}
              promptSuggestions={PROMPT_SUGGESTIONS}
              onPromptChange={setPrompt}
              onGenerate={generateAIImage}
            />
          </div>

          <GeneratedImage
            imageUrl={generatedImage}
            onDownload={downloadImage}
          />
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