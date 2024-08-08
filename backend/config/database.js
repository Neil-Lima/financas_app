const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Atlas conectado com sucesso ao banco de dados: ${mongoose.connection.name}`);
    await createIndexes();
    await updateDatabaseStructure();
  } catch (error) {
    console.error('Erro de conexão com MongoDB Atlas:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  const collections = ['categorias', 'contas', 'despesas', 'estoques', 'financiamentos', 'metas', 'orcamentos', 'parcelamentos', 'transacoes', 'usuarios'];
  
  for (const collectionName of collections) {
    const collection = mongoose.connection.collection(collectionName);
    await collection.createIndex({ createdAt: 1 });
    await collection.createIndex({ updatedAt: 1 });
  }
  
  console.log('Índices criados com sucesso');
};

const updateDatabaseStructure = async () => {
  const collections = ['categorias', 'contas', 'despesas', 'estoques', 'financiamentos', 'metas', 'orcamentos', 'parcelamentos', 'transacoes', 'usuarios'];
  
  for (const collectionName of collections) {
    const collection = mongoose.connection.collection(collectionName);
    await collection.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: new Date(), updatedAt: new Date() } }
    );
  }
  
  console.log('Estrutura do banco de dados atualizada com sucesso');
};

module.exports = connectDB;
