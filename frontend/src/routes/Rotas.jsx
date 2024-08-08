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

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/metas" element={<MetasPage />} />
        <Route path="/orcamentos" element={<OrcamentosPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/contas" element={<ContasPage />} />
        <Route path="/despesas" element={<DespesaPage />} />
        <Route path="/parcelamentos" element={<ParcelamentosPage/>} />
        <Route path="/financiamentos" element={<FinanciamentosPage/>} />
        <Route path="/estoque" element={<EstoquePage/>} />
        <Route path="/usuarios" element={<UsuariosPage/>} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default Rotas
