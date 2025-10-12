import { API_BASE_URL } from './config';

export interface NotificationResponse {
    notifications: {
        id: number;
        user_id: number;
        type: 'group_invite' | 'challenge' | 'achievement' | 'info';
        title: string;
        message: string;
        related_id: number | null;
        is_read: boolean;
        created_at: string;
        updated_at: string;
    }[];
    unread_count: number;
}

/**
 * Helper pour faire des requêtes API
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log('🌐 API Request:', {
        method: options.method || 'GET',
        url: url,
        hasAuth: options.headers && 'Authorization' in options.headers,
    });

    const response = await fetch(url, options);

    console.log('📥 API Response:', {
        url: url,
        status: response.status,
        ok: response.ok,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
        console.error('❌ API Error:', error);
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success:', { url, data });
    return data;
}/**
 * Service API pour les notifications
 */
export const notificationService = {
    /**
     * Récupérer toutes les notifications de l'utilisateur
     */
    async getNotifications(token: string): Promise<NotificationResponse> {
        return apiRequest('/notifications', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    /**
     * Obtenir le nombre de notifications non lues
     */
    async getUnreadCount(token: string): Promise<{ count: number }> {
        return apiRequest('/notifications/unread-count', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    /**
     * Marquer une notification comme lue
     */
    async markAsRead(token: string, notificationId: string | number): Promise<{ success: boolean }> {
        return apiRequest(`/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    /**
     * Supprimer une notification
     */
    async deleteNotification(token: string, notificationId: string | number): Promise<{ success: boolean }> {
        return apiRequest(`/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

/**
 * Service API pour les invitations de groupe
 */
export const groupInvitationService = {
    /**
     * Inviter un utilisateur à rejoindre un groupe
     */
    async inviteUser(
        token: string,
        groupId: string | number,
        userId: string | number
    ): Promise<{ invitation: any }> {
        return apiRequest(`/groups/${groupId}/invite`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });
    },

    /**
     * Accepter une invitation de groupe
     */
    async acceptInvitation(
        token: string,
        invitationId: string | number
    ): Promise<{ success: boolean; group: any }> {
        return apiRequest(`/group-invitations/${invitationId}/accept`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    /**
     * Refuser une invitation de groupe
     */
    async rejectInvitation(
        token: string,
        invitationId: string | number
    ): Promise<{ success: boolean }> {
        return apiRequest(`/group-invitations/${invitationId}/reject`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};
