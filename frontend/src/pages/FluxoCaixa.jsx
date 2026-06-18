import React, { useState, useEffect } from 'react'
import { getTransacoes, createTransacao } from '../api/api'
import PageFilters from '../components/PageFilters'

const formatCurrency = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v)

const categoriaLabels = {
  clientes: 'Clientes', materiais: 'Materiais', mao_de_obra: 'Mão de Obra',
  subcontratados: 'Subcontratados', equipamentos: 'Equipamentos',
  licencas: 'Licenças', outros: 'Outros'
}

export default function FluxoCaixa() {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ descricao: '', tipo: 'entrada', valor: '', categoria: 'outros' })

  const fetchData = () => {
    getTransacoes()
      .then(res => setTransacoes(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]
    try {
      await createTransacao({
        descricao: form.descricao,
        tipo: form.tipo,
        valor: parseFloat(form.valor),
        categoria: form.categoria,
        data: today
      })
      setForm({ descricao: '', tipo: 'entrada', valor: '', categoria: 'outros' })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>

  const q = search.toLowerCase()
  const filtered = transacoes.filter(t =>
    !q ||
    t.descricao.toLowerCase().includes(q) ||
    (categoriaLabels[t.categoria] || t.categoria).toLowerCase().includes(q) ||
    (t.tipo === 'entrada' ? 'entrada' : 'saída').includes(q) ||
    (t.obra_nome || '').toLowerCase().includes(q)
  )

  return (
    <section className="fade-in">
      <div className="page-header">
        <div>
          <h1>Gestão de Fluxo de Caixa</h1>
          <p className="subtitle">Acompanhamento automatizado de todas as entradas e saídas financeiras.</p>
        </div>
      </div>

      <div className="transaction-form">
        <h3><i className="fas fa-keyboard"></i> Registar Novo Movimento</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              placeholder="Ex: Pagamento Cliente X"
              value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>
          <div className="form-group">
            <label>Valor (€)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.valor}
              onChange={e => setForm({ ...form, valor: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              <i className="fas fa-plus"></i> Gravar
            </button>
          </div>
        </form>
      </div>
      <PageFilters
        inputId="transacoes-search"
        search={search}
        onSearchChange={setSearch}
        placeholder="Pesquisar transacao..."
      />

      <div className="card full-width">
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fas fa-receipt" style={{ fontSize: '2rem', marginBottom: '12px', display: 'block', opacity: 0.3 }}></i>
            {search ? 'Nenhuma transação encontrada para a pesquisa.' : 'Ainda não existem transações registadas.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Obra</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.data).toLocaleDateString('pt-PT')}</td>
                  <td>{t.descricao}</td>
                  <td>{categoriaLabels[t.categoria] || t.categoria}</td>
                  <td>{t.obra_nome || '—'}</td>
                  <td>
                    <span className={`badge ${t.tipo === 'entrada' ? 'badge-success' : 'badge-danger'}`}>
                      {t.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className={t.tipo === 'entrada' ? 'positive' : 'negative'}>
                    {t.tipo === 'entrada' ? '+' : '-'} {formatCurrency(t.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
