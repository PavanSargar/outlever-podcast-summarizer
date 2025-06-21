import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require('podcast-api');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const q = searchParams.get('q') || 'technology'

    if (!process.env.LISTEN_NOTES_API_KEY) {
      return NextResponse.json(
        { error: 'Listen Notes API key not configured' },
        { status: 500 }
      )
    }


    const client = Client({ apiKey: process.env.LISTEN_NOTES_API_KEY });

    const response = await client.search({
      q: q,
      sort_by_date: 1, 
      type: 'episode',
      offset: (parseInt(page) - 1) * 20,
      len_min: 10,
      len_max: 180,
      language: 'English',
      safe_mode: 0,
      unique_podcasts: 0,
      page_size: 20,
    });

    const data = response.data;
    
    return NextResponse.json({
      episodes: data.results,
      pagination: {
        total: data.total,
        page: Math.floor(data.next_offset / 20),
        hasNext: data.has_next,
        hasPrevious: data.has_previous,
      },
    })
  } catch (error) {
    console.error('Error fetching podcasts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch podcasts' },
      { status: 500 }
    )
  }
} 