export interface PodcastInfo {
  listennotes_url: string
  id: string
  title_highlighted: string
  title_original: string
  publisher_highlighted: string
  publisher_original: string
  image: string
  thumbnail: string
  genre_ids: number[]
  listen_score: string
  listen_score_global_rank: string
}

export interface ApiPodcastEpisode {
  audio: string
  audio_length_sec: number
  rss: string
  description_highlighted: string
  description_original: string
  title_highlighted: string
  title_original: string
  transcripts_highlighted: string[]
  image: string
  thumbnail: string
  itunes_id: number
  pub_date_ms: number
  id: string
  listennotes_url: string
  explicit_content: boolean
  link: string
  guid_from_rss: string
  podcast: PodcastInfo
}

export interface ApiPagination {
  total: number
  page: number
}

export interface PodcastApiResponse {
  episodes: ApiPodcastEpisode[]
  pagination: ApiPagination
} 