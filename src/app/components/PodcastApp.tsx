'use client'

import { useState, useEffect } from 'react'
import { PodcastSummary, PodcastEpisode } from '@/types'
import SummaryModal from '@/components/SummaryModal'
import { usePodcasts } from '@/lib/hooks/use-podcasts'
import { useSummaries } from '@/lib/hooks/use-summaries'

import Header from './Header'
import ErrorDisplay from './ErrorDisplay'
import LoadingState from './LoadingState'
import EpisodesList from './EpisodesList'
import NoResults from './NoResults'

export default function PodcastApp() {
  const {
    episodes = [],
    loading = false,
    searchLoading = false,
    error = null,
    pagination = { page: 1, total: 0, hasPrevious: false, hasNext: false },
    searchQuery = '',
    fetchPodcasts,
    setError,
    setSearchQuery,
  } = usePodcasts('technology')

  const {
    fetchExistingSummaries,
    generateSummary,
    getSummary,
    isEpisodeLoading,
  } = useSummaries()
  
  const [summaryModal, setSummaryModal] = useState<{
    isOpen: boolean
    summary: PodcastSummary | null
  }>({
    isOpen: false,
    summary: null,
  })

  const handleSummarize = async (episode: PodcastEpisode) => {
    if (!episode?.id) return;
    
    const existingSummary = getSummary(episode.id)
    
    if (existingSummary) {
      // Show existing summary
      const summaryObj: PodcastSummary = {
        episode_id: episode.id,
        episode_title: episode.title || '',
        podcast_title: episode.podcast_title || '',
        summary: existingSummary,
        created_at: new Date(),
        updated_at: new Date(),
      }
      setSummaryModal({ isOpen: true, summary: summaryObj })
      return
    }
    
    try {
      const summary = await generateSummary(episode)
      setSummaryModal({ isOpen: true, summary })
    } catch (error) {
      console.error('Error generating summary:', error)
      setError?.(error instanceof Error ? error.message : 'Failed to generate summary')
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery?.(query)
    fetchPodcasts?.(query, 1)
  }

  const handlePageChange = (newPage: number) => {
    fetchPodcasts?.(searchQuery, newPage)
  }

  const handleRetrySearch = () => {
    handleSearch('technology')
  }

  // Fetch existing summaries when episodes change
  useEffect(() => {
    if (episodes?.length > 0) {
      fetchExistingSummaries?.(episodes)
    }
  }, [episodes, fetchExistingSummaries])

  useEffect(() => {
    fetchPodcasts?.()
  }, [fetchPodcasts])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header 
          onSearch={handleSearch}
          isLoading={searchLoading}
          initialQuery={searchQuery}
        />

        {error && (
          <ErrorDisplay 
            error={error}
            onClose={() => setError?.(null)}
          />
        )}

        {loading && <LoadingState />}

        {!loading && (episodes?.length || 0) > 0 && (
          <EpisodesList
            episodes={episodes}
            pagination={pagination}
            searchQuery={searchQuery}
            onSummarize={handleSummarize}
            getSummary={getSummary}
            isEpisodeLoading={isEpisodeLoading}
            onPageChange={handlePageChange}
            searchLoading={searchLoading}
          />
        )}

        {!loading && (episodes?.length || 0) === 0 && !error && (
          <NoResults
            searchQuery={searchQuery}
            onRetry={handleRetrySearch}
          />
        )}
      </div>

      <SummaryModal
        isOpen={summaryModal.isOpen}
        onClose={() => setSummaryModal({ isOpen: false, summary: null })}
        summary={summaryModal.summary}
      />
    </main>
  )
} 