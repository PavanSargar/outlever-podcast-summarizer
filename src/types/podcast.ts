export interface PodcastEpisode {
  id: string
  title: string
  description: string
  podcast_title: string
  image: string
  thumbnail: string
  audio: string
  audio_length_sec: number
  pub_date_ms: number
  listennotes_url: string
  explicit_content: boolean
  link: string
  podcast: {
    id: string
    title: string
    publisher: string
    image: string
    thumbnail: string
  }
}

export interface PaginationInfo {
  page: number
  total: number
  hasPrevious: boolean
  hasNext: boolean
} 