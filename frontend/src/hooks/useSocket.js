import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { ensureUserId } from '../services/crudService';

/**
 * Hook para gerenciar conexão WebSocket com Socket.IO
 * @param {string} url - URL do servidor Socket.IO (opcional, usa padrão se não fornecido)
 * @param {object} options - Opções de conexão (ex: auth, query)
 * @returns {object} { socket, isConnected } - Instância do socket e status de conexão
 *
 * Exemplo de uso:
 * const { socket, isConnected } = useSocket();
 * useEffect(() => {
 *   if (socket) {
 *     socket.on('message', handleMessage);
 *     return () => socket.off('message', handleMessage);
 *   }
 * }, [socket]);
 */
export function useSocket(url = null, options = {}) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const userId = ensureUserId();

  // URL padrão baseada no ambiente
  const socketUrl = url || process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

  // ✅ Extrair propriedades específicas para dependências estáveis
  const { 
    enabled = true, 
    autoConnect = true, 
    reconnectionAttempts = 5, 
    reconnectionDelay = 1000,
    auth = {},
    ...restOptions 
  } = options;

  // ✅ Usar JSON.stringify para objetos complexos para evitar re-renders desnecessários
  const authString = JSON.stringify(auth);
  const restOptionsString = JSON.stringify(restOptions);

  useEffect(() => {
    if (!socketUrl || !userId) {
      return;
    }

    // ✅ Verificar se deve conectar baseado nas opções
    const shouldConnect = enabled !== false && autoConnect !== false;
    if (!shouldConnect) {
      return;
    }

    const newSocket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'], // Fallback para polling
      timeout: 20000, // 20s timeout
      reconnectionAttempts,
      reconnectionDelay,
      auth: {
        userId: userId,
        ...JSON.parse(authString)
      },
      ...JSON.parse(restOptionsString),
    });

    socketRef.current = newSocket;

    // Event listeners para status de conexão
    newSocket.on('connect', () => {
      console.log('🔌 Socket conectado:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket desconectado');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔌 Erro de conexão do socket:', error);
      setIsConnected(false);
    });

    // A função de cleanup do useEffect cuidará da desconexão
    // quando o componente for desmontado ou quando as dependências mudarem.
    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [socketUrl, userId, enabled, autoConnect, reconnectionAttempts, reconnectionDelay, authString, restOptionsString]);

  return {
    socket: socketRef.current,
    isConnected
  };
}
