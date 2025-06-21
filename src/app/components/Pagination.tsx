import React from 'react'
import { PaginationInfo } from '@/types'

interface PaginationProps {
  pagination?: PaginationInfo
  onPageChange: (page: number) => void
  isLoading: boolean
}

function Pagination({ pagination, onPageChange, isLoading }: PaginationProps) {
  if (!pagination) return null;
  
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={() => onPageChange((pagination?.page || 1) - 1)}
        disabled={!pagination?.hasPrevious || isLoading}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-600">
        Page {pagination?.page || 1}
      </span>
      
      <button
        onClick={() => onPageChange((pagination?.page || 1) + 1)}
        disabled={!pagination?.hasNext || isLoading}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

export default React.memo(Pagination) 