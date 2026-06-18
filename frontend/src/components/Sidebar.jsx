import React from 'react'
import { NavLink } from 'react-router-dom'
import { tokenStorage } from '../auth/tokenStorage'

export default function Sidebar({ isOpen = false, onClose, onLogout }) {
  const username = tokenStorage.getUsername()

  const links = [
    { to: '/', icon: 'fas fa-chart-line', label: 'Relatorios em Tempo Real' },
    { to: '/obras', icon: 'fas fa-building', label: 'Gestao de Obras' },
    { to: '/fluxo-caixa', icon: 'fas fa-money-bill-transfer', label: 'Fluxo de Caixa' },
    { to: '/fornecedores', icon: 'fas fa-truck-field', label: 'Fornecedores & Pagamentos' },
    { to: '/previsoes', icon: 'fas fa-chart-pie', label: 'Previsoes Financeiras' },
  ]

  return (
    <>
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <h2><i className="fas fa-hard-hat"></i> ConstruManage</h2>
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{username}</span>
              <span className="sidebar-user-role">Gestor Financeiro</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <i className={link.icon}></i> {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout sidebar-logout" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
          <p>IPB Projeto 3 Ano<br />Tecnologias Digitais e Gestao<br />2025/2026</p>
        </div>
      </aside>
      {isOpen && <button className="sidebar-backdrop" onClick={onClose} aria-label="Fechar menu"></button>}
    </>
  )
}
