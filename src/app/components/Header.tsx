interface HeaderProps {
  onSearch: (query: string) => void
  isLoading: boolean
  initialQuery?: string
}

import SearchBar from '@/components/SearchBar'

export default function Header({ onSearch, isLoading, initialQuery }: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        🎵 Outlever
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        AI-Powered Podcast Summarizer
      </p>
      <SearchBar 
        onSearch={onSearch}
        isLoading={isLoading}
        initialQuery={initialQuery || ''}
      />
    </div>
  )
} 