import React from 'react'

export default function PageFilters({ search, onSearchChange, placeholder, inputId, children }) {
  return (
    <div className="page-filters">
      <div className="search-bar page-filter-search">
        <i className="fas fa-magnifying-glass"></i>
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      {children && <div className="page-filter-actions">{children}</div>}
    </div>
  )
}
