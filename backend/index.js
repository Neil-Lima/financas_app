const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://financasappproject.netlify.app', 'https://financas-app-kappa.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'https://financasappproject.netlify.app', 'https://financas-app-kappa.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas serão importadas e usadas aqui

io.on('connection', (socket) => {
  console.log('Um cliente se conectou');
  
  socket.on('disconnect', () => {
    console.log('Um cliente se desconectou');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = { app, io };
