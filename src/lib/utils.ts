import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApiPodcastEpisode, ApiPagination, PodcastEpisode, PaginationInfo } from '@/types'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}


// Transform functions
export function transformApiEpisode(apiEpisode: ApiPodcastEpisode): PodcastEpisode {
  return {
    id: apiEpisode.id,
    title: apiEpisode.title_original,
    description: apiEpisode.description_original,
    podcast_title: apiEpisode.podcast.title_original,
    image: apiEpisode.image,
    thumbnail: apiEpisode.thumbnail,
    audio: apiEpisode.audio,
    audio_length_sec: apiEpisode.audio_length_sec,
    pub_date_ms: apiEpisode.pub_date_ms,
    listennotes_url: apiEpisode.listennotes_url,
    explicit_content: apiEpisode.explicit_content,
    link: apiEpisode.link,
    podcast: {
      id: apiEpisode.podcast.id,
      title: apiEpisode.podcast.title_original,
      publisher: apiEpisode.podcast.publisher_original,
      image: apiEpisode.podcast.image,
      thumbnail: apiEpisode.podcast.thumbnail,
    }
  }
}

export function transformApiPagination(apiPagination: ApiPagination): PaginationInfo {
  return {
    page: apiPagination.page + 1,
    total: apiPagination.total,
    hasPrevious: apiPagination.page > 0,
    hasNext: apiPagination.page * 10 + 10 < apiPagination.total, // Assuming 10 items per page
  }
} 