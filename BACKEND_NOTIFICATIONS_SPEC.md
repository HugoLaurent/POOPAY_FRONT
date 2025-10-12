# 📋 Documentation Backend - Système de Notifications en Temps Réel

## Vue d'ensemble

Ce document décrit l'implémentation du système de notifications en temps réel pour l'application POOPAY, utilisant **AdonisJS 6** et **Transmit** (WebSocket).

---

## 1. Installation et Configuration

### Installation de Transmit

```bash
npm install @adonisjs/transmit
node ace configure @adonisjs/transmit
```

### Configuration de Transmit (`start/transmit.ts`)

```typescript
import transmit from "@adonisjs/transmit/services/main";
import type { HttpContext } from "@adonisjs/core/http";

// Autoriser uniquement les utilisateurs à accéder à leur propre canal
transmit.authorize("notifications/*", async (ctx: HttpContext) => {
  const user = ctx.auth.user;
  if (!user) {
    return false;
  }

  // Vérifier que l'utilisateur accède à son propre canal
  const requestedUserId = ctx.params.uid;
  return user.id === requestedUserId;
});
```

---

## 2. Migrations de Base de Données

### Table `notifications`

```typescript
import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "notifications";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.raw("uuid_generate_v4()"));
      table
        .uuid("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table
        .enum("type", ["group_invite", "challenge", "achievement", "info"])
        .notNullable();
      table.string("title", 255).notNullable();
      table.text("message").notNullable();
      table.uuid("related_id").nullable(); // ID du groupe/challenge/etc
      table.boolean("is_read").defaultTo(false);

      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());

      // Index pour optimiser les requêtes
      table.index("user_id");
      table.index("created_at");
      table.index(["user_id", "is_read"]);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
```

### Table `group_invitations`

```typescript
import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "group_invitations";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.raw("uuid_generate_v4()"));
      table
        .uuid("group_id")
        .notNullable()
        .references("id")
        .inTable("groups")
        .onDelete("CASCADE");
      table
        .uuid("inviter_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("invitee_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table
        .enum("status", ["pending", "accepted", "rejected"])
        .defaultTo("pending");

      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());

      // Un utilisateur ne peut avoir qu'une invitation par groupe
      table.unique(["group_id", "invitee_id"]);

      table.index("invitee_id");
      table.index("status");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
```

---

## 3. Modèles Lucid

### `app/models/notification.ts`

```typescript
import { DateTime } from "luxon";
import { BaseModel, column, belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import User from "#models/user";

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare userId: string;

  @column()
  declare type: "group_invite" | "challenge" | "achievement" | "info";

  @column()
  declare title: string;

  @column()
  declare message: string;

  @column()
  declare relatedId: string | null;

  @column()
  declare isRead: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;
}
```

### `app/models/group_invitation.ts`

```typescript
import { DateTime } from "luxon";
import { BaseModel, column, belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import User from "#models/user";
import Group from "#models/group";

export default class GroupInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare groupId: string;

  @column()
  declare inviterId: string;

  @column()
  declare inviteeId: string;

  @column()
  declare status: "pending" | "accepted" | "rejected";

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>;

  @belongsTo(() => User, {
    foreignKey: "inviterId",
  })
  declare inviter: BelongsTo<typeof User>;

  @belongsTo(() => User, {
    foreignKey: "inviteeId",
  })
  declare invitee: BelongsTo<typeof User>;
}
```

---

## 4. Service de Notifications

### `app/services/notification_service.ts`

```typescript
import transmit from "@adonisjs/transmit/services/main";
import Notification from "#models/notification";

export default class NotificationService {
  /**
   * Créer et envoyer une notification en temps réel
   */
  static async sendNotification(
    userId: string,
    data: {
      type: "group_invite" | "challenge" | "achievement" | "info";
      title: string;
      message: string;
      related_id?: string;
    }
  ) {
    // Créer la notification en BDD
    const notification = await Notification.create({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedId: data.related_id,
      isRead: false,
    });

    // Envoyer en temps réel via Transmit
    transmit.broadcast(`notifications/${userId}`, {
      type: "new_notification",
      notification: notification.serialize(),
    });

    console.log(`📤 Notification envoyée à l'utilisateur ${userId}`);

    return notification;
  }

  /**
   * Invitation à un groupe
   */
  static async sendGroupInvitation(
    inviterId: string,
    inviteeId: string,
    groupId: string,
    groupName: string,
    inviterName: string
  ) {
    return await this.sendNotification(inviteeId, {
      type: "group_invite",
      title: "Invitation à un groupe",
      message: `${inviterName} vous a invité à rejoindre le groupe "${groupName}"`,
      related_id: groupId,
    });
  }

  /**
   * Achievement débloqué
   */
  static async sendAchievement(userId: string, achievementTitle: string) {
    return await this.sendNotification(userId, {
      type: "achievement",
      title: "Succès débloqué",
      message: achievementTitle,
    });
  }

  /**
   * Nouveau défi
   */
  static async sendChallenge(
    userId: string,
    challengeTitle: string,
    challengeDescription: string
  ) {
    return await this.sendNotification(userId, {
      type: "challenge",
      title: challengeTitle,
      message: challengeDescription,
    });
  }

  /**
   * Information générale
   */
  static async sendInfo(userId: string, title: string, message: string) {
    return await this.sendNotification(userId, {
      type: "info",
      title,
      message,
    });
  }
}
```

---

## 5. Contrôleurs

### `app/controllers/notifications_controller.ts`

```typescript
import type { HttpContext } from "@adonisjs/core/http";
import Notification from "#models/notification";

export default class NotificationsController {
  /**
   * GET /api/notifications
   * Récupérer toutes les notifications de l'utilisateur
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!;

    const notifications = await Notification.query()
      .where("userId", user.id)
      .orderBy("createdAt", "desc")
      .limit(50);

    const unreadCount = await Notification.query()
      .where("userId", user.id)
      .where("isRead", false)
      .count("* as total");

    return response.ok({
      notifications,
      unread_count: unreadCount[0].$extras.total,
    });
  }

  /**
   * POST /api/notifications/:id/read
   * Marquer une notification comme lue
   */
  async markAsRead({ params, auth, response }: HttpContext) {
    const notification = await Notification.findOrFail(params.id);

    // Vérifier que c'est bien la notification de l'utilisateur
    if (notification.userId !== auth.user!.id) {
      return response.forbidden({ message: "Non autorisé" });
    }

    notification.isRead = true;
    await notification.save();

    return response.ok({ success: true });
  }

  /**
   * DELETE /api/notifications/:id
   * Supprimer une notification
   */
  async destroy({ params, auth, response }: HttpContext) {
    const notification = await Notification.findOrFail(params.id);

    if (notification.userId !== auth.user!.id) {
      return response.forbidden({ message: "Non autorisé" });
    }

    await notification.delete();
    return response.ok({ success: true });
  }

  /**
   * GET /api/notifications/unread-count
   * Obtenir le nombre de notifications non lues
   */
  async unreadCount({ auth, response }: HttpContext) {
    const count = await Notification.query()
      .where("userId", auth.user!.id)
      .where("isRead", false)
      .count("* as total");

    return response.ok({ count: count[0].$extras.total });
  }
}
```

### `app/controllers/group_invitations_controller.ts`

```typescript
import type { HttpContext } from "@adonisjs/core/http";
import GroupInvitation from "#models/group_invitation";
import Group from "#models/group";
import User from "#models/user";
import Notification from "#models/notification";
import NotificationService from "#services/notification_service";

export default class GroupInvitationsController {
  /**
   * POST /api/groups/:groupId/invite
   * Inviter un utilisateur à rejoindre un groupe
   */
  async invite({ params, request, auth, response }: HttpContext) {
    const group = await Group.findOrFail(params.groupId);
    const { user_id: inviteeId } = request.only(["user_id"]);

    // Vérifier que l'invité existe
    const invitee = await User.findOrFail(inviteeId);

    // Vérifier si une invitation existe déjà
    const existingInvitation = await GroupInvitation.query()
      .where("groupId", group.id)
      .where("inviteeId", inviteeId)
      .where("status", "pending")
      .first();

    if (existingInvitation) {
      return response.conflict({
        message: "Une invitation est déjà en attente",
      });
    }

    // Créer l'invitation
    const invitation = await GroupInvitation.create({
      groupId: group.id,
      inviterId: auth.user!.id,
      inviteeId,
      status: "pending",
    });

    // Envoyer la notification en temps réel
    await NotificationService.sendGroupInvitation(
      auth.user!.id,
      inviteeId,
      group.id,
      group.name,
      auth.user!.username
    );

    return response.created({ invitation });
  }

  /**
   * POST /api/group-invitations/:id/accept
   * Accepter une invitation de groupe
   */
  async accept({ params, auth, response }: HttpContext) {
    const invitation = await GroupInvitation.query()
      .where("id", params.id)
      .where("inviteeId", auth.user!.id)
      .where("status", "pending")
      .preload("group")
      .firstOrFail();

    // Ajouter l'utilisateur au groupe
    const group = invitation.group;
    await group.related("members").attach([auth.user!.id]);

    // Mettre à jour l'invitation
    invitation.status = "accepted";
    await invitation.save();

    // Supprimer la notification associée
    await Notification.query()
      .where("userId", auth.user!.id)
      .where("type", "group_invite")
      .where("relatedId", group.id)
      .delete();

    return response.ok({
      success: true,
      group: group.serialize(),
    });
  }

  /**
   * POST /api/group-invitations/:id/reject
   * Refuser une invitation de groupe
   */
  async reject({ params, auth, response }: HttpContext) {
    const invitation = await GroupInvitation.query()
      .where("id", params.id)
      .where("inviteeId", auth.user!.id)
      .where("status", "pending")
      .firstOrFail();

    invitation.status = "rejected";
    await invitation.save();

    // Supprimer la notification associée
    await Notification.query()
      .where("userId", auth.user!.id)
      .where("type", "group_invite")
      .where("relatedId", invitation.groupId)
      .delete();

    return response.ok({ success: true });
  }
}
```

---

## 6. Routes

### `start/routes.ts`

```typescript
import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";

// Routes protégées (nécessitent une authentification)
router
  .group(() => {
    // Notifications
    router.get("/notifications", [NotificationsController, "index"]);
    router.get("/notifications/unread-count", [
      NotificationsController,
      "unreadCount",
    ]);
    router.post("/notifications/:id/read", [
      NotificationsController,
      "markAsRead",
    ]);
    router.delete("/notifications/:id", [NotificationsController, "destroy"]);

    // Invitations de groupe
    router.post("/groups/:groupId/invite", [
      GroupInvitationsController,
      "invite",
    ]);
    router.post("/group-invitations/:id/accept", [
      GroupInvitationsController,
      "accept",
    ]);
    router.post("/group-invitations/:id/reject", [
      GroupInvitationsController,
      "reject",
    ]);
  })
  .prefix("/api")
  .middleware([middleware.auth()]);
```

---

## 7. Exemples d'Utilisation

### Envoyer une notification lors d'un événement

```typescript
// Exemple : Quand un utilisateur bat un record
import NotificationService from "#services/notification_service";

// Dans votre contrôleur de sessions
export default class SessionsController {
  async store({ auth, request, response }: HttpContext) {
    // ... logique de création de session ...

    // Si c'est un nouveau record
    if (isNewRecord) {
      await NotificationService.sendAchievement(
        auth.user!.id,
        "🎉 Nouveau record personnel ! Vous avez gagné 15,50€ aujourd'hui!"
      );
    }

    return response.created({ session });
  }
}
```

### Inviter un utilisateur à un groupe

```typescript
// POST /api/groups/abc-123/invite
// Body: { "user_id": "user-uuid-456" }

// La notification sera automatiquement envoyée en temps réel à l'utilisateur invité
```

---

## 8. Tests

### Test du service de notifications

```typescript
import { test } from "@japa/runner";
import NotificationService from "#services/notification_service";
import Notification from "#models/notification";

test.group("Notification Service", () => {
  test("should create and broadcast notification", async ({ assert }) => {
    const userId = "test-user-id";

    const notification = await NotificationService.sendNotification(userId, {
      type: "info",
      title: "Test",
      message: "Message de test",
    });

    assert.exists(notification.id);
    assert.equal(notification.userId, userId);
    assert.equal(notification.type, "info");
  });
});
```

---

## 9. Cron Jobs (Optionnel)

### Nettoyage automatique des anciennes notifications

```typescript
// app/tasks/clean_old_notifications.ts
import { DateTime } from "luxon";
import Notification from "#models/notification";

export default class CleanOldNotifications {
  static async run() {
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 });

    const deleted = await Notification.query()
      .where("isRead", true)
      .where("createdAt", "<", thirtyDaysAgo.toSQL())
      .delete();

    console.log(`🧹 ${deleted} notifications supprimées`);
  }
}
```

---

## 10. Variables d'Environnement

Ajouter dans `.env` :

```env
# Transmit Configuration
TRANSMIT_ENABLED=true
TRANSMIT_HOST=0.0.0.0
TRANSMIT_PORT=3333
```

---

## 11. Checklist d'Implémentation

- [ ] Installer @adonisjs/transmit
- [ ] Créer les migrations (notifications + group_invitations)
- [ ] Créer les modèles Lucid
- [ ] Implémenter NotificationService
- [ ] Créer les contrôleurs
- [ ] Ajouter les routes
- [ ] Configurer l'autorisation Transmit
- [ ] Tester les notifications en temps réel
- [ ] Implémenter le cron job de nettoyage (optionnel)

---

## 12. Documentation Supplémentaire

- [AdonisJS Transmit Documentation](https://docs.adonisjs.com/guides/transmit)
- [Lucid ORM Documentation](https://lucid.adonisjs.com/)

---

**Date de création:** 8 octobre 2025  
**Version:** 1.0  
**Auteur:** Équipe POOPAY
