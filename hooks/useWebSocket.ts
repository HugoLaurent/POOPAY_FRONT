import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import type { Notification } from '@/components/ui/NotificationListModal';
import { API_BASE_URL } from '@/apiService/config';

// URL du serveur - À configurer selon votre environnement
const SERVER_URL = API_BASE_URL?.replace('/api', '') || 'http://localhost:3333';

interface UseWebSocketReturn {
    isConnected: boolean;
    subscribe: (userId: string, onNotification: (notification: Notification) => void) => () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
    const { token } = useAuth();
    const { profile } = useAppData();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token || !profile?.id) return;

        console.log('🔌 Connexion Socket.IO vers:', SERVER_URL);

        // Créer la connexion Socket.IO
        const socket = io(SERVER_URL, {
            auth: {
                token: token,
                userId: profile.id, // Passer le userId pour l'authentification
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        // Événements de connexion
        socket.on('connect', () => {
            console.log('✅ Socket.IO connecté:', socket.id);
            setIsConnected(true);
        });

        socket.on('connect_error', (error: Error) => {
            console.error('❌ Erreur de connexion Socket.IO:', error.message);
            setIsConnected(false);
        });

        socket.on('disconnect', (reason: string) => {
            console.log('🔌 Socket.IO déconnecté:', reason);
            setIsConnected(false);
        });

        socket.on('reconnect', (attemptNumber: number) => {
            console.log('🔄 Socket.IO reconnecté après', attemptNumber, 'tentatives');
            setIsConnected(true);
        });

        // Nettoyage
        return () => {
            console.log('🧹 Fermeture de la connexion Socket.IO');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token, profile?.id]);

    // Fonction pour s'abonner aux notifications d'un utilisateur
    const subscribe = useCallback((
        userId: string,
        onNotification: (notification: Notification) => void
    ) => {
        if (!socketRef.current) {
            console.warn('⚠️ Socket non initialisé');
            return () => { };
        }

        const socket = socketRef.current;

        // Écouter les nouvelles notifications
        const handleNotification = (data: any) => {
            console.log('📬 Nouvelle notification reçue:', data);

            if (data.type === 'new_notification' && data.notification) {
                // Convertir la date en objet Date
                const notification: Notification = {
                    id: String(data.notification.id),
                    title: data.notification.title,
                    message: data.notification.message,
                    timestamp: new Date(data.notification.created_at || data.notification.createdAt),
                    type: data.notification.type,
                    related_id: data.notification.related_id ? String(data.notification.related_id) : undefined,
                    is_read: data.notification.is_read || data.notification.isRead,
                };

                onNotification(notification);
            }
        };

        socket.on('new_notification', handleNotification);

        console.log(`🔌 Abonné aux notifications de user:${userId}`);

        // Retourner une fonction de désabonnement
        return () => {
            console.log(`🔕 Désabonnement des notifications de user:${userId}`);
            socket.off('new_notification', handleNotification);
        };
    }, []);

    return {
        isConnected,
        subscribe,
    };
};
