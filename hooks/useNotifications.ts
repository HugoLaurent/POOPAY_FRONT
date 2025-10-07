import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

// Configuration du comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,  // Afficher la bannière en haut
        shouldShowList: true,    // Afficher dans la liste des notifications
        shouldPlaySound: true,   // Jouer un son
        shouldSetBadge: true,    // Afficher un badge sur l'icône
    }),
});

// Vérifier si on est dans Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export interface NotificationPermissionStatus {
    granted: boolean;
    canAskAgain: boolean;
    status: Notifications.PermissionStatus;
}

export function useNotifications() {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>({
        granted: false,
        canAskAgain: true,
        status: Notifications.PermissionStatus.UNDETERMINED,
    });
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
    const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

    useEffect(() => {
        // Vérifier le statut initial des permissions
        checkPermissionStatus();

        // Écouter les notifications reçues
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // Écouter les interactions avec les notifications
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('📱 Notification clicked:', response);
            // Vous pouvez ajouter de la navigation ici
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    const checkPermissionStatus = async () => {
        const { status, canAskAgain } = await Notifications.getPermissionsAsync();
        setPermissionStatus({
            granted: status === 'granted',
            canAskAgain,
            status,
        });
    };

    const requestPermission = async (onPermissionGranted?: () => Promise<void>): Promise<boolean> => {
        console.log('🔔 Demande de permission pour les notifications...');

        if (!Device.isDevice) {
            console.warn('⚠️ Les notifications push nécessitent un appareil physique');
            return false;
        }

        if (isExpoGo) {
            console.warn('⚠️ Expo Go ne supporte plus les notifications push. Utilisez un development build.');
            // On retourne true pour ne pas bloquer l'UI, mais les notifs push ne marcheront pas
            alert('ℹ️ Les notifications push nécessitent un development build et ne fonctionnent pas dans Expo Go.');
            return true;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('📋 Statut actuel des permissions:', existingStatus);

        let finalStatus = existingStatus;

        // Si pas encore demandé, demander la permission
        if (existingStatus !== 'granted') {
            console.log('❓ Permission non accordée, demande à l\'utilisateur...');
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log('📝 Nouvelle permission:', finalStatus);
        }

        const granted = finalStatus === 'granted';

        setPermissionStatus({
            granted,
            canAskAgain: finalStatus === 'undetermined',
            status: finalStatus,
        });

        if (!granted) {
            console.warn('❌ Permission de notification refusée');
            // Si l'utilisateur refuse, on sauvegarde aussi dans AsyncStorage
            try {
                await AsyncStorage.setItem('notification_permission_asked', 'true');
            } catch (e) {
                console.error('Erreur sauvegarde AsyncStorage:', e);
            }
            return false;
        }

        console.log('✅ Permission accordée pour les notifications locales !');

        // Sauvegarder que la permission a été demandée
        try {
            await AsyncStorage.setItem('notification_permission_asked', 'true');
        } catch (e) {
            console.error('Erreur sauvegarde AsyncStorage:', e);
        }

        // Si un callback est fourni, l'appeler pour mettre à jour la BDD
        if (onPermissionGranted) {
            try {
                console.log('💾 Mise à jour de la BDD avec notifications activées...');
                await onPermissionGranted();
            } catch (e) {
                console.error('❌ Erreur lors de la mise à jour de la BDD:', e);
            }
        }

        // Note: Les notifications locales fonctionnent sans push token.
        // Pour activer les notifications push (serveur → app), il faudrait :
        // 1. Configurer Firebase Cloud Messaging (FCM)
        // 2. Obtenir le push token avec getExpoPushTokenAsync()
        // 3. L'envoyer au backend pour stockage

        return true;
    };

    const schedulePushNotification = async (title: string, body: string, delaySeconds = 2) => {
        try {
            // 1. Vérifier si les notifications sont activées dans les settings de l'app
            const notificationsEnabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
            if (notificationsEnabled === 'false') {
                console.warn('⚠️ Notifications désactivées dans les paramètres de l\'app');
                throw new Error('Notifications désactivées dans les paramètres');
            }

            // 2. Vérifier la permission système
            const { status, canAskAgain, granted } = await Notifications.getPermissionsAsync();
            console.log('🔍 Vérification permission:', { status, canAskAgain, granted });

            if (status !== 'granted' && !granted) {
                console.warn('⚠️ Permission système non accordée, notification annulée');
                throw new Error('Permission de notification non accordée');
            }

            console.log(`📅 Programmation d'une notification: "${title}" dans ${delaySeconds}s`);

            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data: { data: 'goes here' },
                },
                trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds },
            });

            console.log(`✅ Notification programmée avec l'ID: ${id}`);
            return id;
        } catch (error) {
            console.error('❌ Erreur lors de la programmation de la notification:', error);
            throw error;
        }
    };

    const cancelAllScheduledNotifications = async () => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            console.log('🗑️ Toutes les notifications programmées ont été annulées');
        } catch (error) {
            console.error('❌ Erreur lors de l\'annulation des notifications:', error);
        }
    };

    return {
        permissionStatus,
        notification,
        requestPermission,
        checkPermissionStatus,
        schedulePushNotification,
        cancelAllScheduledNotifications,
        isExpoGo, // Pour savoir si on est dans Expo Go
    };
}
