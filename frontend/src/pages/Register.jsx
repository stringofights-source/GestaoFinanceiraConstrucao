import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      const msg = data ? Object.values(data).flat().join(' ') : 'Erro ao criar conta.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <h1><i className="fas fa-hard-hat"></i> ConstruManage</h1>
        <p>Crie a sua conta e comece a gerir as finanças da sua empresa de construção civil.</p>
      </div>
      <div className="login-form-container">
        <h2>Criar Conta</h2>
        <p className="subtitle">Preencha os dados para se registar</p>

        {error && (
          <div className="login-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="first_name" placeholder="Primeiro nome" value={form.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Apelido</label>
            <input type="text" name="last_name" placeholder="Apelido" value={form.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" name="email" placeholder="email@exemplo.pt" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Utilizador</label>
            <input type="text" name="username" placeholder="Nome de utilizador" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Palavra-passe</label>
            <input type="password" name="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> A criar...</> : <><i className="fas fa-user-plus"></i> Registar</>}
          </button>
          <div className="form-footer">
            Já tem conta? <Link to="/login">Iniciar sessão</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
