# Technical Design Document — Multi-Tenant ERP Boilerplate

**Version:** 2.0  
**Last Updated:** 2026-06-03  
**Stack:** Node.js · TypeScript · Express · Sequelize · MySQL · Redis · Ionic · React · Capacitor

---

## 1. System Overview

A multi-tenant ERP platform where a **Platform Admin** manages tenants, and each **Tenant** manages its own companies, branches, departments, and users. Self-signup is available publicly. KYC verification gates full platform access.

### Key Actors

| Actor | Description |
|---|---|
| **Platform Admin** | `isSuperAdmin=true`. Manages all tenants, reviews KYC, approves/rejects. |
| **Tenant Admin** | Has `admin` role within a tenant. Full access to that tenant's data. |
| **Tenant Support** | Has `support` role. Manages users and passwords within the tenant. |
| **Tenant Sales** | Has `sales` role. Read access to companies, notifications, dashboard. |
| **Tenant Accounts** | Has `accounts` role. Manages companies, processes approvals (KYC review). |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Ionic/React)             │
│  Public Pages      │  Protected App (/app/*)          │
│  /                 │  Role-gated menu via hasPermission│
│  /pricing          │  KycGuard → /app/kyc if not KYC  │
│  /signup           │  TabBar shows Approvals tab for   │
│  /features         │  users with approvals.read        │
│  /contact          │                                   │
└────────────────────┼──────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼──────────────────────────────────┐
│                 Backend (Express/TypeScript)            │
│                                                        │
│  /api/v1/public/*   (no auth, no tenant middleware)    │
│  /api/v1/*          (resolveTenant → authenticate →    │
│                      authorize(permission))             │
└────────────────────┬──────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    MySQL (Sequelize)          Redis
    - All entity data          - Permission cache (5 min TTL)
    - Tenant isolation         - Refresh tokens (7 day TTL)
    - Soft deletes             - Tenant cache (5 min TTL)
```

---

## 3. Database Schema

### 3.1 Core Tables

#### `tenants`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(100) | |
| slug | VARCHAR(60) UNIQUE | Login identifier |
| plan | ENUM(starter, professional, enterprise) | |
| status | ENUM(active, inactive, suspended, trial) | |
| kycStatus | ENUM(not_submitted, pending, under_review, approved, rejected) | |
| primaryColor | VARCHAR(7) | |
| trialEndsAt | DATETIME | |

#### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| tenantId | UUID FK → tenants | |
| email | VARCHAR(255) | Unique per tenant |
| firstName / lastName | VARCHAR(100) | |
| password | VARCHAR(255) | bcrypt |
| isSuperAdmin | BOOLEAN | Platform admin flag |
| status | ENUM(active, inactive, suspended) | |

#### `roles`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| tenantId | UUID FK → tenants | Roles are tenant-scoped |
| name / slug | VARCHAR | Unique per tenant |
| isSystem | BOOLEAN | Cannot be deleted |

#### `permissions`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| module | VARCHAR(50) | e.g. `companies` |
| action | VARCHAR(50) | e.g. `read` |
| Unique | (module, action) | Global, not tenant-scoped |

#### `kyc_submissions`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| tenantId | UUID FK UNIQUE | One per tenant |
| businessName / businessType | VARCHAR | |
| status | ENUM(pending, under_review, approved, rejected) | |
| rejectionReason | TEXT | |
| reviewedBy / reviewedAt | UUID / DATETIME | |

### 3.2 Junction Tables
- `role_permissions` — (roleId, permissionId)
- `user_roles` — (userId, roleId)

### 3.3 Supporting Tables
- `companies` — tenantId FK, multiple per tenant
- `branches` — companyId FK
- `departments` — companyId + branchId FK, self-referencing parentId
- `notifications`, `audit_logs`, `files`, `settings`, `menus`

---

## 4. Permission System

### 4.1 Permission Registry (44 total)

| Module | Actions |
|---|---|
| tenants | create, read, update, delete |
| companies | create, read, update, delete |
| branches | create, read, update, delete |
| departments | create, read, update, delete |
| users | create, read, update, delete |
| roles | create, read, update, delete |
| permissions | read, assign |
| menus | create, read, update, delete |
| notifications | read, send |
| audit_logs | read |
| files | create, read, delete |
| settings | read, update |
| dashboard | read |
| kyc | read, submit, review |
| approvals | read, manage |

### 4.2 Role-Permission Matrix — Curtina Tech Solutions

| Permission | Admin | Support | Sales | Accounts |
|---|:---:|:---:|:---:|:---:|
| tenants.* | ✓ | | | |
| companies.read | ✓ | ✓ | ✓ | ✓ |
| companies.create/update | ✓ | | | ✓ |
| branches.read | ✓ | ✓ | ✓ | |
| departments.read | ✓ | ✓ | ✓ | |
| users.read | ✓ | ✓ | | |
| users.create/update | ✓ | ✓ | | |
| users.delete | ✓ | | | |
| roles.* | ✓ | | | |
| notifications.read | ✓ | ✓ | ✓ | ✓ |
| notifications.send | ✓ | ✓ | | |
| audit_logs.read | ✓ | | | |
| files.* | ✓ | | | ✓ |
| settings.read | ✓ | | | ✓ |
| settings.update | ✓ | | | |
| dashboard.read | ✓ | ✓ | ✓ | ✓ |
| kyc.read | ✓ | | | ✓ |
| kyc.submit | ✓ | | | |
| kyc.review | ✓ | | | ✓ |
| approvals.read | ✓ | | | ✓ |
| approvals.manage | ✓ | | | ✓ |

### 4.3 Permission Caching
- On first authenticated request, permissions loaded from DB and cached in Redis: `user_permissions:{userId}:{tenantId}` — TTL 5 min
- Cache invalidated on role assignment change (`deleteCachePattern`)
- `isSuperAdmin=true` stores `['*']` — bypasses all `authorize()` checks

---

## 5. API Reference

### 5.1 Public Endpoints (no auth/tenant)

| Method | Path | Description |
|---|---|---|
| GET | /api/v1/public/plans | List pricing plans |
| GET | /api/v1/public/slug-check/:slug | Check org slug availability |
| POST | /api/v1/public/signup | Create tenant + admin user (atomic transaction) |

### 5.2 Auth Endpoints (tenant-scoped)

| Method | Path | Permission |
|---|---|---|
| POST | /api/v1/auth/login | — |
| POST | /api/v1/auth/refresh | — |
| POST | /api/v1/auth/logout | — |
| GET | /api/v1/auth/me | authenticated |
| POST | /api/v1/auth/forgot-password | — |
| POST | /api/v1/auth/reset-password | — |
| PUT | /api/v1/auth/change-password | authenticated |

### 5.3 User Management

| Method | Path | Permission |
|---|---|---|
| GET | /api/v1/users | users.read |
| GET | /api/v1/users/:id | users.read |
| POST | /api/v1/users | users.create |
| PUT | /api/v1/users/:id | users.update |
| DELETE | /api/v1/users/:id | users.delete |
| PUT | /api/v1/users/:id/roles | users.update + roles.read |
| PUT | /api/v1/users/:id/reset-password | users.update |

> Super admins can pass `?tenantId=xxx` to query users of any tenant.

### 5.4 KYC / Approvals

| Method | Path | Permission |
|---|---|---|
| POST | /api/v1/kyc/submit | kyc.submit |
| GET | /api/v1/kyc/status | authenticated |
| GET | /api/v1/kyc | kyc.read OR approvals.read |
| GET | /api/v1/kyc/pending-count | approvals.read OR approvals.manage |
| PUT | /api/v1/kyc/:id/review | kyc.review |

### 5.5 Other Tenant-Scoped Endpoints

All follow `GET/POST/PUT/DELETE /api/v1/{resource}` pattern with matching `{resource}.{action}` permissions:
- `/tenants`, `/companies`, `/branches`, `/departments`
- `/roles`, `/permissions`
- `/notifications`, `/audit-logs`, `/files`, `/settings`, `/menus`
- `/dashboard/stats`, `/dashboard/activity`

---

## 6. Authentication Flow

```
Login Request
  │
  ├─► resolveTenant (X-Tenant-ID header → slug or UUID → Tenant row)
  │      ↓ Cache: tenant:{identifier} TTL 5min
  │
  ├─► AuthService.login(email, password, tenantId)
  │      ↓ generateAccessToken (JWT, 15min)
  │      ↓ generateRefreshToken (UUID, stored in Redis 7d)
  │      ↓ returns user + tenant.kycStatus
  │
  └─► Client stores: accessToken, refreshToken, kycStatus in Zustand (persisted)

Protected Request
  │
  ├─► resolveTenant → req.tenantId
  ├─► authenticate → verifyAccessToken → req.user
  │      ↓ Redis cache hit? → req.user.permissions from cache
  │      ↓ Cache miss? → DB query → cache write
  │
  └─► authorize('permission.slug') → passes if permissions.includes('*') or includes slug
```

---

## 7. KYC / Approval Workflow

```
Tenant Signs Up
  └─► kycStatus = 'not_submitted'
  └─► KycGuard redirects to /app/kyc

Tenant Submits KYC (POST /kyc/submit, requires kyc.submit)
  └─► kycStatus = 'pending'
  └─► KycPendingPage shown (polls every 30s)

Reviewer (Admin or Accounts role — requires kyc.review)
  └─► PUT /kyc/:id/review { status: 'under_review' }
      └─► kycStatus = 'under_review'
  └─► PUT /kyc/:id/review { status: 'approved' }
      └─► kycStatus = 'approved'
      └─► Redis tenant cache invalidated
      └─► KycPendingPage auto-redirects to /app/home
  └─► PUT /kyc/:id/review { status: 'rejected', rejectionReason: '...' }
      └─► kycStatus = 'rejected'
      └─► KycGuard redirects to /app/kyc for resubmission
```

---

## 8. Frontend Architecture

### 8.1 Route Structure

```
/                    LandingPage      (public)
/features            FeaturesPage     (public)
/pricing             PricingPage      (public)
/contact             ContactPage      (public)
/login               LoginPage        (public)
/signup/*            SignupLayout     (public, 3 steps)
  /signup/plan
  /signup/org
  /signup/account
/app/kyc             KycPage          (ProtectedRoute)
/app/kyc/pending     KycPendingPage   (ProtectedRoute)
/app/*               AppLayout        (KycGuard — requires kycStatus=approved)
  /app/home          HomePage
  /app/dashboard     DashboardPage
  /app/tenants       TenantsPage
  /app/tenants/:id   TenantDetailPage
  /app/companies     CompaniesPage
  /app/users         UsersPage
  /app/users/:id/edit UserFormPage
  /app/approvals     TenantApprovalsPage
  ... (branches, departments, roles, etc.)
```

### 8.2 KycGuard Logic

```
isAuthenticated?
  No  → /login
  Yes → kycStatus?
    not_submitted | rejected → /app/kyc
    pending | under_review   → /app/kyc/pending
    approved                 → render app
```

### 8.3 Permission-Gated Navigation

`HomePage` module list is filtered: `menuItems.filter(item => !item.permission || hasPermission(item.permission))`

| Role | Visible Modules |
|---|---|
| Admin (all `*`) | All 12 modules |
| Support | Companies, Users, Notifications, Settings |
| Sales | Companies, Notifications |
| Accounts | Companies, Approvals, Files, Notifications, Settings |

### 8.4 State Management (Zustand)

```typescript
authStore: {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  permissions: string[]          // e.g. ['companies.read', 'users.read']
  isAuthenticated: boolean
  kycStatus: KycStatus | null
  hasPermission(p: string): boolean  // checks permissions array or '*'
}

tenantStore: {
  tenant: Tenant | null
  tenantId: string | null        // used as X-Tenant-ID header in axios interceptor
}

signupStore: {
  selectedPlan, orgName, orgSlug, firstName, lastName, email, password
  // not persisted — cleared after successful signup
}
```

---

## 9. Seed Data

### 9.1 Default Platform Admin

```
Organisation : default
Email        : admin@demo.com
Password     : admin123
Tenant ID    : (generated UUID)
KYC Status   : approved
```
Run: `npm run seed:default`

### 9.2 Curtina Tech Solutions (Sample Tenant)

```
Organisation : curtina-tech
Plan         : Enterprise
KYC Status   : Approved
Password     : Curtina@123

Users:
  admin@curtina.tech      [Admin]    — all 44 permissions
  support@curtina.tech    [Support]  — users, notifications, companies.read
  sales@curtina.tech      [Sales]    — companies.read, dashboard, notifications
  accounts@curtina.tech   [Accounts] — companies, approvals, kyc.review, files, settings.read

Companies:
  Curtina Tech HQ      (CTH) — Mumbai
  Curtina Logistics    (CTL) — Delhi
  Curtina Finance      (CTF) — Bengaluru
```
Run: `npm run seed:curtina`

---

## 10. Plans & Limits

| | Starter | Professional | Enterprise |
|---|---|---|---|
| Price | Free | $29/mo | $99/mo |
| Companies | 1 | 5 | Unlimited |
| Users | 5 | 50 | Unlimited |
| Branches | 2 | 20 | Unlimited |
| File Uploads | ✗ | ✓ | ✓ |
| Push Notifications | ✗ | ✓ | ✓ |
| WhatsApp | ✗ | ✗ | ✓ |
| API Access | ✗ | ✗ | ✓ |
| Priority Support | ✗ | ✗ | ✓ |

---

## 11. Security

- **JWT** — HS256, 15min access token + 7d refresh token stored in Redis
- **Passwords** — bcrypt (salt rounds 10)
- **Rate limiting** — 100 req/15min globally; 5 signups/hour on `/public/signup`
- **CORS** — restricted to `FRONTEND_URL` env var
- **Helmet** — security headers
- **Tenant isolation** — every query scoped to `tenantId` from JWT (not from client)
- **Permission cache** — 5min TTL, invalidated on role change

---

## 12. Running Locally

### Prerequisites
- Node.js 18+, MySQL 8+ (XAMPP), Redis (Memurai on Windows)

### Backend
```bash
cd backend
cp .env.example .env   # configure DB/Redis credentials
npm install
npm run seed:default   # creates platform admin
npm run seed:curtina   # creates Curtina Tech sample data
npm run dev            # starts on :3000
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev            # starts on :5173
```

### Login Credentials
| URL | Organisation | Email | Password |
|---|---|---|---|
| http://localhost:5173 | `default` | `admin@demo.com` | `admin123` |
| http://localhost:5173 | `curtina-tech` | `admin@curtina.tech` | `Curtina@123` |
| http://localhost:5173 | `curtina-tech` | `accounts@curtina.tech` | `Curtina@123` |

---

## 13. Known Issues / Roadmap

- [ ] Email sending (SMTP) — currently no-ops if SMTP not configured
- [ ] Firebase FCM push notifications — requires Firebase project setup
- [ ] WhatsApp Cloud API — requires Meta business account
- [ ] Plan enforcement — user/company limits defined but not enforced at API level yet
- [ ] Audit log middleware — fires on all write routes but `userId` may be null for some flows
- [ ] Production deployment — `docker-compose.prod.yml` removed; use PM2 + Nginx manually
