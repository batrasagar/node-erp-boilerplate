# Node ERP Boilerplate

A multi-tenant ERP boilerplate with a Node.js/TypeScript backend and an Ionic/React frontend.

## Tech Stack

**Backend**
- Node.js + TypeScript + Express
- MySQL + Sequelize ORM
- Redis (caching)
- JWT authentication (access + refresh tokens)
- Role-based access control (RBAC)
- Winston logger
- Multer file uploads

**Frontend**
- Ionic + React + TypeScript
- Vite
- Zustand (state management)
- TanStack Query
- Axios
- Capacitor (iOS/Android support)

## Prerequisites

- Node.js 18+
- MySQL 8+
- Redis

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev
```

Server runs at `http://localhost:3000`

### 2. Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and update:

| Variable | Description |
|---|---|
| `DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | MySQL connection |
| `REDIS_HOST` / `REDIS_PASSWORD` | Redis connection |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | JWT signing keys (min 32 chars) |
| `FRONTEND_URL` | Allowed CORS origin |
| `SMTP_*` | Email (nodemailer) |
| `FIREBASE_*` | Push notifications (FCM) |
| `WHATSAPP_*` | WhatsApp Cloud API |

## API Routes

All routes are prefixed with `/api/v1` and require an `x-tenant-id` header.

| Prefix | Resource |
|---|---|
| `/auth` | Login, register, refresh token |
| `/tenants` | Tenant management |
| `/companies` | Companies |
| `/branches` | Branches |
| `/departments` | Departments |
| `/users` | Users |
| `/roles` | Roles |
| `/permissions` | Permissions |
| `/menus` | Menu configuration |
| `/notifications` | Notifications |
| `/audit-logs` | Audit trail |
| `/files` | File uploads |
| `/settings` | Tenant settings |
| `/dashboard` | Dashboard stats |

## Database

Tables are auto-synced on startup in development (`sequelize.sync({ alter: true })`).

## Mobile (Capacitor)

```bash
cd frontend
npm run build
npx cap add android   # or ios
npx cap sync
npx cap open android  # opens Android Studio
```

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/       # DB, Redis, Firebase, email
│       ├── controllers/
│       ├── middleware/   # auth, RBAC, tenant, audit, rate limiter
│       ├── models/       # Sequelize models
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
└── frontend/
    └── src/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── services/
        ├── stores/       # Zustand stores
        └── types/
```
