const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { rateLimitMiddleware } = require('./middleware/Middleware');
const syncController = require('./syncController');

// Importação das rotas
const usuarioRoutes = require('./usuarios/usuarioRoute');
const contaRoutes = require('./contas/contaRoute');
const transacaoRoutes = require('./transacoes/transacaoRoute');
const categoriaRoutes = require('./categorias/categoriaRoute');
const despesaRoutes = require('./despesas/despesaRoute');
const metaRoutes = require('./metas/metaRoute');
const orcamentoRoutes = require('./orcamentos/orcamentoRoute');
const parcelamentoRoutes = require('./parcelamentos/parcelamentoRoute');
const financiamentoRoutes = require('./financiamentos/financiamentoRoute');
const estoqueRoutes = require('./estoque/estoqueRoute');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(rateLimitMiddleware);
app.use('/api/sync', syncController);




// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/contas', contaRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api/parcelamentos', parcelamentoRoutes);
app.use('/api/financiamentos', financiamentoRoutes);
app.use('/api/estoque', estoqueRoutes);

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app;
