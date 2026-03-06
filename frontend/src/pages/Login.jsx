import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      localStorage.setItem('username', username)
      navigate('/')
    } catch (err) {
      setError('Credenciais inválidas. Verifique o utilizador e a palavra-passe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <h1><i className="fas fa-hard-hat"></i> ConstruManage</h1>
        <p>Plataforma de Gestão Financeira Integrada para Empresas de Construção Civil</p>
        <ul className="features-list">
          <li><i className="fas fa-check-circle"></i> Controle orçamental em tempo real</li>
          <li><i className="fas fa-check-circle"></i> Fluxo de caixa automatizado</li>
          <li><i className="fas fa-check-circle"></i> Gestão de fornecedores e pagamentos</li>
          <li><i className="fas fa-check-circle"></i> Relatórios financeiros detalhados</li>
          <li><i className="fas fa-check-circle"></i> Previsões e decisão estratégica</li>
        </ul>
      </div>
      <div className="login-form-container">
        <h2>Bem-vindo de volta</h2>
        <p className="subtitle">Inicie sessão na sua conta ConstruManage</p>

        {error && (
          <div className="login-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Utilizador</label>
            <input
              type="text"
              placeholder="O seu nome de utilizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Palavra-passe</label>
            <input
              type="password"
              placeholder="A sua palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> A entrar...</> : <><i className="fas fa-sign-in-alt"></i> Entrar</>}
          </button>
          <div className="form-footer">
            Não tem conta? <Link to="/register">Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
