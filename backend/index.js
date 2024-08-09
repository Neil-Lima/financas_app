const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const usuarioRoutes = require('./usuarios/usuarioRoute');
const categoriaRoutes = require('./categorias/categoriaRoute');
const contaRoutes = require('./contas/contaRoute');
const transacaoRoutes = require('./transacoes/transacaoRoute');
const orcamentoRoutes = require('./orcamentos/orcamentoRoute');
const metaRoutes = require('./metas/metaRoute');
const financiamentoRoutes = require('./financiamentos/financiamentoRoute');
const despesaRoutes = require('./despesas/despesaRoute');
const parcelamentoRoutes = require('./parcelamentos/parcelamentoRoute');
const estoqueRoutes = require('./estoque/estoqueRoute');

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Finanças' });
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/contas', contaRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/financiamentos', financiamentoRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/parcelamentos', parcelamentoRoutes);
app.use('/api/estoque', estoqueRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
