import { AlertCircle } from 'lucide-react'

interface ErrorDisplayProps {
  error: string
  onClose: () => void
}

export default function ErrorDisplay({ error, onClose }: ErrorDisplayProps) {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <p className="text-red-700">{error}</p>
      <button
        onClick={onClose}
        className="ml-auto text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </div>
  )
} 