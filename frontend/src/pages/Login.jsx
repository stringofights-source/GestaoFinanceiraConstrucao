import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/api'
import { tokenStorage } from '../auth/tokenStorage'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const cleanUsername = username.trim()
      const response = await login(cleanUsername, password)
      tokenStorage.setSession({
        access: response.data.access,
        refresh: response.data.refresh,
        username: cleanUsername,
      })
      navigate('/')
    } catch {
      setError('Credenciais invalidas. Verifique o utilizador e a palavra-passe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <h1><i className="fas fa-hard-hat"></i> ConstruManage</h1>
        <p>Plataforma de Gestao Financeira Integrada para Empresas de Construcao Civil</p>
        <ul className="features-list">
          <li><i className="fas fa-check-circle"></i> Controle orcamental em tempo real</li>
          <li><i className="fas fa-check-circle"></i> Fluxo de caixa automatizado</li>
          <li><i className="fas fa-check-circle"></i> Gestao de fornecedores e pagamentos</li>
          <li><i className="fas fa-check-circle"></i> Relatorios financeiros detalhados</li>
          <li><i className="fas fa-check-circle"></i> Previsoes e decisao estrategica</li>
        </ul>
      </div>

      <div className="login-form-container">
        <h2>Bem-vindo de volta</h2>
        <p className="subtitle">Inicie sessao na sua conta ConstruManage</p>

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
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Palavra-passe</label>
            <input
              type="password"
              placeholder="A sua palavra-passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> A entrar...</>
            ) : (
              <><i className="fas fa-sign-in-alt"></i> Entrar</>
            )}
          </button>

          <div className="form-footer">
            Nao tem conta? <Link to="/register">Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
