import React from 'react'

export default function PaginationControls({ page, count, next, previous, onPageChange }) {
  if (!count || count <= 50) return null

  const start = (page - 1) * 50 + 1
  const end = Math.min(page * 50, count)

  return (
    <div className="pagination-controls">
      <span>{start}-{end} de {count}</span>
      <div className="row-actions">
        <button className="btn btn-small btn-ghost" disabled={!previous} onClick={() => onPageChange(page - 1)}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="btn btn-small btn-ghost" disabled={!next} onClick={() => onPageChange(page + 1)}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
}

