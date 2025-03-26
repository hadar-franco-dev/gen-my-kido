"use client"

import { useState } from "react"
import { useImageUpload } from "@/lib/hooks/useImageUpload"
import { ImageUploadArea } from "./ImageUploadArea"
import { PromptInput } from "./PromptInput"
import { GeneratedImage } from "./GeneratedImage"
import { generateImage, generateImageFromImage, fileToDataUrl } from "@/lib/services/imageService"

const PROMPT_SUGGESTIONS = [
  "A futuristic cityscape with neon lights and flying cars",
  "A serene mountain landscape at sunset with a lake reflection",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater scene with colorful coral reefs and exotic fish",
] as string[]

export function ImageGenerator() {
  const { file, preview, handleFile, clearImage } = useImageUpload()
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)

  const generateAIImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to describe the image you want to generate")
      return
    }

    try {
      setIsGenerating(true)
      setError(null)
      setGenerationProgress(0)
      
      // Start progress animation
      const progressInterval = startProgressSimulation()

      let result;
      
      // Handle different generation paths based on whether an image is uploaded
      if (file) {
        // If we have both an image and a prompt, use image-to-image generation
        const imageUrl = preview || await fileToDataUrl(file)
        
        result = await generateImageFromImage({
          prompt,
          imageUrl,
          negativePrompt: ""
        })
      } else {
        // If we only have a prompt, use text-to-image generation
        result = await generateImage({
          prompt,
          negativePrompt: ""
        })
      }

      // Clear the progress simulation
      clearInterval(progressInterval)
      
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl)
        setGenerationProgress(100)
      } else {
        throw new Error('No image URL in response')
      }
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err.message : "Failed to generate image. Please try again.")
      setGenerationProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  // Simulate progress for better user experience during API call
  const startProgressSimulation = () => {
    return setInterval(() => {
      setGenerationProgress(prev => {
        // Gradually increase up to 90%, saving the last 10% for actual completion
        if (prev < 90) {
          return prev + Math.random() * 5
        }
        return prev
      })
    }, 300)
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
            isGenerating={isGenerating}
            progress={generationProgress}
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