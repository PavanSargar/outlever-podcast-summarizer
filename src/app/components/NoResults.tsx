import { RefreshCw } from 'lucide-react'

interface NoResultsProps {
  searchQuery?: string
  onRetry: () => void
}

export default function NoResults({ searchQuery = '', onRetry }: NoResultsProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-600 mb-4">No podcasts found for "{searchQuery}"</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try searching for "technology"
      </button>
    </div>
  )
} 