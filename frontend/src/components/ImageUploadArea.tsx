import { Upload } from "lucide-react"
import { useDragAndDrop } from "@/lib/hooks/useDragAndDrop"

interface ImageUploadAreaProps {
  preview: string | null
  onFileAccepted: (file: File) => void
  onError: (error: string) => void
  onClearPreview: () => void
}

export function ImageUploadArea({
  preview,
  onFileAccepted,
  onError,
  onClearPreview
}: ImageUploadAreaProps) {
  const {
    isDragging,
    dropAreaRef,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileChange
  } = useDragAndDrop({ onFileAccepted, onError })

  return (
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
                onClearPreview()
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
  )
} 