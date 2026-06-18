import React, { useCallback, useEffect, useState } from 'react'
import {
  createTransacao,
  deleteTransacao,
  getObras,
  getTransacoes,
  updateTransacao,
} from '../api/api'
import PageFilters from '../components/PageFilters'
import PaginationControls from '../components/PaginationControls'
import FormError from '../components/FormError'
import usePaginatedResource from '../hooks/usePaginatedResource'
import { errorToMessage, fetchAllPages } from '../utils/apiData'
import { formatCurrency, formatDate } from '../utils/formatters'

const categoriaLabels = {
  clientes: 'Clientes',
  materiais: 'Materiais',
  mao_de_obra: 'Mao de Obra',
  subcontratados: 'Subcontratados',
  equipamentos: 'Equipamentos',
  licencas: 'Licencas',
  outros: 'Outros',
}

const emptyForm = {
  descricao: '',
  tipo: 'entrada',
  valor: '',
  categoria: 'outros',
  data: '',
  obra: '',
}

function TransacaoModal({ transacao, obras, onClose, onSaved }) {
  const isEdit = Boolean(transacao?.id)
  const [form, setForm] = useState(
    isEdit
      ? {
          descricao: transacao.descricao || '',
          tipo: transacao.tipo || 'entrada',
          valor: transacao.valor || '',
          categoria: transacao.categoria || 'outros',
          data: transacao.data || '',
          obra: transacao.obra || '',
        }
      : { ...emptyForm, data: new Date().toISOString().split('T')[0] }
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
        descricao: form.descricao.trim(),
        tipo: form.tipo,
        valor: parseFloat(form.valor),
        categoria: form.categoria,
        data: form.data,
        obra: form.obra ? parseInt(form.obra, 10) : null,
      }

      if (isEdit) {
        await updateTransacao(transacao.id, payload)
      } else {
        await createTransacao(payload)
      }
      onSaved()
    } catch (err) {
      setError(errorToMessage(err, 'Nao foi possivel guardar a transacao.'))
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
            {isEdit ? 'Editar Transacao' : 'Nova Transacao'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form id="transacao-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            <FormError message={error} />

            <div className="form-grid-2">
              <div className="form-group span-2">
                <label htmlFor="transacao-descricao">Descricao *</label>
                <input
                  id="transacao-descricao"
                  type="text"
                  value={form.descricao}
                  onChange={set('descricao')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="transacao-tipo">Tipo *</label>
                <select id="transacao-tipo" value={form.tipo} onChange={set('tipo')} required>
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saida</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transacao-categoria">Categoria *</label>
                <select id="transacao-categoria" value={form.categoria} onChange={set('categoria')} required>
                  {Object.entries(categoriaLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transacao-valor">Valor (EUR) *</label>
                <input
                  id="transacao-valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.valor}
                  onChange={set('valor')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="transacao-data">Data *</label>
                <input id="transacao-data" type="date" value={form.data} onChange={set('data')} required />
              </div>

              <div className="form-group span-2">
                <label htmlFor="transacao-obra">Obra</label>
                <select id="transacao-obra" value={form.obra || ''} onChange={set('obra')}>
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
            <button type="submit" className="btn btn-primary" disabled={saving} form="transacao-form">
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

export default function FluxoCaixa() {
  const [obras, setObras] = useState([])
  const [obrasLoading, setObrasLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTransacoes = useCallback((params) => getTransacoes({
    ...params,
    search: search || undefined,
  }), [search])

  const {
    items: transacoes,
    page,
    count,
    next,
    previous,
    loading,
    reload,
    goToPage,
  } = usePaginatedResource(fetchTransacoes, [search])

  const fetchObras = async () => {
    setObrasLoading(true)
    try {
      setObras(await fetchAllPages(getObras))
    } catch (error) {
      console.error(error)
    } finally {
      setObrasLoading(false)
    }
  }

  useEffect(() => { fetchObras() }, [])

  const handleSaved = () => {
    setModal(null)
    reload()
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await deleteTransacao(id)
      setConfirmDelete(null)
      reload()
    } catch (error) {
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading || obrasLoading) return <div className="spinner-container"><div className="spinner"></div></div>

  const filtered = transacoes

  return (
    <section className="fade-in">
      <div className="page-header">
        <div>
          <h1>Gestao de Fluxo de Caixa</h1>
          <p className="subtitle">Acompanhamento de entradas e saidas financeiras.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('create')}>
          <i className="fas fa-plus"></i> Nova Transacao
        </button>
      </div>

      <PageFilters
        inputId="transacoes-search"
        search={search}
        onSearchChange={setSearch}
        placeholder="Pesquisar transacao..."
      />

      <div className="card full-width">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-receipt"></i>
            {search ? 'Nenhuma transacao encontrada para a pesquisa.' : 'Ainda nao existem transacoes registadas.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descricao</th>
                <th>Categoria</th>
                <th>Obra</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((transacao) => {
                const isConfirming = confirmDelete === transacao.id
                return (
                  <tr key={transacao.id}>
                    <td>{formatDate(transacao.data)}</td>
                    <td>{transacao.descricao}</td>
                    <td>{categoriaLabels[transacao.categoria] || transacao.categoria}</td>
                    <td>{transacao.obra_nome || '-'}</td>
                    <td>
                      <span className={`badge ${transacao.tipo === 'entrada' ? 'badge-success' : 'badge-danger'}`}>
                        {transacao.tipo === 'entrada' ? 'Entrada' : 'Saida'}
                      </span>
                    </td>
                    <td className={transacao.tipo === 'entrada' ? 'positive' : 'negative'}>
                      {transacao.tipo === 'entrada' ? '+' : '-'} {formatCurrency(transacao.valor)}
                    </td>
                    <td>
                      {isConfirming ? (
                        <div className="confirm-inline">
                          <span className="confirm-text">Confirmar?</span>
                          <button className="btn btn-small btn-danger" onClick={() => handleDelete(transacao.id)} disabled={deleting}>
                            {deleting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-trash"></i>}
                          </button>
                          <button className="btn btn-small btn-ghost" onClick={() => setConfirmDelete(null)} disabled={deleting}>
                            <i className="fas fa-xmark"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="row-actions">
                          <button className="btn btn-small btn-primary" onClick={() => setModal(transacao)} title="Editar">
                            <i className="fas fa-pen"></i>
                          </button>
                          <button className="btn btn-small btn-danger" onClick={() => setConfirmDelete(transacao.id)} title="Eliminar">
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

      <PaginationControls
        page={page}
        count={count}
        next={next}
        previous={previous}
        onPageChange={goToPage}
      />

      {modal && (
        <TransacaoModal
          transacao={modal === 'create' ? null : modal}
          obras={obras}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </section>
  )
}
