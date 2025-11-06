import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { io } from 'socket.io-client';

// --- SOCKET SERVER URL ---
const SOCKET_SERVER_URL = 'http://localhost:5000';

// --- Create Context ---
const SocketContext = createContext(null);

// --- Custom Hook ---
export const useSocket = () => useContext(SocketContext);

// --- Provider Component ---
export const SocketProvider = ({ children, token }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // If no token, don't connect
    if (!token) {
      console.warn('[Socket] No auth token yet, not connecting.');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // --- Establish connection ---
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('[Socket] Connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      setIsConnected(false);
    });

    newSocket.on('error', (errorMessage) => {
      console.error('[Socket] Server error:', errorMessage);
    });

    // --- Cleanup on unmount ---
    return () => {
      console.log('[Socket] Cleanup/disconnect.');
      newSocket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  // --- Provide only the socket instance, not the wrapper object ---
  // But keep connection status accessible via attached property.
  const socket = socketRef.current;
  socket && (socket.isConnected = isConnected);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
