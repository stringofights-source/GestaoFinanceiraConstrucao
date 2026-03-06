import React, { useState, useEffect } from 'react'
import { getObras } from '../api/api'

const formatCurrency = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v)

export default function Orcamentos() {
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getObras()
      .then(res => setObras(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>

  return (
    <section className="fade-in">
      <div className="page-header">
        <div>
          <h1>Controle Orçamental de Obras</h1>
          <p className="subtitle">Monitorize o cumprimento de orçamentos e custos alocados a cada obra.</p>
        </div>
      </div>

      <div className="card full-width">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Projeto</th>
              <th>Estado</th>
              <th>Orçamento Aprovado</th>
              <th>Custo Atual</th>
              <th>Desvio</th>
              <th>Progresso Financeiro</th>
            </tr>
          </thead>
          <tbody>
            {obras.map(obra => {
              const pct = obra.percentagem_orcamento || (obra.orcamento_aprovado > 0
                ? ((obra.custo_atual / obra.orcamento_aprovado) * 100).toFixed(1)
                : 0)
              const desvio = parseFloat(obra.orcamento_aprovado) - parseFloat(obra.custo_atual)
              const isOver = desvio < 0

              const statusMap = {
                em_curso: { label: 'Em Curso', cls: 'badge-info' },
                concluida: { label: 'Concluída', cls: 'badge-success' },
                suspensa: { label: 'Suspensa', cls: 'badge-warning' },
                planeada: { label: 'Planeada', cls: 'badge-info' },
              }
              const st = statusMap[obra.status] || { label: obra.status, cls: '' }

              return (
                <tr key={obra.id}>
                  <td>#{obra.id}</td>
                  <td><strong>{obra.nome}</strong></td>
                  <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                  <td>{formatCurrency(obra.orcamento_aprovado)}</td>
                  <td>{formatCurrency(obra.custo_atual)}</td>
                  <td className={isOver ? 'negative' : 'positive'}>
                    {isOver ? `Derrapagem (${formatCurrency(Math.abs(desvio))})` : `Confortável (${formatCurrency(desvio)})`}
                  </td>
                  <td>
                    <div className="progress-wrapper">
                      <div className="progress-track">
                        <div
                          className={`progress-fill${isOver ? ' danger' : ''}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        ></div>
                      </div>
                      <span className="progress-label">{pct}%</span>
                    </div>
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
