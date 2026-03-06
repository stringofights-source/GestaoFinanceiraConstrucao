import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const links = [
    { to: '/', icon: 'fas fa-chart-line', label: 'Relatórios em Tempo Real' },
    { to: '/orcamentos', icon: 'fas fa-file-invoice-dollar', label: 'Controle Orçamental' },
    { to: '/fluxo-caixa', icon: 'fas fa-money-bill-transfer', label: 'Fluxo de Caixa' },
    { to: '/fornecedores', icon: 'fas fa-truck-field', label: 'Fornecedores & Pagamentos' },
    { to: '/previsoes', icon: 'fas fa-chart-pie', label: 'Previsões Financeiras' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2><i className="fas fa-hard-hat"></i> ConstruManage</h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <i className={link.icon}></i> {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>IPB Projeto 3º Ano<br />Tecnologias Digitais e Gestão<br />2025/2026</p>
      </div>
    </aside>
  )
}
