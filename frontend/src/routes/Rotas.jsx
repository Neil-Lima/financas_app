import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import MetasPage from '../pages/MetasPage'
import OrcamentosPage from '../pages/OrcamentosPage'
import RelatoriosPage from '../pages/RelatoriosPage'
import TransacoesPage from '../pages/TransacoesPage'
import ContasPage from '../pages/ContasPage'
import LoginPage from '../pages/LoginPage'
import DespesaPage from '../pages/DespesaPage'
import ParcelamentosPage from '../pages/ParcelamentosPage'
import FinanciamentosPage from '../pages/FinanciamentosPage'
import EstoquePage from '../pages/EstoquePage'
import UsuariosPage from '../pages/UsuariosPage'
import Layout from '../layout/Layout'

function Rotas() {
  // Componente de rota com Layout
  const PrivateRoute = ({ children }) => {
    return <Layout>{children}</Layout>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="/metas" element={
          <PrivateRoute>
            <MetasPage />
          </PrivateRoute>
        } />
        <Route path="/orcamentos" element={
          <PrivateRoute>
            <OrcamentosPage />
          </PrivateRoute>
        } />
        <Route path="/relatorios" element={
          <PrivateRoute>
            <RelatoriosPage />
          </PrivateRoute>
        } />
        <Route path="/transacoes" element={
          <PrivateRoute>
            <TransacoesPage />
          </PrivateRoute>
        } />
        <Route path="/contas" element={
          <PrivateRoute>
            <ContasPage />
          </PrivateRoute>
        } />
        <Route path="/despesas" element={
          <PrivateRoute>
            <DespesaPage />
          </PrivateRoute>
        } />
        <Route path="/parcelamentos" element={
          <PrivateRoute>
            <ParcelamentosPage/>
          </PrivateRoute>
        } />
        <Route path="/financiamentos" element={
          <PrivateRoute>
            <FinanciamentosPage/>
          </PrivateRoute>
        } />
        <Route path="/estoque" element={
          <PrivateRoute>
            <EstoquePage/>
          </PrivateRoute>
        } />
        <Route path="/usuarios" element={
          <PrivateRoute>
            <UsuariosPage/>
          </PrivateRoute>
        } /> 
      </Routes>
    </BrowserRouter>
  )
}

export default Rotas
