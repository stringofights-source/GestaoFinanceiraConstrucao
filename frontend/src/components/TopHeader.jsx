import React from 'react'

export default function TopHeader({ onLogout }) {
  const username = localStorage.getItem('username') || 'Utilizador'

  return (
    <header className="top-header">
      <div className="user-profile">
        <div className="notification">
          <i className="fas fa-bell"></i>
          <span className="badge-dot"></span>
        </div>
        <div className="avatar">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <span className="user-name">{username}</span>
          <span className="user-role">Gestor Financeiro</span>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </header>
  )
}
