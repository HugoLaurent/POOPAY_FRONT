import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import type { Notification } from '@/components/ui/NotificationListModal';
import { notificationService, groupInvitationService } from '@/apiService/notification';

/**
 * Hook pour gérer les notifications en temps réel avec Transmit
 */
export const useRealtimeNotifications = () => {
    const { token } = useAuth();
    const { profile } = useAppData();
    const { subscribe } = useWebSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Charger les notifications depuis l'API
    const fetchNotifications = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const data = await notificationService.getNotifications(token);
            console.log('📥 Données brutes du backend:', JSON.stringify(data, null, 2));

            // Convertir les notifications du backend au format frontend
            const formattedNotifications: Notification[] = data.notifications.map((notif) => {
                console.log('🔄 Conversion notification:', {
                    id: notif.id,
                    type: notif.type,
                    related_id: notif.related_id,
                    related_id_type: typeof notif.related_id
                });

                return {
                    id: String(notif.id),
                    title: notif.title,
                    message: notif.message,
                    timestamp: new Date(notif.created_at),
                    type: notif.type,
                    related_id: notif.related_id ? String(notif.related_id) : undefined,
                    is_read: notif.is_read,
                };
            });

            console.log('✅ Notifications formatées:', JSON.stringify(formattedNotifications, null, 2));
            setNotifications(formattedNotifications);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // Charger les notifications au démarrage
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // S'abonner aux notifications en temps réel via Transmit
    useEffect(() => {
        if (!profile?.id) return;

        const unsubscribe = subscribe(String(profile.id), (newNotification: Notification) => {
            console.log('🔔 Nouvelle notification reçue en temps réel!');

            // Ajouter la notification au début de la liste
            setNotifications(prev => [newNotification, ...prev]);
        });

        return unsubscribe;
    }, [profile?.id, subscribe]);

    // Marquer une notification comme lue
    const markAsRead = useCallback(async (notificationId: string) => {
        if (!token) return;

        try {
            await notificationService.markAsRead(token, notificationId);

            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, is_read: true }
                        : notif
                )
            );
        } catch (error) {
            console.error('❌ Erreur lors du marquage comme lu:', error);
        }
    }, [token]);

    // Supprimer une notification
    const deleteNotification = useCallback(async (notificationId: string) => {
        if (!token) return;

        try {
            await notificationService.deleteNotification(token, notificationId);
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
        }
    }, [token]);

    // Accepter une invitation de groupe
    const acceptGroupInvitation = useCallback(async (notificationId: string, relatedId?: string) => {
        console.log('🔄 acceptGroupInvitation appelée:', { notificationId, relatedId, hasToken: !!token });

        if (!token) {
            console.error('❌ Pas de token pour accepter l\'invitation');
            return false;
        }

        if (!relatedId) {
            console.error('❌ Pas de relatedId pour accepter l\'invitation');
            return false;
        }

        try {
            console.log('📤 Envoi requête POST /group-invitations/' + relatedId + '/accept');
            const result = await groupInvitationService.acceptInvitation(token, relatedId);
            console.log('✅ Réponse du serveur:', result);

            // Supprimer la notification de la liste
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));

            // Note: Les groupes seront rechargés automatiquement via le contexte

            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'acceptation:', error);
            return false;
        }
    }, [token]);

    // Refuser une invitation de groupe
    const rejectGroupInvitation = useCallback(async (notificationId: string, relatedId?: string) => {
        console.log('🔄 rejectGroupInvitation appelée:', { notificationId, relatedId, hasToken: !!token });

        if (!token) {
            console.error('❌ Pas de token pour refuser l\'invitation');
            return false;
        }

        if (!relatedId) {
            console.error('❌ Pas de relatedId pour refuser l\'invitation');
            return false;
        }

        try {
            console.log('📤 Envoi requête POST /group-invitations/' + relatedId + '/reject');
            const result = await groupInvitationService.rejectInvitation(token, relatedId);
            console.log('✅ Réponse du serveur:', result);

            // Supprimer la notification de la liste
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));

            return true;
        } catch (error) {
            console.error('❌ Erreur lors du refus:', error);
            return false;
        }
    }, [token]);

    return {
        notifications,
        isLoading,
        unreadCount: notifications.filter(n => !n.is_read).length,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        acceptGroupInvitation,
        rejectGroupInvitation,
    };
};
