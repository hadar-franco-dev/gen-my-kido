import { Zap, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PromptInputProps {
  prompt: string
  isGenerating: boolean
  error: string | null
  promptSuggestions: string[]
  onPromptChange: (value: string) => void
  onGenerate: () => void
}

export function PromptInput({
  prompt,
  isGenerating,
  error,
  promptSuggestions,
  onPromptChange,
  onGenerate
}: PromptInputProps) {
  return (
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
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[120px] bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
        />

        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onPromptChange(suggestion)}
              className="text-xs bg-gray-800/70 hover:bg-purple-900/50 text-gray-300 hover:text-white py-1 px-3 rounded-full border border-gray-700 hover:border-purple-500 transition-colors"
            >
              {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
            </button>
          ))}
        </div>

        <Button
          onClick={onGenerate}
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
          <p className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
            {error}
          </p>
        )}
      </div>
    </div>
  )
} 