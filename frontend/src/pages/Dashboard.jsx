import React, { useState, useEffect } from 'react'
import { getDashboard } from '../api/api'
import { formatCurrency } from '../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

const COLORS = ['#0f172a', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>

  const categoriaLabels = {
    materiais: 'Materiais',
    mao_de_obra: 'Mão de Obra',
    subcontratados: 'Subcontratados',
    equipamentos: 'Equipamentos',
    licencas: 'Licenças/Taxas',
    outros: 'Outros',
  }

  const pieData = (data?.custos_categoria || []).map(c => ({
    name: categoriaLabels[c.categoria] || c.categoria,
    value: parseFloat(c.total)
  }))

  return (
    <section className="fade-in">
      <div className="page-header">
        <div>
          <h1>Relatórios Financeiros em Tempo Real</h1>
          <p className="subtitle">Visão geral do estado financeiro da empresa.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="card">
          <div className="card-info">
            <h3>Receitas (Mês)</h3>
            <p className="value positive">{formatCurrency(data?.receitas_mes || 0)}</p>
          </div>
          <div className="card-icon positive-bg"><i className="fas fa-arrow-trend-up"></i></div>
        </div>
        <div className="card">
          <div className="card-info">
            <h3>Despesas (Mês)</h3>
            <p className="value negative">{formatCurrency(data?.despesas_mes || 0)}</p>
          </div>
          <div className="card-icon negative-bg"><i className="fas fa-arrow-trend-down"></i></div>
        </div>
        <div className="card">
          <div className="card-info">
            <h3>Saldo Atual</h3>
            <p className="value text-primary">{formatCurrency(data?.saldo_atual || 0)}</p>
          </div>
          <div className="card-icon primary-bg"><i className="fas fa-vault"></i></div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Receitas vs Despesas (Últimos 6 Meses)</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data?.meses_data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Custos por Categoria</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
