import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import connectDB from '@/lib/mongodb'
import { PodcastSummaryModel } from '@/models'

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { episodeId, title, description, podcastTitle } = await request.json()

    if (!episodeId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingSummary = await PodcastSummaryModel.findOne({
      episode_id: episodeId,
    })

    if (existingSummary) {
      return NextResponse.json({ summary: existingSummary })
    }

    const prompt = `Please provide a comprehensive summary of this podcast episode:

Title: ${title}
Podcast: ${podcastTitle}
Description: ${description}

Please create a well-structured summary that includes:
1. Main topics discussed
2. Key insights and takeaways
3. Important points or quotes
4. Overall theme and conclusion

Keep the summary informative yet concise (300-500 words).`

    const model = genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    })

    const result = await model
    const summaryText = result.text

    if (!summaryText) {
      throw new Error('Failed to generate summary')
    }

    const summary = new PodcastSummaryModel({
      episode_id: episodeId,
      episode_title: title,
      podcast_title: podcastTitle,
      summary: summaryText,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const savedSummary = await summary.save()

    return NextResponse.json({ summary: savedSummary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
} 