import React from 'react'

export default function EmptyState({ icon = 'fa-circle-info', children }) {
  return (
    <div className="empty-state">
      <i className={`fas ${icon}`}></i>
      {children}
    </div>
  )
}

