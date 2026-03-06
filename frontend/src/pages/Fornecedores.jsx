import React, { useState, useEffect } from 'react'
import { getFornecedores, updateFornecedor } from '../api/api'

const formatCurrency = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v)

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)

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

  const statusMap = {
    pendente: { label: 'Pendente', cls: 'badge-warning' },
    pago: { label: 'Pago', cls: 'badge-success' },
    atrasado: { label: 'Atrasado', cls: 'badge-danger' },
    agendado: { label: 'Agendado', cls: 'badge-info' },
  }

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

      <div className="card full-width">
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
            {fornecedores.map(f => {
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
      </div>
    </section>
  )
}
