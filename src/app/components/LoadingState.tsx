import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

function LoadingState({ message = "Loading podcasts..." }: LoadingStateProps) {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  )
}

export default React.memo(LoadingState) 