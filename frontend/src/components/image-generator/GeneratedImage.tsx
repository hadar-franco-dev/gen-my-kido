import { ImageIcon, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GeneratedImageProps {
  imageUrl: string | null
  isGenerating: boolean
  progress: number
  onDownload: () => void
}

export function GeneratedImage({ imageUrl, isGenerating, progress, onDownload }: GeneratedImageProps) {
  return (
    <div className="backdrop-blur-sm bg-gray-900/40 rounded-2xl border border-gray-700 p-6 h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none"></div>

      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <ImageIcon className="mr-2 h-5 w-5 text-blue-400" />
        <span>Generated Masterpiece</span>
      </h2>

      <div className="flex-1 flex items-center justify-center bg-gray-800/50 rounded-xl p-4 border border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] opacity-5 bg-repeat"></div>

        {isGenerating ? (
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-30 animate-pulse"></div>
              <div className="relative h-full w-full flex items-center justify-center">
                <RefreshCw className="h-16 w-16 text-purple-300 animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Creating your masterpiece...</h3>
            <p className="text-gray-400 mb-4">This may take a few moments</p>
            
            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-gray-500 text-sm">AI is working its magic...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative max-w-full max-h-full">
            <img
              src={imageUrl}
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

      {imageUrl && !isGenerating && (
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-gray-800 hover:text-purple-300"
            onClick={onDownload}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Masterpiece
          </Button>
        </div>
      )}
    </div>
  )
} 