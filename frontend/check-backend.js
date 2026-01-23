#!/usr/bin/env node

const http = require('http');

const LOCAL_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006';

function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get(`${LOCAL_API_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          resolve({ available: true, dbName: body.dbName, host: body.host });
        } catch {
          resolve({ available: false });
        }
      });
    });
    
    req.on('error', () => {
      resolve({ available: false });
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ available: false });
    });
  });
}

async function main() {
  console.log('');
  console.log('='.repeat(60));
  
  const result = await checkBackend();
  
  if (result.available) {
    console.log('🟢 BACKEND LOCAL DETECTADO');
    console.log(`📍 URL: ${LOCAL_API_URL}`);
    if (result.dbName) {
      console.log(`🗄️  Banco: ${result.dbName}`);
    }
  } else {
    console.log('🔵 BACKEND LOCAL NÃO DISPONÍVEL');
    console.log(`📍 Usando: https://backendfinancas.vercel.app (PRODUÇÃO)`);
  }
  
  console.log('='.repeat(60));
  console.log('');
}

main();
