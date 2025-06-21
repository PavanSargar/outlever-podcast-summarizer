'use client';

import { useState } from 'react';

import { Calendar, Clock, Loader2 } from 'lucide-react';

import { PodcastEpisode } from '@/types';
import { formatDate, formatDuration } from '@/lib/utils';

interface PodcastEpisodeCardProps {
  episode: PodcastEpisode;
  onSummarize: (episode: PodcastEpisode) => Promise<void>;
  existingSummary?: string | null;
  isLoading?: boolean;
}

export default function PodcastEpisodeCard({
  episode,
  onSummarize,
  existingSummary,
  isLoading = false,
}: PodcastEpisodeCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const stripHtmlTags = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const truncateHtml = (html: string, limit: number) => {
    const plainText = stripHtmlTags(html);
    if (plainText.length <= limit) return html;
    
    // for truncating the html
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const textContent = temp.textContent || temp.innerText || '';
    
    if (textContent.length <= limit) return html;
    
    const truncatedText = textContent.substring(0, limit);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    const cutPoint = lastSpaceIndex > limit * 0.8 ? lastSpaceIndex : limit;
    
    return textContent.substring(0, cutPoint) + '...';
  };

  const getDescriptionToShow = () => {
    if (!episode.description) return '';
    
    if (showFullDescription) {
      return episode.description;
    }
    
    const plainText = stripHtmlTags(episode.description);
    if (plainText.length <= 200) {
      return episode.description;
    }
    
    return truncateHtml(episode.description, 200);
  };

  const shouldShowToggle = () => {
    if (!episode.description) return false;
    const plainText = stripHtmlTags(episode.description);
    return plainText.length > 200;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {episode.image && (
          <div className="flex-shrink-0">
            <img
              src={episode.image}
              alt={episode.title}
              className="w-24 h-24 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {episode.title}
          </h3>

          <p className="text-sm text-gray-600 mb-2 font-medium">
            {episode.podcast_title}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(episode.audio_length_sec)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(episode.pub_date_ms)}</span>
            </div>
          </div>

          <div className="text-sm text-gray-700 mb-4 prose prose-sm max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: getDescriptionToShow() 
              }} 
            />
            {shouldShowToggle() && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:text-blue-800 ml-1 font-medium inline-block mt-1"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {existingSummary && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                AI Summary Available
              </h4>
              <p className="text-sm text-green-700">
                {existingSummary.length > 150 ? existingSummary.substring(0, 150) + '...' : existingSummary}
              </p>
            </div>
          )}

          <button
            onClick={() => onSummarize(episode)}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                {existingSummary
                  ? 'Loading Summary...'
                  : 'Generating Summary...'}
              </>
            ) : existingSummary ? (
              'View Summary'
            ) : (
              'Summarize Episode'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
