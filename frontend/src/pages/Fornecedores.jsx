import React, { useEffect, useState } from 'react'
import {
  createFornecedor,
  deleteFornecedor,
  getFornecedores,
  getObras,
  updateFornecedor,
} from '../api/api'
import PageFilters from '../components/PageFilters'

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)

const statusMap = {
  pendente: { label: 'Pendente', cls: 'badge-warning' },
  pago: { label: 'Pago', cls: 'badge-success' },
  atrasado: { label: 'Atrasado', cls: 'badge-danger' },
  agendado: { label: 'Agendado', cls: 'badge-info' },
}

const emptyForm = {
  nome: '',
  servico: '',
  obra: '',
  prazo_pagamento: '',
  valor: '',
  status_pagamento: 'pendente',
}

const isFornecedorVencido = (fornecedor) => {
  if (fornecedor.status_pagamento === 'pago') return false
  if (fornecedor.status_pagamento === 'atrasado') return true
  if (!fornecedor.prazo_pagamento) return false

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const prazo = new Date(fornecedor.prazo_pagamento)
  prazo.setHours(0, 0, 0, 0)

  return prazo < hoje
}

const isFornecedorPendente = (fornecedor) =>
  fornecedor.status_pagamento !== 'pago' && !isFornecedorVencido(fornecedor)

function FornecedorModal({ fornecedor, obras, onClose, onSaved }) {
  const isEdit = Boolean(fornecedor?.id)
  const [form, setForm] = useState(
    isEdit
      ? {
          nome: fornecedor.nome || '',
          servico: fornecedor.servico || '',
          obra: fornecedor.obra || '',
          prazo_pagamento: fornecedor.prazo_pagamento || '',
          valor: fornecedor.valor || '',
          status_pagamento: fornecedor.status_pagamento || 'pendente',
        }
      : { ...emptyForm }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        nome: form.nome.trim(),
        servico: form.servico.trim(),
        obra: form.obra ? parseInt(form.obra, 10) : null,
        prazo_pagamento: form.prazo_pagamento,
        valor: parseFloat(form.valor),
        status_pagamento: form.status_pagamento,
      }

      if (isEdit) {
        await updateFornecedor(fornecedor.id, payload)
      } else {
        await createFornecedor(payload)
      }
      onSaved()
    } catch (err) {
      const data = err.response?.data
      if (data) {
        setError(
          Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join(' | ')
        )
      } else {
        setError('Nao foi possivel guardar o fornecedor.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>
            <i className={`fas ${isEdit ? 'fa-pen-to-square' : 'fa-plus-circle'}`}></i>
            {isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form id="fornecedor-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="login-error" style={{ marginBottom: 16 }}>
                <i className="fas fa-circle-exclamation"></i> {error}
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group span-2">
                <label htmlFor="fornecedor-nome">Fornecedor *</label>
                <input id="fornecedor-nome" type="text" value={form.nome} onChange={set('nome')} required />
              </div>

              <div className="form-group span-2">
                <label htmlFor="fornecedor-servico">Servico / Material *</label>
                <input id="fornecedor-servico" type="text" value={form.servico} onChange={set('servico')} required />
              </div>

              <div className="form-group">
                <label htmlFor="fornecedor-prazo">Prazo de Pagamento *</label>
                <input id="fornecedor-prazo" type="date" value={form.prazo_pagamento} onChange={set('prazo_pagamento')} required />
              </div>

              <div className="form-group">
                <label htmlFor="fornecedor-valor">Valor (EUR) *</label>
                <input id="fornecedor-valor" type="number" min="0" step="0.01" value={form.valor} onChange={set('valor')} required />
              </div>

              <div className="form-group">
                <label htmlFor="fornecedor-status">Estado *</label>
                <select id="fornecedor-status" value={form.status_pagamento} onChange={set('status_pagamento')} required>
                  {Object.entries(statusMap).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fornecedor-obra">Obra</label>
                <select id="fornecedor-obra" value={form.obra || ''} onChange={set('obra')}>
                  <option value="">Sem obra associada</option>
                  {obras.map((obra) => (
                    <option key={obra.id} value={obra.id}>{obra.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving} form="fornecedor-form">
              {saving ? (
                <><i className="fas fa-circle-notch fa-spin"></i> A guardar...</>
              ) : (
                <><i className={`fas ${isEdit ? 'fa-check' : 'fa-plus'}`}></i> {isEdit ? 'Guardar' : 'Criar'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([])
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [modal, setModal] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [fornecedoresRes, obrasRes] = await Promise.all([getFornecedores(), getObras()])
      setFornecedores(fornecedoresRes.data.results || fornecedoresRes.data)
      setObras(obrasRes.data.results || obrasRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSaved = () => {
    setModal(null)
    fetchData()
  }

  const marcarPago = async (fornecedor) => {
    try {
      await updateFornecedor(fornecedor.id, { ...fornecedor, status_pagamento: 'pago' })
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await deleteFornecedor(id)
      setConfirmDelete(null)
      fetchData()
    } catch (error) {
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>

  const vencidos = fornecedores.filter(isFornecedorVencido)
  const pendentes = fornecedores.filter(isFornecedorPendente)
  const totalVencido = vencidos.reduce((sum, fornecedor) => sum + parseFloat(fornecedor.valor), 0)
  const totalPendente = pendentes.reduce((sum, fornecedor) => sum + parseFloat(fornecedor.valor), 0)

  const query = search.toLowerCase()
  const filtered = fornecedores.filter((fornecedor) => {
    const matchesText =
      !query ||
      fornecedor.nome.toLowerCase().includes(query) ||
      (fornecedor.servico || '').toLowerCase().includes(query) ||
      (fornecedor.obra_nome || '').toLowerCase().includes(query)

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'atrasado' && isFornecedorVencido(fornecedor)) ||
      (statusFilter === 'pendente' && isFornecedorPendente(fornecedor)) ||
      (statusFilter === 'pago' && fornecedor.status_pagamento === 'pago')

    return matchesText && matchesStatus
  })

  const filterButtons = [
    { key: 'todos', label: 'Todos', icon: 'fa-list' },
    { key: 'atrasado', label: 'Vencidos', icon: 'fa-exclamation-circle' },
    { key: 'pendente', label: 'Pendentes', icon: 'fa-clock' },
    { key: 'pago', label: 'Pagos', icon: 'fa-check-circle' },
  ]

  return (
    <section className="fade-in">
      <div className="page-header">
        <div>
          <h1>Gestao de Fornecedores e Pagamentos</h1>
          <p className="subtitle">Organizacao e controlo de pagamentos a subcontratados e fornecedores.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('create')}>
          <i className="fas fa-plus"></i> Novo Fornecedor
        </button>
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
            <h3>A Pagar</h3>
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
        {filterButtons.map((filter) => (
          <button
            key={filter.key}
            id={`fornecedores-filter-${filter.key}`}
            onClick={() => setStatusFilter(filter.key)}
            className={`btn btn-small ${statusFilter === filter.key ? 'btn-primary' : 'btn-ghost'}`}
          >
            <i className={`fas ${filter.icon}`}></i> {filter.label}
          </button>
        ))}
      </PageFilters>

      <div className="card full-width">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-truck"></i>
            {search || statusFilter !== 'todos' ? 'Nenhum fornecedor encontrado para os filtros aplicados.' : 'Ainda nao existem fornecedores registados.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Fornecedor</th>
                <th>Servico/Material</th>
                <th>Obra</th>
                <th>Prazo</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fornecedor) => {
                const status = statusMap[fornecedor.status_pagamento] || { label: fornecedor.status_pagamento, cls: '' }
                const isAtrasado = isFornecedorVencido(fornecedor)
                const isConfirming = confirmDelete === fornecedor.id

                return (
                  <tr key={fornecedor.id} style={isAtrasado ? { backgroundColor: 'rgba(239,68,68,0.04)' } : {}}>
                    <td><strong>{fornecedor.nome}</strong></td>
                    <td>{fornecedor.servico}</td>
                    <td>{fornecedor.obra_nome || '-'}</td>
                    <td className={isAtrasado ? 'negative' : ''}>
                      {new Date(fornecedor.prazo_pagamento).toLocaleDateString('pt-PT')}
                      {isAtrasado && ' (Atrasado)'}
                    </td>
                    <td>{formatCurrency(fornecedor.valor)}</td>
                    <td><span className={`badge ${status.cls}`}>{status.label}</span></td>
                    <td>
                      {isConfirming ? (
                        <div className="confirm-inline">
                          <span className="confirm-text">Confirmar?</span>
                          <button className="btn btn-small btn-danger" onClick={() => handleDelete(fornecedor.id)} disabled={deleting}>
                            {deleting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-trash"></i>}
                          </button>
                          <button className="btn btn-small btn-ghost" onClick={() => setConfirmDelete(null)} disabled={deleting}>
                            <i className="fas fa-xmark"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="row-actions">
                          {fornecedor.status_pagamento !== 'pago' && (
                            <button className="btn btn-small btn-primary" onClick={() => marcarPago(fornecedor)} title="Liquidar">
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button className="btn btn-small btn-primary" onClick={() => setModal(fornecedor)} title="Editar">
                            <i className="fas fa-pen"></i>
                          </button>
                          <button className="btn btn-small btn-danger" onClick={() => setConfirmDelete(fornecedor.id)} title="Eliminar">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <FornecedorModal
          fornecedor={modal === 'create' ? null : modal}
          obras={obras}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </section>
  )
}
