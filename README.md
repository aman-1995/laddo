# laddo-ecomm

Production-ready Next.js 15 eCommerce scaffold.

## Stack

- **Next.js 15** — App Router, TypeScript, Tailwind CSS, ESLint
- **PostgreSQL** — via Prisma ORM
- **Auth.js v5** — JWT sessions, Google OAuth provider
- **Razorpay** — payment gateway with signature verification
- **BullMQ + ioredis** — background job queues
- **Pino** — structured JSON logging
- **Zod** — runtime validation + inferred TypeScript types

## Setup (local)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in all values (see table below)
```

### 3. Start backing services

```bash
docker compose up db redis -d
```

### 4. Run migrations and generate client

```bash
npm run prisma:migrate
npx prisma generate
```

### 5. Seed sample products

```bash
npm run seed
```

### 6. Start dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## Docker (full stack)

Build and run everything with Docker Compose:

```bash
cp .env.example .env
# Fill in values

docker compose up --build
```

The `app` service depends on `db` and `redis` health checks before starting.

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | Public | Health check |
| GET/POST | `/api/auth/...` | Public | Auth.js handlers |
| GET | `/api/products` | Required | List products |
| POST | `/api/products` | Required | Create product |
| GET | `/api/orders` | Required | Get user orders |
| POST | `/api/orders` | Required | Create order |
| GET | `/api/cart` | Required | Get cart |
| POST | `/api/cart` | Required | Add item to cart |
| DELETE | `/api/cart?productId=` | Required | Remove cart item |

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://laddo:laddo@localhost:5432/laddo_ecomm` |
| `NEXTAUTH_SECRET` | Auth.js signing secret (≥32 chars) | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | From Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret | From Razorpay Dashboard |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `LOG_LEVEL` | Pino log level | `info` |

---

## Module Structure

Each domain module follows the same four-file pattern:

```
modules/<domain>/
  <domain>.events.ts   # event name constants
  <domain>.types.ts    # Zod schemas + inferred TypeScript types
  <domain>.repo.ts     # Prisma queries only — no business logic
  <domain>.service.ts  # business logic, calls repo, throws AppError
```

Modules: `auth`, `users`, `products`, `cart`, `orders`, `payments`, `inventory`