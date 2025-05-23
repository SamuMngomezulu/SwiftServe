// src/services/websocketService.js
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

let socketInstance = null;

export const useWebSocket = (onMessage) => {
    const { user } = useAuth();
    const socketRef = useRef(null);

    useEffect(() => {
        if (user && !socketInstance) {
            socketInstance = new WebSocket(`wss://your-api.com/realtime?token=${user.token}`);

            socketInstance.onopen = () => {
                console.log('WebSocket connected');
            };

            socketInstance.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (onMessage) onMessage(message);
                } catch (err) {
                    console.error('WebSocket message error:', err);
                }
            };

            socketInstance.onclose = () => {
                console.log('WebSocket disconnected');
                socketInstance = null;
            };

            socketInstance.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socketRef.current = socketInstance;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketInstance = null;
            }
        };
    }, [user, onMessage]);

    return socketRef.current;
};
