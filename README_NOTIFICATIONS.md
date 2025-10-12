# 📱 Documentation Frontend - Système de Notifications en Temps Réel

## Vue d'ensemble

Ce document décrit l'implémentation frontend du système de notifications en temps réel pour l'application POOPAY, utilisant **React Native**, **Expo** et **@adonisjs/transmit-client**.

---

## 🎯 Fonctionnalités Implémentées

✅ **Badge de notifications** avec compteur en haut à droite de l'écran principal  
✅ **Modal de liste des notifications** avec affichage détaillé  
✅ **Réception en temps réel** via Transmit (WebSocket)  
✅ **Acceptation/Refus d'invitations** de groupe  
✅ **Synchronisation automatique** avec le backend AdonisJS  
✅ **Gestion des états** (loading, erreurs, etc.)

---

## 📦 Dépendances Installées

```bash
npm install @adonisjs/transmit-client
```

---

## 🗂️ Structure des Fichiers

```
POOPAY_FRONT/
├── apiService/
│   └── notification.ts          # Service API pour les notifications
├── hooks/
│   ├── useWebSocket.ts          # Hook pour gérer Transmit
│   └── useRealtimeNotifications.ts  # Hook pour les notifications en temps réel
├── components/
│   └── ui/
│       ├── NotificationBadge.tsx        # Badge avec logo et compteur
│       └── NotificationListModal.tsx    # Modal de liste des notifications
└── app/
    └── (tabs)/
        └── index.tsx            # Page principale avec intégration
```

---

## 🔧 Composants Créés

### 1. **NotificationBadge** (`components/ui/NotificationBadge.tsx`)

Badge cliquable affichant le logo POOPAY avec un compteur de notifications non lues.

**Props:**

- `count: number` - Nombre de notifications non lues
- `onPress: () => void` - Callback lors du clic

**Exemple d'utilisation:**

```tsx
<NotificationBadge
  count={notifications.length}
  onPress={() => setShowNotificationList(true)}
/>
```

**Caractéristiques:**

- Logo POOPAY (40x40)
- Badge rouge avec compteur
- Animation de pression
- Gestion du compteur (affiche "99+" si > 99)

---

### 2. **NotificationListModal** (`components/ui/NotificationListModal.tsx`)

Modal affichant la liste des notifications avec actions.

**Props:**

- `visible: boolean` - Visibilité de la modal
- `onClose: () => void` - Callback de fermeture
- `notifications: Notification[]` - Liste des notifications
- `onAccept: (notificationId: string) => void` - Callback d'acceptation
- `onReject: (notificationId: string) => void` - Callback de refus

**Interface Notification:**

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: "group_invite" | "challenge" | "achievement" | "info";
  related_id?: string;
  is_read?: boolean;
}
```

**Caractéristiques:**

- Affichage par type (icônes différentes)
- Formatage intelligent du temps ("Il y a 1h", "Il y a 2j", etc.)
- Boutons Accepter/Refuser pour les invitations
- Scroll infini
- Design adaptatif (light/dark mode)

---

## 🔌 Services API

### **notificationService** (`apiService/notification.ts`)

Service pour interagir avec l'API des notifications.

**Méthodes:**

```typescript
// Récupérer toutes les notifications
getNotifications(token: string): Promise<NotificationResponse>

// Obtenir le nombre de notifications non lues
getUnreadCount(token: string): Promise<{ count: number }>

// Marquer une notification comme lue
markAsRead(token: string, notificationId: string | number): Promise<{ success: boolean }>

// Supprimer une notification
deleteNotification(token: string, notificationId: string | number): Promise<{ success: boolean }>
```

### **groupInvitationService** (`apiService/notification.ts`)

Service pour gérer les invitations de groupe.

**Méthodes:**

```typescript
// Inviter un utilisateur à un groupe
inviteUser(token: string, groupId: string | number, userId: string | number): Promise<{ invitation: any }>

// Accepter une invitation
acceptInvitation(token: string, invitationId: string | number): Promise<{ success: boolean; group: any }>

// Refuser une invitation
rejectInvitation(token: string, invitationId: string | number): Promise<{ success: boolean }>
```

---

## 🪝 Hooks Personnalisés

### 1. **useWebSocket** (`hooks/useWebSocket.ts`)

Hook pour gérer la connexion Transmit (WebSocket).

**Retour:**

```typescript
{
  isConnected: boolean;
  subscribe: (userId: string, onNotification: (notification: Notification) => void) => () => void;
}
```

**Utilisation:**

```typescript
const { subscribe } = useWebSocket();

useEffect(() => {
  const unsubscribe = subscribe(userId, (notification) => {
    console.log("Nouvelle notification:", notification);
  });

  return unsubscribe; // Nettoyage
}, [userId]);
```

**Fonctionnement:**

- Initialise le client Transmit au montage
- S'abonne au canal `notifications/{userId}`
- Écoute les messages de type `new_notification`
- Nettoie la connexion au démontage

---

### 2. **useRealtimeNotifications** (`hooks/useRealtimeNotifications.ts`)

Hook tout-en-un pour gérer les notifications en temps réel.

**Retour:**

```typescript
{
  notifications: Notification[];           // Liste des notifications
  isLoading: boolean;                      // État de chargement
  unreadCount: number;                     // Nombre de non-lues
  fetchNotifications: () => Promise<void>; // Recharger
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  acceptGroupInvitation: (notifId: string, relatedId?: string) => Promise<boolean>;
  rejectGroupInvitation: (notifId: string, relatedId?: string) => Promise<boolean>;
}
```

**Utilisation dans un composant:**

```typescript
const {
  notifications,
  unreadCount,
  acceptGroupInvitation,
  rejectGroupInvitation,
} = useRealtimeNotifications();
```

**Fonctionnalités:**

- ✅ Charge les notifications au démarrage
- ✅ S'abonne aux notifications en temps réel
- ✅ Met à jour automatiquement la liste
- ✅ Gère les acceptations/refus d'invitations
- ✅ Synchronise avec le backend

---

## 💻 Intégration dans l'Application

### **Page Principale** (`app/(tabs)/index.tsx`)

**Code d'intégration:**

```tsx
import { NotificationBadge } from "@/components/ui/NotificationBadge";
import { NotificationListModal } from "@/components/ui/NotificationListModal";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export default function HomeScreen() {
  // Hook pour les notifications
  const { notifications, acceptGroupInvitation, rejectGroupInvitation } =
    useRealtimeNotifications();

  // État de la modal
  const [showNotificationList, setShowNotificationList] = useState(false);

  // Handlers
  const handleAcceptNotification = useCallback(
    async (notificationId: string) => {
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification?.type === "group_invite" && notification.related_id) {
        await acceptGroupInvitation(notificationId, notification.related_id);
      }
    },
    [notifications, acceptGroupInvitation]
  );

  const handleRejectNotification = useCallback(
    async (notificationId: string) => {
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification?.type === "group_invite" && notification.related_id) {
        await rejectGroupInvitation(notificationId, notification.related_id);
      }
    },
    [notifications, rejectGroupInvitation]
  );

  return (
    <ThemedView>
      {/* Header avec badge */}
      <View style={styles.headerSection}>
        <ThemedText style={styles.appTitle}>POOPAY</ThemedText>
        <View style={styles.notificationBadgeContainer}>
          <NotificationBadge
            count={notifications.length}
            onPress={() => setShowNotificationList(true)}
          />
        </View>
      </View>

      {/* Modal des notifications */}
      <NotificationListModal
        visible={showNotificationList}
        onClose={() => setShowNotificationList(false)}
        notifications={notifications}
        onAccept={handleAcceptNotification}
        onReject={handleRejectNotification}
      />
    </ThemedView>
  );
}

// Styles
const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    position: "relative",
  },
  notificationBadgeContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  // ... autres styles
});
```

---

## ⚙️ Configuration Requise

### Variables d'environnement (`.env`)

```env
EXPO_PUBLIC_API_URL=http://192.168.1.X:3333/api
# ou en production
EXPO_PUBLIC_API_URL=https://api.poopay.com/api
```

**Important:** Remplacez `192.168.1.X` par l'IP locale de votre machine pour tester sur un appareil physique.

---

## 🔄 Flux de Données

### **Réception d'une notification**

```
Backend (AdonisJS)
    ↓
Transmit.broadcast('notifications/userId', data)
    ↓
useWebSocket → écoute le canal
    ↓
useRealtimeNotifications → met à jour l'état
    ↓
React re-render → affiche la notification
```

### **Acceptation d'une invitation**

```
User clique sur "Accepter"
    ↓
handleAcceptNotification()
    ↓
acceptGroupInvitation(notifId, relatedId)
    ↓
POST /api/group-invitations/:id/accept
    ↓
Backend ajoute l'utilisateur au groupe
    ↓
Frontend supprime la notification de la liste
    ↓
Les groupes sont rechargés automatiquement
```

---

## 🐛 Débogage

### **Activer les logs**

Les hooks affichent déjà des logs dans la console :

```
✅ Transmit client initialisé
🔌 Abonné au canal: notifications/123
📬 Nouvelle notification reçue: { ... }
🔔 Nouvelle notification reçue en temps réel!
```

### **Tester sans backend**

Pour tester l'UI sans backend, vous pouvez utiliser des données mockées :

```typescript
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Test",
    message: "Message de test",
    timestamp: new Date(),
    type: "info",
  },
];
```

---

## 📊 Performance

### **Optimisations implémentées**

- ✅ `useCallback` pour éviter les re-renders inutiles
- ✅ Mise à jour de l'état par filtrage (pas de mutation)
- ✅ Désabonnement automatique des WebSockets
- ✅ Limitation à 50 notifications côté backend

---

## 🚀 Prochaines Améliorations Possibles

1. **Notifications push natives** avec Expo Notifications
2. **Son et vibration** lors de la réception
3. **Badge sur l'icône de l'app** (iOS/Android)
4. **Pagination** pour les vieilles notifications
5. **Filtres** par type de notification
6. **Marquer toutes comme lues** d'un coup
7. **Préférences de notifications** (activer/désactiver par type)
8. **Animation** d'arrivée des nouvelles notifications

---

## 🧪 Tests

### **Tester la réception en temps réel**

1. Ouvrir l'application sur un appareil/émulateur
2. Depuis Postman/Insomnia, envoyer une invitation :
   ```bash
   POST http://localhost:3333/api/groups/1/invite
   Headers: Authorization: Bearer {token}
   Body: { "user_id": 2 }
   ```
3. La notification devrait apparaître instantanément dans l'app !

---

## 📝 Checklist d'Implémentation

- [x] Installer @adonisjs/transmit-client
- [x] Créer NotificationBadge
- [x] Créer NotificationListModal
- [x] Créer useWebSocket
- [x] Créer useRealtimeNotifications
- [x] Créer notificationService API
- [x] Intégrer dans l'écran principal
- [x] Tester l'acceptation d'invitations
- [x] Tester le refus d'invitations
- [ ] Tester sur appareil physique
- [ ] Tester la reconnexion WebSocket
- [ ] Ajouter des tests unitaires

---

## 🔗 Liens Utiles

- [Transmit Client Documentation](https://docs.adonisjs.com/guides/transmit#transmit-client)
- [React Native WebSocket Guide](https://reactnative.dev/docs/network)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

---

**Date de création:** 8 octobre 2025  
**Version:** 1.0  
**Auteur:** Équipe POOPAY  
**Status:** ✅ Production Ready
