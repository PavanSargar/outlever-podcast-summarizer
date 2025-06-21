import { useState, useCallback } from 'react'
import { PodcastEpisode, PodcastSummary } from '@/types'

interface UseSummariesReturn {
  episodeSummaries: Map<string, string>
  loadingEpisodes: Set<string>
  fetchExistingSummaries: (episodes: PodcastEpisode[]) => Promise<void>
  generateSummary: (episode: PodcastEpisode) => Promise<PodcastSummary>
  getSummary: (episodeId: string) => string | undefined
  isEpisodeLoading: (episodeId: string) => boolean
}

export function useSummaries(): UseSummariesReturn {
  const [episodeSummaries, setEpisodeSummaries] = useState<Map<string, string>>(new Map())
  const [loadingEpisodes, setLoadingEpisodes] = useState<Set<string>>(new Set())

  const fetchExistingSummaries = useCallback(async (episodes: PodcastEpisode[]) => {
    const summaryPromises = episodes.map(async (episode: PodcastEpisode) => {
      try {
        const summaryResponse = await fetch(`/api/summaries/${episode.id}`)
        const summaryData = await summaryResponse.json()
        return { episodeId: episode.id, summary: summaryData.summary }
      } catch (error) {
        console.error(`Failed to fetch summary for episode ${episode.id}:`, error)
        return { episodeId: episode.id, summary: null }
      }
    })
    
    const summaryResults = await Promise.all(summaryPromises)
    const newSummaries = new Map()
    summaryResults.forEach(({ episodeId, summary }) => {
      if (summary) {
        newSummaries.set(episodeId, summary.summary)
      }
    })
    setEpisodeSummaries(newSummaries)
  }, [])

  const generateSummary = useCallback(async (episode: PodcastEpisode): Promise<PodcastSummary> => {
    try {
      setLoadingEpisodes(prev => new Set(prev).add(episode.id))
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          episodeId: episode.id,
          title: episode.title,
          description: episode.description,
          podcastTitle: episode.podcast_title,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary')
      }
      
      // Updating local state with new summary
      setEpisodeSummaries(prev => new Map(prev).set(episode.id, data.summary.summary))
      
      return data.summary
      
    } catch (error) {
      console.error('Error generating summary:', error)
      throw error
    } finally {
      setLoadingEpisodes(prev => {
        const newSet = new Set(prev)
        newSet.delete(episode.id)
        return newSet
      })
    }
  }, [])

  const getSummary = useCallback((episodeId: string) => {
    return episodeSummaries.get(episodeId)
  }, [episodeSummaries])

  const isEpisodeLoading = useCallback((episodeId: string) => {
    return loadingEpisodes.has(episodeId)
  }, [loadingEpisodes])

  return {
    episodeSummaries,
    loadingEpisodes,
    fetchExistingSummaries,
    generateSummary,
    getSummary,
    isEpisodeLoading,
  }
} 