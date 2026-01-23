const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
const relatorioRoutes = require('./relatorios/relatorioRoute');
const contaAPagarRoutes = require('./contasAPagar/contaAPagarRoute');
const vencimentoRoutes = require('./vencimentos/vencimentoRoute');
const dividaRoutes = require('./dividas/dividaRoute');
const { inicializarModuloCategorias } = require('./categorias/categoriaService');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',')
    : ['https://financasappproject.netlify.app', 'https://backend-rosy-five-61.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

connectDB()
  .then(() => inicializarModuloCategorias())
  .catch((err) => {
    console.error('MongoDB não conectou na inicialização:', err);
  });

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    const path = req.path || '';
    if (!path.startsWith('/api') || path.startsWith('/api/health')) {
      return next();
    }

    if (mongoose.connection?.readyState === 1) {
      return next();
    }

    await connectDB();
    if (mongoose.connection?.readyState !== 1) {
      return res.status(503).json({ message: 'Banco de dados indisponível. Tente novamente em instantes.' });
    }

    return next();
  } catch (e) {
    return res.status(503).json({ message: 'Banco de dados indisponível. Tente novamente em instantes.' });
  }
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).send('Bem-vindo ao sistema');
});

// Healthcheck (usado pelo frontend para detectar backend local)
app.head('/api/health', (req, res) => {
  res.sendStatus(200);
});

app.get('/api/health', (req, res) => {
  const meta = typeof connectDB.getConnectionMeta === 'function' ? connectDB.getConnectionMeta() : {};
  const connError = typeof connectDB.getConnectionError === 'function' ? connectDB.getConnectionError() : null;
  res.json({
    ok: mongoose.connection?.readyState === 1,
    readyState: mongoose.connection?.readyState ?? null,
    dbName: mongoose.connection?.name || meta.dbName || null,
    host: meta.host || null,
    isAtlas: meta.isAtlas ?? null,
    lastError: connError,
  });
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
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/contas-a-pagar', contaAPagarRoutes);
app.use('/api/vencimentos', vencimentoRoutes);
app.use('/api/dividas', dividaRoutes);

const PORT = process.env.PORT || 5006;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
