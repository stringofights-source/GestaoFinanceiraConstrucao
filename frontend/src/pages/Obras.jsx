import React, { useState, useEffect, useCallback } from 'react'
import { getObras, createObra, updateObra, deleteObra } from '../api/api'

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v)

const EMPTY_FORM = {
  nome: '',
  descricao: '',
  orcamento_aprovado: '',
  custo_atual: '',
  progresso: 0,
  status: 'planeada',
  data_inicio: '',
  data_fim_prevista: '',
}

const STATUS_META = {
  em_curso:  { label: 'Em Curso',  cls: 'badge-info' },
  concluida: { label: 'Concluída', cls: 'badge-success' },
  suspensa:  { label: 'Suspensa',  cls: 'badge-warning' },
  planeada:  { label: 'Planeada',  cls: 'badge-info' },
}

/* ─── Modal ─────────────────────────────────────────── */
function ObraModal({ obra, onClose, onSaved }) {
  const isEdit = Boolean(obra?.id)
  const [form, setForm] = useState(
    isEdit
      ? {
          nome: obra.nome,
          descricao: obra.descricao || '',
          orcamento_aprovado: obra.orcamento_aprovado,
          custo_atual: obra.custo_atual,
          progresso: obra.progresso,
          status: obra.status,
          data_inicio: obra.data_inicio,
          data_fim_prevista: obra.data_fim_prevista || '',
        }
      : { ...EMPTY_FORM }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        orcamento_aprovado: parseFloat(form.orcamento_aprovado),
        custo_atual: parseFloat(form.custo_atual) || 0,
        progresso: parseInt(form.progresso, 10) || 0,
        data_fim_prevista: form.data_fim_prevista || null,
      }
      if (isEdit) {
        await updateObra(obra.id, payload)
      } else {
        await createObra(payload)
      }
      onSaved()
    } catch (err) {
      const data = err.response?.data
      if (data) {
        const msgs = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ')
        setError(msgs)
      } else {
        setError('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setSaving(false)
    }
  }

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>
            <i className={`fas ${isEdit ? 'fa-pen-to-square' : 'fa-plus-circle'}`}></i>
            {isEdit ? 'Editar Obra' : 'Nova Obra'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} id="obra-form">
          <div className="modal-body">
            {error && (
              <div className="login-error" style={{ marginBottom: 16 }}>
                <i className="fas fa-circle-exclamation"></i> {error}
              </div>
            )}

            <div className="form-grid-2">
              {/* Nome */}
              <div className="form-group span-2">
                <label htmlFor="obra-nome">Nome da Obra *</label>
                <input
                  id="obra-nome"
                  type="text"
                  placeholder="Ex: Edifício Residencial Alfa"
                  value={form.nome}
                  onChange={set('nome')}
                  required
                />
              </div>

              {/* Descrição */}
              <div className="form-group span-2">
                <label htmlFor="obra-descricao">Descrição</label>
                <textarea
                  id="obra-descricao"
                  placeholder="Breve descrição da obra (opcional)"
                  value={form.descricao}
                  onChange={set('descricao')}
                />
              </div>

              {/* Orçamento */}
              <div className="form-group">
                <label htmlFor="obra-orcamento">Orçamento Aprovado (€) *</label>
                <input
                  id="obra-orcamento"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.orcamento_aprovado}
                  onChange={set('orcamento_aprovado')}
                  required
                />
              </div>

              {/* Custo Atual */}
              <div className="form-group">
                <label htmlFor="obra-custo">Custo Atual (€)</label>
                <input
                  id="obra-custo"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.custo_atual}
                  onChange={set('custo_atual')}
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="obra-status">Estado *</label>
                <select id="obra-status" value={form.status} onChange={set('status')} required>
                  <option value="planeada">Planeada</option>
                  <option value="em_curso">Em Curso</option>
                  <option value="concluida">Concluída</option>
                  <option value="suspensa">Suspensa</option>
                </select>
              </div>

              {/* Progresso */}
              <div className="form-group">
                <label htmlFor="obra-progresso">Progresso (%)</label>
                <input
                  id="obra-progresso"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={form.progresso}
                  onChange={set('progresso')}
                />
              </div>

              {/* Data Início */}
              <div className="form-group">
                <label htmlFor="obra-data-inicio">Data de Início *</label>
                <input
                  id="obra-data-inicio"
                  type="date"
                  value={form.data_inicio}
                  onChange={set('data_inicio')}
                  required
                />
              </div>

              {/* Data Fim */}
              <div className="form-group">
                <label htmlFor="obra-data-fim">Data de Conclusão Prevista</label>
                <input
                  id="obra-data-fim"
                  type="date"
                  value={form.data_fim_prevista}
                  onChange={set('data_fim_prevista')}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving} form="obra-form">
              {saving ? (
                <><i className="fas fa-circle-notch fa-spin"></i> A guardar…</>
              ) : (
                <><i className={`fas ${isEdit ? 'fa-check' : 'fa-plus'}`}></i> {isEdit ? 'Guardar Alterações' : 'Criar Obra'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────── */
export default function Obras() {
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | obra object
  const [confirmDelete, setConfirmDelete] = useState(null) // obra id
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    getObras()
      .then((res) => setObras(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSaved = () => {
    setModal(null)
    fetchData()
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await deleteObra(id)
      setConfirmDelete(null)
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  // ── Stats ──
  const totalObras = obras.length
  const emCurso = obras.filter((o) => o.status === 'em_curso').length
  const totalOrcamento = obras.reduce((s, o) => s + parseFloat(o.orcamento_aprovado || 0), 0)
  const totalCusto = obras.reduce((s, o) => s + parseFloat(o.custo_atual || 0), 0)

  // ── Filtered ──
  const filtered = obras.filter(
    (o) =>
      o.nome.toLowerCase().includes(search.toLowerCase()) ||
      (o.descricao || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    )

  return (
    <section className="fade-in">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1>Gestão de Obras</h1>
          <p className="subtitle">
            Registo completo de projetos de construção — crie, acompanhe e actualize cada obra.
          </p>
        </div>
        <button
          id="btn-nova-obra"
          className="btn btn-primary"
          onClick={() => setModal('create')}
        >
          <i className="fas fa-plus"></i> Nova Obra
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="obras-grid">
        <div className="obra-stat-card">
          <div className="obra-stat-icon primary-bg">
            <i className="fas fa-building"></i>
          </div>
          <div className="obra-stat-info">
            <h4>Total de Obras</h4>
            <p>{totalObras}</p>
          </div>
        </div>

        <div className="obra-stat-card">
          <div className="obra-stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--info)' }}>
            <i className="fas fa-helmet-safety"></i>
          </div>
          <div className="obra-stat-info">
            <h4>Em Curso</h4>
            <p>{emCurso}</p>
          </div>
        </div>

        <div className="obra-stat-card">
          <div className="obra-stat-icon positive-bg">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="obra-stat-info">
            <h4>Orçamento Total</h4>
            <p style={{ fontSize: '1.1rem' }}>{formatCurrency(totalOrcamento)}</p>
          </div>
        </div>

        <div className="obra-stat-card">
          <div className="obra-stat-icon warning-bg">
            <i className="fas fa-sack-dollar"></i>
          </div>
          <div className="obra-stat-info">
            <h4>Custo Total Atual</h4>
            <p style={{ fontSize: '1.1rem' }}>{formatCurrency(totalCusto)}</p>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ width: '340px' }}>
          <i className="fas fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Pesquisar obra…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="obras-search"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card full-width">
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fas fa-building" style={{ fontSize: '2rem', marginBottom: '12px', display: 'block', opacity: 0.3 }}></i>
            {search ? 'Nenhuma obra encontrada para a pesquisa.' : 'Ainda não existem obras registadas.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Estado</th>
                <th>Início</th>
                <th>Fim Previsto</th>
                <th>Orçamento</th>
                <th>Custo Atual</th>
                <th>Desvio</th>
                <th>Progresso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((obra) => {
                const st = STATUS_META[obra.status] || { label: obra.status, cls: '' }
                const desvio = parseFloat(obra.orcamento_aprovado) - parseFloat(obra.custo_atual)
                const isOver = desvio < 0
                const pct = Math.min(obra.progresso ?? 0, 100)
                const isConfirming = confirmDelete === obra.id

                return (
                  <tr key={obra.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>#{obra.id}</td>
                    <td>
                      <strong>{obra.nome}</strong>
                      {obra.descricao && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {obra.descricao.length > 50
                            ? obra.descricao.substring(0, 50) + '…'
                            : obra.descricao}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </td>
                    <td>{obra.data_inicio ? new Date(obra.data_inicio).toLocaleDateString('pt-PT') : '—'}</td>
                    <td>{obra.data_fim_prevista ? new Date(obra.data_fim_prevista).toLocaleDateString('pt-PT') : '—'}</td>
                    <td>{formatCurrency(obra.orcamento_aprovado)}</td>
                    <td>{formatCurrency(obra.custo_atual)}</td>
                    <td className={isOver ? 'negative' : 'positive'}>
                      {isOver ? '▼ ' : '▲ '}
                      {formatCurrency(Math.abs(desvio))}
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <div className="progress-wrapper">
                        <div className="progress-track">
                          <div
                            className={`progress-fill${pct > 90 && isOver ? ' danger' : ''}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="progress-label">{pct}%</span>
                      </div>
                    </td>
                    <td>
                      {isConfirming ? (
                        <div className="confirm-inline">
                          <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 600 }}>
                            Confirmar?
                          </span>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => handleDelete(obra.id)}
                            disabled={deleting}
                            id={`btn-confirm-delete-${obra.id}`}
                          >
                            {deleting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-trash"></i>}
                          </button>
                          <button
                            className="btn btn-small btn-ghost"
                            onClick={() => setConfirmDelete(null)}
                            disabled={deleting}
                          >
                            <i className="fas fa-xmark"></i>
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="btn btn-small btn-primary"
                            onClick={() => setModal(obra)}
                            title="Editar"
                            id={`btn-edit-obra-${obra.id}`}
                          >
                            <i className="fas fa-pen"></i>
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => setConfirmDelete(obra.id)}
                            title="Eliminar"
                            id={`btn-delete-obra-${obra.id}`}
                          >
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

      {/* ── Modal ── */}
      {modal && (
        <ObraModal
          obra={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </section>
  )
}
