import React, { useEffect, useState } from 'react'
import {
  getNotificacoes,
  marcarNotificacaoLida,
  marcarTodasNotificacoesLidas,
} from '../api/api'

const normalizeList = (data) => data.results || data

export default function TopHeader({ onToggleSidebar }) {
  const [notificacoes, setNotificacoes] = useState([])
  const [open, setOpen] = useState(false)

  const fetchNotificacoes = async () => {
    try {
      const response = await getNotificacoes()
      setNotificacoes(normalizeList(response.data))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchNotificacoes()
    const timer = window.setInterval(fetchNotificacoes, 60000)
    return () => window.clearInterval(timer)
  }, [])

  const unreadCount = notificacoes.filter((item) => !item.lida).length

  const handleMarkRead = async (id) => {
    try {
      await marcarNotificacaoLida(id)
      fetchNotificacoes()
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await marcarTodasNotificacoesLidas()
      fetchNotificacoes()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <header className="top-header">
      <button className="btn-icon sidebar-toggle" onClick={onToggleSidebar} aria-label="Abrir menu">
        <i className="fas fa-bars"></i>
      </button>

      <div className="top-header-actions">
        <div className="notification-wrapper">
          <button className="notification" onClick={() => setOpen((current) => !current)} aria-label="Notificacoes">
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
          </button>

          {open && (
            <div className="notification-menu">
              <div className="notification-menu-header">
                <strong>Notificacoes</strong>
                {unreadCount > 0 && (
                  <button className="link-button" onClick={handleMarkAllRead}>
                    Marcar todas
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notificacoes.length === 0 ? (
                  <div className="notification-empty">Sem notificacoes.</div>
                ) : (
                  notificacoes.slice(0, 8).map((item) => (
                    <button
                      key={item.id}
                      className={`notification-item${item.lida ? '' : ' unread'}`}
                      onClick={() => handleMarkRead(item.id)}
                    >
                      <span>{item.titulo}</span>
                      <small>{item.mensagem}</small>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
