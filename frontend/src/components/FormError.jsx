import React from 'react'

export default function FormError({ message }) {
  if (!message) return null
  return (
    <div className="login-error" style={{ marginBottom: 16 }}>
      <i className="fas fa-circle-exclamation"></i> {message}
    </div>
  )
}

