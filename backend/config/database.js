const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Atlas conectado com sucesso ao banco de dados: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Erro de conexão com MongoDB Atlas:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
