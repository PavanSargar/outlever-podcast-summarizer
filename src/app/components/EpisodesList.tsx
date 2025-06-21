import PodcastEpisodeCard from '@/components/PodcastEpisodeCard'
import Pagination from './Pagination'
import { PodcastEpisode, PaginationInfo } from '@/types'

interface EpisodesListProps {
  episodes?: PodcastEpisode[]
  pagination?: PaginationInfo
  searchQuery?: string
  onSummarize: (episode: PodcastEpisode) => Promise<void>
  getSummary: (episodeId: string) => string | undefined
  isEpisodeLoading: (episodeId: string) => boolean
  onPageChange: (page: number) => void
  searchLoading: boolean
}

export default function EpisodesList({
  episodes = [],
  pagination,
  searchQuery = '',
  onSummarize,
  getSummary,
  isEpisodeLoading,
  onPageChange,
  searchLoading
}: EpisodesListProps) {
  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Found {pagination?.total?.toLocaleString() || 0} episodes for "{searchQuery}"
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        {episodes?.map((episode) => (
          <PodcastEpisodeCard
            key={episode?.id}
            episode={episode}
            onSummarize={onSummarize}
            existingSummary={getSummary(episode?.id)}
            isLoading={isEpisodeLoading(episode?.id)}
          />
        ))}
      </div>

      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          isLoading={searchLoading}
        />
      )}
    </>
  )
} 