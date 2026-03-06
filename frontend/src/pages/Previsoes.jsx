import React, { useState, useEffect } from 'react'
import { getPrevisoes } from '../api/api'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const formatCurrency = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

export default function Previsoes() {
  const [previsoes, setPrevisoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPrevisoes()
      .then(res => setPrevisoes(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>

  const chartData = previsoes.map(p => ({
    mes: p.mes,
    recebimentos: parseFloat(p.recebimentos_previstos),
    pagamentos: parseFloat(p.pagamentos_previstos),
  }))

  // Find the month with highest risk (pagamentos > recebimentos by the largest margin)
  let riskMonth = null
  let maxDiff = 0
  chartData.forEach(d => {
    const diff = d.pagamentos - d.recebimentos
    if (diff > maxDiff) {
      maxDiff = diff
      riskMonth = d.mes
    }
  })

  return (
    <section className="fade-in">
      <div className="page-header">
        <div>
          <h1>Previsões Financeiras e Decisão Estratégica</h1>
          <p className="subtitle">Dados históricos e projeções para tomada de decisões informadas.</p>
        </div>
      </div>

      {riskMonth && (
        <div className="card full-width" style={{ marginBottom: 24 }}>
          <div className="warning-banner">
            <i className="fas fa-lightbulb"></i>
            <div>
              <strong>Análise Preditiva:</strong> O fluxo de pagamentos projetado para <strong>{riskMonth}</strong> apresenta
              um risco elevado de rutura de tesouraria, com os pagamentos a fornecedores a superarem os recebimentos esperados
              em <strong>{formatCurrency(maxDiff)}</strong>. Sugere-se a antecipação de faturação ou a renegociação de prazos
              com fornecedores.
            </div>
          </div>
        </div>
      )}

      <div className="chart-card full-width">
        <div className="chart-header">
          <h3>Previsão a 6 Meses — Recebimentos vs Pagamentos</h3>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Area
              type="monotone"
              dataKey="recebimentos"
              name="Recebimentos Previstos"
              stroke="#10b981"
              fill="url(#colorRec)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="pagamentos"
              name="Pagamentos Previstos"
              stroke="#ef4444"
              fill="url(#colorPag)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
