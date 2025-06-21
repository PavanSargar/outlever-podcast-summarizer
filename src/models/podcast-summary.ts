import { Schema, model, models, Document } from 'mongoose'

export interface IPodcastSummary extends Document {
  episode_id: string
  episode_title: string
  podcast_title: string
  summary: string
  created_at: Date
  updated_at: Date
}

const PodcastSummarySchema = new Schema<IPodcastSummary>({
  episode_id: { type: String, required: true, unique: true },
  episode_title: { type: String, required: true },
  podcast_title: { type: String, required: true },
  summary: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const PodcastSummaryModel = models.PodcastSummary || model<IPodcastSummary>('PodcastSummary', PodcastSummarySchema) 