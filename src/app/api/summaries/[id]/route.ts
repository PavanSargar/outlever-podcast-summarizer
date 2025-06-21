import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { PodcastSummaryModel } from '@/models'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    
    const summary = await PodcastSummaryModel.findOne({
      episode_id: id,
    })

    if (!summary) {
      return NextResponse.json({ summary: null })
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error fetching summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    )
  }
} 