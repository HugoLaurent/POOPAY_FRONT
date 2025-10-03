# 🚽 POOPAY BACKEND - Documentation

> API Backend pour l'application POOPAY - "Gagnez de l'argent en allant aux toilettes !"

## Authentification

### POST /login

**Description :** Connexion utilisateur, retourne un token d'accès.

**Requête :**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (succès) :**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "JeanDupont",
      "email": "user@example.com"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGci..."
  }
}
```

**Réponse (erreur) :**

```json
{
  "status": "error",
  "message": "Identifiants invalides"
}
```

---

### GET /me

**Description :** Retourne les infos de l'utilisateur connecté.

**Headers :**
`Authorization: Bearer {token}`

**Réponse :**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "JeanDupont",
    "email": "user@example.com",
    "hourly_rate": 15.5,
    "currency": "EUR",
    "contract_hours_per_month": 151.67,
    "category_id": 2,
    "department_code": "75"
  }
}
```

---

### GET /users/{id}/today

**Description :** Récupère la session du jour pour un utilisateur.

**Headers :**
`Authorization: Bearer {token}`

**Réponse :**

```json
{
  "status": "success",
  "data": {
    "session": {
      "id": 42,
      "user_id": 1,
      "start_time": "2025-09-29T08:00:00Z",
      "end_time": "2025-09-29T08:10:00Z",
      "status": "completed",
      "duration_seconds": 600,
      "amount_earned": 2.58
    }
  }
}
```

---

# �️ Modèles de données

## Utilisateur (`User`)

| Champ                    | Type    | Description                  |
| ------------------------ | ------- | ---------------------------- |
| id                       | integer | Identifiant unique           |
| username                 | string  | Nom d'utilisateur            |
| email                    | string  | Email                        |
| hourly_rate              | float   | Taux horaire (€)             |
| currency                 | string  | Devise (ex: EUR)             |
| contract_hours_per_month | float   | Heures de contrat mensuelles |
| category_id              | integer | ID de la catégorie           |
| department_code          | string  | Code du département          |

## �📋 Table des matières

## Session (`Session`)

| Champ            | Type    | Description                    |
| ---------------- | ------- | ------------------------------ |
| id               | integer | Identifiant unique             |
| user_id          | integer | ID de l'utilisateur            |
| start_time       | string  | Début de la session (ISO 8601) |
| end_time         | string  | Fin de la session (ISO 8601)   |
| status           | string  | Statut (pending/completed)     |
| duration_seconds | integer | Durée en secondes              |
| amount_earned    | float   | Montant gagné (€)              |

## Statuts d'erreur courants

| Code | Signification         | Exemple de message                 |
| ---- | --------------------- | ---------------------------------- |
| 401  | Non authentifié       | Token manquant ou invalide         |
| 403  | Accès interdit        | Accès refusé                       |
| 404  | Ressource non trouvée | Utilisateur ou session introuvable |
| 422  | Données invalides     | Erreur de validation               |
| 500  | Erreur serveur        | Erreur interne inattendue          |

- [Vue d'ensemble](#vue-densemble)

---

- [Architecture](#architecture)
- [Installation & Configuration](#installation--configuration)
- [Structure du projet](#structure-du-projet)
- [Base de données](#base-de-données)
- [API Endpoints](#api-endpoints)
- [Authentification](#authentification)
- [Développement](#développement)
- [Tests](#tests)
- [Déploiement](#déploiement)

## 🎯 Vue d'ensemble

POOPAY Backend est une API REST développée avec **AdonisJS 6** qui permet aux utilisateurs de :

- ⏱️ Chronométrer leurs sessions aux toilettes
- 💰 Calculer leurs gains basés sur leur salaire horaire
- 👥 Créer des groupes avec leurs amis
- 📊 Suivre leurs statistiques
- 🎯 Gérer des abonnements premium

### Technologies utilisées

- **Framework** : AdonisJS 6 (TypeScript)
- **Base de données** : PostgreSQL
- **ORM** : Lucid ORM
- **Authentification** : Bearer Token (AdonisJS Auth)
- **Validation** : VineJS
- **Tests** : Japa

## 🏗️ Architecture

```
POOPAY_BACK/
├── app/
│   ├── controllers/           # Contrôleurs API
│   ├── middleware/           # Middlewares personnalisés
│   ├── models/              # Modèles Lucid
│   └── exceptions/          # Gestion des erreurs
├── config/                  # Configuration de l'app
├── database/
│   ├── migrations/          # Migrations de base de données
│   └── seeders/            # Données de test
├── start/                   # Points d'entrée
└── tests/                   # Tests unitaires et fonctionnels
```

## 🚀 Installation & Configuration

### Prérequis

- **Node.js** 18+
- **PostgreSQL** 12+
- **npm** ou **yarn**

### Installation

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd POOPAY_BACK

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### Configuration de l'environnement

```env
# .env
PORT=3333
HOST=localhost
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_password
DB_DATABASE=poopay_db

# Authentification
APP_KEY=votre_app_key_32_caracteres
```

### Base de données

```bash
# Créer la base de données
createdb poopay_db

# Exécuter les migrations
node ace migration:run

# Peupler avec des données de test
node ace db:seed
```

## 📁 Structure du projet

### Contrôleurs

- **`AuthController`** : Authentification (login/logout/me)
- **`UsersController`** : Gestion des utilisateurs et sessions

### Modèles

- **`User`** : Utilisateurs de l'application
- **`Session`** : Sessions aux toilettes
- **`Group`** : Groupes d'amis
- **`GroupMember`** : Membres des groupes
- **`Subscription`** : Abonnements premium
- **`Category`** : Secteurs d'activité
- **`DepartmentFr`** : Départements français

### Middlewares

- **`AuthMiddleware`** : Vérification de l'authentification
- **`ForceJsonResponseMiddleware`** : Force les réponses en JSON
- **`ContainerBindingsMiddleware`** : Bindings du conteneur IoC

## 🗄️ Base de données

### Schéma principal

```sql
-- Utilisateurs
users (id, username, email, password_hash, hourly_rate, currency,
       contract_hours_per_month, category_id, department_code)

-- Sessions aux toilettes
-- Sessions aux toilettes
sessions (id, user_id, start_time, end_time, status,
          duration_seconds, amount_earned)

-- Groupes et membres
groups (id, name, admin_user_id, max_members)
group_members (id, group_id, user_id, role, joined_at)

-- Abonnements premium
subscriptions (id, user_id, status, started_at, current_period_start,
               current_period_end, cancel_at_period_end, provider)

-- Données de référence
categories (id, name, description)
departments_fr (code, name, region_code)
```

### Relations principales

- Un **utilisateur** peut avoir plusieurs **sessions**
- Un **utilisateur** peut appartenir à plusieurs **groupes**
- Un **utilisateur** peut avoir un **abonnement** actif
- Chaque **groupe** a un **admin** (utilisateur)

## 🔌 API Endpoints

### Authentification

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

```http
POST /logout
Authorization: Bearer {token}
```

```http
GET /me
Authorization: Bearer {token}
```

### Utilisateurs & Sessions

```http
GET /users/{id}/today
Authorization: Bearer {token}
```

### Réponses

**Succès** :

```json
{
  "status": "success",
  "data": { ... }
}
```

**Erreur** :

```json
{
  "status": "error",
  "message": "Description de l'erreur",
  "errors": { ... }
}
```

## 🔐 Authentification

L'API utilise l'authentification par **Bearer Token** :

1. L'utilisateur se connecte via `/login`
2. L'API retourne un `access_token`
3. Le client inclut le token dans l'en-tête : `Authorization: Bearer {token}`
4. Le middleware `auth` vérifie la validité du token

### Middleware d'authentification

```typescript
// routes protégées
router.get("/protected-route", [Controller, "method"]).use(middleware.auth());
```

## 🛠️ Développement

### Commandes utiles

```bash
# Démarrer en mode développement (hot reload)
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Formatage du code
npm run format

# Vérification des types
npm run typecheck
```

### Migrations

```bash
# Créer une nouvelle migration
node ace make:migration create_table_name

# Exécuter les migrations
node ace migration:run

# Rollback de la dernière migration
node ace migration:rollback
```

### Seeders

```bash
# Créer un seeder
node ace make:seeder SeederName

# Exécuter tous les seeders
node ace db:seed

# Exécuter un seeder spécifique
node ace db:seed --files=SeederName
```

## 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Tests unitaires seulement
npm run test -- --suite=unit

# Tests fonctionnels seulement
npm run test -- --suite=functional

# Tests avec coverage
npm run test -- --coverage
```

### Structure des tests

```
tests/
├── bootstrap.ts           # Configuration des tests
├── unit/                 # Tests unitaires (modèles, services)
└── functional/           # Tests d'intégration (API)
```

## 🚢 Déploiement

### Avec Docker

```bash
# Build de l'image
docker build -t poopay-backend .

# Run avec docker-compose
docker-compose up -d
```

### Variables d'environnement de production

```env
NODE_ENV=production
APP_KEY=votre_clé_de_32_caractères_en_production
DB_HOST=your_production_db_host
DB_PASSWORD=your_secure_password
```

### Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données créée et migrée
- [ ] `APP_KEY` généré et sécurisé
- [ ] CORS configuré pour votre domaine
- [ ] SSL/HTTPS activé
- [ ] Logs de production configurés

## 🤝 Contribution

### Standards de code

- **Langage** : TypeScript strict
- **Style** : Prettier + ESLint
- **Commits** : Messages descriptifs en français
- **Branches** : `feature/nom-feature`, `fix/nom-bug`

### Workflow

1. Fork du projet
2. Créer une branche feature
3. Développer avec tests
4. Pull Request avec description détaillée

## 📝 Notes importantes

### Calcul des gains

Le montant gagné est calculé selon la formule :

```
amount_earned = (duration_seconds / 3600) * hourly_rate
```

### Gestion des fuseaux horaires

Toutes les dates sont stockées en UTC (`timestamptz`) et converties côté client.

### Limitations

- **Groupes gratuits** : Maximum 3 membres
- **Groupes premium** : Illimité
- **Un seul abonnement actif** par utilisateur

## 🐛 Debug & Logs

### Logs de développement

```bash
# Logs en temps réel
npm run dev

# Logs avec niveau debug
DEBUG=* npm run dev
```

### Logs de production

Les logs sont configurés avec Pino et peuvent être redirigés vers un service externe.

---

## 📞 Contact & Support

Pour toute question sur ce backend :

- **Documentation API** : [À compléter avec l'URL Swagger/Postman]
- **Issues** : GitHub Issues
- **Discord/Slack** : [Canal de l'équipe]

---

_Cette documentation est maintenue par l'équipe backend. Dernière mise à jour : $(date)_
