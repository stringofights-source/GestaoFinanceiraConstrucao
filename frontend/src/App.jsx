import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopHeader from './components/TopHeader'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Orcamentos from './pages/Orcamentos'
import FluxoCaixa from './pages/FluxoCaixa'
import Fornecedores from './pages/Fornecedores'
import Previsoes from './pages/Previsoes'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function AppLayout({ onLogout }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <TopHeader onLogout={onLogout} />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/previsoes" element={<Previsoes />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
