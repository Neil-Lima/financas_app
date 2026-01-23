const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const envPath = path.resolve(__dirname, '../.env');
if (process.env.NODE_ENV !== 'production' && fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const DEFAULT_DB_NAME = process.env.MONGODB_DB_NAME || 'financas_app';

let lastConnectionMeta = {
  dbName: null,
  host: null,
  isAtlas: null,
  uriRedacted: null,
};

let lastConnectionError = null;

let connectionPromise = null;

const buildConnectionMetaFromUri = (mongoUri) => {
  try {
    const url = new URL(mongoUri);
    const dbName = (url.pathname || '').replace(/^\//, '') || null;
    const host = url.host || null;
    const isAtlas = url.protocol === 'mongodb+srv:';
    const uriRedacted = `${url.protocol}//${host}${url.pathname || ''}${url.search || ''}`;
    return { dbName, host, isAtlas, uriRedacted };
  } catch {
    return { dbName: null, host: null, isAtlas: null, uriRedacted: null };
  }
};

const ensureDbNameInMongoUri = (uri, dbName) => {
  if (!uri || typeof uri !== 'string') return uri;

  const [base, query] = uri.split('?');
  const querySuffix = query ? `?${query}` : '';

  // Se já tem path /<db> após o host, não mexe
  const hasDbName = /mongodb(\+srv)?:\/\/[^/]+\/.+/.test(base);
  if (hasDbName) return `${base}${querySuffix}`;

  // Se não tem /<db>, adiciona
  const normalizedBase = base.endsWith('/') ? `${base}${dbName}` : `${base}/${dbName}`;
  return `${normalizedBase}${querySuffix}`;
};

const getMongoUri = () => {
  const useLocal = String(process.env.USE_LOCAL_DB || '').toLowerCase() === 'true';
  const localUri = process.env.MONGODB_URI_LOCAL;
  const atlasUri = process.env.MONGODB_URI;

  if (useLocal) {
    if (!localUri) {
      throw new Error('USE_LOCAL_DB=true, mas MONGODB_URI_LOCAL não está definido no .env');
    }
    return localUri;
  }

  if (!atlasUri) {
    throw new Error('MONGODB_URI não está definido no .env');
  }
  return ensureDbNameInMongoUri(atlasUri, DEFAULT_DB_NAME);
};

const connectDB = async () => {
  try {
    if (mongoose.connection?.readyState === 1) {
      return;
    }

    // Se já existe uma tentativa de conexão em andamento, reutiliza.
    if (connectionPromise) {
      await connectionPromise;
      return;
    }

    const mongoUri = getMongoUri();

    // Guarda meta do URI mesmo antes de conectar (útil para debug em produção)
    lastConnectionMeta = buildConnectionMetaFromUri(mongoUri);
    lastConnectionError = null;

    connectionPromise = mongoose
      .connect(mongoUri, {
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
        // Força IPv4 (no Nest você usa `family: 4` para evitar problemas de IPv6 em alguns ambientes)
        family: 4,
      })
      .then(() => {
        connectionPromise = null;
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });

    await connectionPromise;
    console.log(
      `MongoDB conectado com sucesso ao banco de dados: ${mongoose.connection.name} | host: ${lastConnectionMeta.host}`
    );
  } catch (error) {
    console.error('Erro de conexão com MongoDB:', error);

    // Mantém um resumo do erro para expor via /api/health (sem vazar credenciais)
    lastConnectionError = {
      name: error?.name || null,
      message: error?.message || String(error),
      code: error?.code || null,
    };
    throw error;
  }
};

connectDB.getConnectionMeta = () => ({ ...lastConnectionMeta });

connectDB.getConnectionError = () => (lastConnectionError ? { ...lastConnectionError } : null);

module.exports = connectDB;
