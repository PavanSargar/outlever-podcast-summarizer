import { useState, useCallback } from 'react'
import { PodcastEpisode, PaginationInfo, PodcastApiResponse } from '@/types'
import { transformApiEpisode, transformApiPagination } from '@/lib/utils'

interface UsePodcastsReturn {
  episodes: PodcastEpisode[]
  loading: boolean
  searchLoading: boolean
  error: string | null
  pagination: PaginationInfo
  searchQuery: string
  fetchPodcasts: (query?: string, page?: number) => Promise<void>
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
}

export function usePodcasts(initialQuery: string = 'technology'): UsePodcastsReturn {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    total: 0,
    hasPrevious: false,
    hasNext: false,
  })

  const fetchPodcasts = useCallback(async (query: string = searchQuery, page: number = 1) => {
    const isInitialLoad = page === 1 && query === searchQuery
    const isSearching = query !== searchQuery
    
    if (isInitialLoad) {
      setLoading(true)
    } else {
      setSearchLoading(true)
    }
    
    setError(null)

    try {
      const apiPage = page - 1
      const response = await fetch(`/api/podcasts?q=${encodeURIComponent(query)}&page=${apiPage}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: PodcastApiResponse = await response.json()
      
      // Transforming the API response
      const transformedEpisodes = data.episodes?.map(transformApiEpisode) || []
      const transformedPagination = transformApiPagination(data.pagination)
      
      setEpisodes(transformedEpisodes)
      setPagination(transformedPagination)
      
      if (isSearching) {
        setSearchQuery(query)
      }
    } catch (err) {
      console.error('Error fetching podcasts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch podcasts')
      setEpisodes([])
      setPagination({
        page: 1,
        total: 0,
        hasPrevious: false,
        hasNext: false,
      })
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }, [searchQuery])

  return {
    episodes,
    loading,
    searchLoading,
    error,
    pagination,
    searchQuery,
    fetchPodcasts,
    setError,
    setSearchQuery,
  }
} 