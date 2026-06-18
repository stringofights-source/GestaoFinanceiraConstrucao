import React, { useState, useEffect } from 'react'
import { getFornecedores, updateFornecedor } from '../api/api'
import PageFilters from '../components/PageFilters'

const formatCurrency = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v)

const statusMap = {
  pendente:  { label: 'Pendente',  cls: 'badge-warning' },
  pago:      { label: 'Pago',      cls: 'badge-success' },
  atrasado:  { label: 'Atrasado',  cls: 'badge-danger' },
  agendado:  { label: 'Agendado',  cls: 'badge-info' },
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos') // 'todos' | 'atrasado' | 'pendente'

  const fetchData = () => {
    getFornecedores()
      .then(res => setFornecedores(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const marcarPago = async (forn) => {
    try {
      await updateFornecedor(forn.id, { ...forn, status_pagamento: 'pago' })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>

  const vencidos = fornecedores.filter(f => f.status_pagamento === 'atrasado')
  const totalVencido = vencidos.reduce((s, f) => s + parseFloat(f.valor), 0)

  const pendentes = fornecedores.filter(f => f.status_pagamento === 'pendente' || f.status_pagamento === 'agendado')
  const totalPendente = pendentes.reduce((s, f) => s + parseFloat(f.valor), 0)

  const q = search.toLowerCase()
  const filtered = fornecedores.filter(f => {
    const matchText = !q ||
      f.nome.toLowerCase().includes(q) ||
      (f.servico || '').toLowerCase().includes(q) ||
      (f.obra_nome || '').toLowerCase().includes(q)

    const matchStatus =
      statusFilter === 'todos' ? true :
      statusFilter === 'atrasado' ? f.status_pagamento === 'atrasado' :
      statusFilter === 'pendente' ? (f.status_pagamento === 'pendente' || f.status_pagamento === 'agendado') :
      true

    return matchText && matchStatus
  })

  return (
    <section className="fade-in">
      <div className="page-header">
        <div>
          <h1>Gestão de Fornecedores e Pagamentos</h1>
          <p className="subtitle">Organização e controlo de pagamentos a subcontratados e fornecedores.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="card">
          <div className="card-info">
            <h3>Pagamentos Vencidos</h3>
            <p className="value negative">{formatCurrency(totalVencido)}</p>
          </div>
          <div className="card-icon negative-bg"><i className="fas fa-exclamation-triangle"></i></div>
        </div>
        <div className="card">
          <div className="card-info">
            <h3>A Pagar (Pendente/Agendado)</h3>
            <p className="value text-warning">{formatCurrency(totalPendente)}</p>
          </div>
          <div className="card-icon warning-bg"><i className="fas fa-calendar-alt"></i></div>
        </div>
      </div>
      <PageFilters
        inputId="fornecedores-search"
        search={search}
        onSearchChange={setSearch}
        placeholder="Pesquisar fornecedor, servico, obra..."
      >
          {[
            { key: 'todos',    label: 'Todos' },
            { key: 'atrasado', label: <><i className="fas fa-exclamation-circle"></i> Vencidos</> },
            { key: 'pendente', label: <><i className="fas fa-clock"></i> Pendentes</> },
          ].map(({ key, label }) => (
            <button
              key={key}
              id={`fornecedores-filter-${key}`}
              onClick={() => setStatusFilter(key)}
              className={`btn btn-small ${statusFilter === key ? 'btn-primary' : 'btn-ghost'}`}
            >
              {label}
            </button>
          ))}
      </PageFilters>

      <div className="card full-width">
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fas fa-truck" style={{ fontSize: '2rem', marginBottom: '12px', display: 'block', opacity: 0.3 }}></i>
            {search || statusFilter !== 'todos' ? 'Nenhum fornecedor encontrado para os filtros aplicados.' : 'Ainda não existem fornecedores registados.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Entidade (Fornecedor)</th>
                <th>Serviço/Material</th>
                <th>Obra</th>
                <th>Prazo Limite</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => {
                const st = statusMap[f.status_pagamento] || { label: f.status_pagamento, cls: '' }
                const isAtrasado = f.status_pagamento === 'atrasado'
                return (
                  <tr key={f.id} style={isAtrasado ? { backgroundColor: 'rgba(239,68,68,0.04)' } : {}}>
                    <td><strong>{f.nome}</strong></td>
                    <td>{f.servico}</td>
                    <td>{f.obra_nome || '—'}</td>
                    <td className={isAtrasado ? 'negative' : ''}>
                      {new Date(f.prazo_pagamento).toLocaleDateString('pt-PT')}
                      {isAtrasado && ' (Atrasado)'}
                    </td>
                    <td>{formatCurrency(f.valor)}</td>
                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    <td>
                      {f.status_pagamento !== 'pago' ? (
                        <button className="btn btn-small btn-primary" onClick={() => marcarPago(f)}>
                          <i className="fas fa-check"></i> Liquidar
                        </button>
                      ) : (
                        <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>
                          <i className="fas fa-check-circle"></i> Pago
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
