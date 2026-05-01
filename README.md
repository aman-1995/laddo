# laddo-ecomm

Production-ready Next.js 15 eCommerce scaffold for the Laddo marketplace.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 — App Router, TypeScript, Server Components |
| Styling | Tailwind CSS 3.4 |
| Database | PostgreSQL 15 via Prisma 5 ORM |
| Auth | Auth.js v5 — JWT sessions, Google OAuth |
| Payments | Razorpay — payment initiation & webhook verification |
| Logging | Pino — structured JSON logs |
| Validation | Zod — runtime validation + inferred TypeScript types |

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in required values (see table below)
```

### 3. Start the database

```bash
docker compose up db -d
```

### 4. Run migrations and generate Prisma client

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5. Seed sample data

```bash
npm run seed
```

### 6. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## Docker (full stack)

```bash
cp .env.example .env
# Fill in values

docker compose up --build
```

The `app` service waits for the `db` health check before starting.

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | Public | Health check |
| GET/POST | `/api/auth/...` | Public | Auth.js handlers |
| GET | `/api/products` | Required | List products (paginated, optional `categoryId`) |
| POST | `/api/products` | Required | Create product |
| GET | `/api/orders` | Required | Get authenticated user's orders |
| POST | `/api/orders` | Required | Create order |
| GET | `/api/cart` | Required | Get cart |
| POST | `/api/cart` | Required | Add item to cart |
| DELETE | `/api/cart?productId=` | Required | Remove cart item |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (`postgresql://laddo:laddo@localhost:5432/laddo_ecomm`) |
| `NEXTAUTH_SECRET` | Yes | Auth.js signing secret — generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | OAuth | Google Cloud Console client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth | Google Cloud Console client secret |
| `RAZORPAY_KEY_ID` | Payments | Razorpay Dashboard API key ID |
| `RAZORPAY_KEY_SECRET` | Payments | Razorpay Dashboard API key secret |
| `LOG_LEVEL` | No | Pino log level (default: `info`) |

---

## Module Structure

Each domain module follows a four-file pattern:

```
modules/<domain>/
  <domain>.events.ts   # event name constants
  <domain>.types.ts    # Zod schemas + inferred TypeScript types
  <domain>.repo.ts     # Prisma queries only — no business logic
  <domain>.service.ts  # business logic, calls repo, throws AppError
```

**Modules:** `auth`, `users`, `products`, `cart`, `orders`, `payments`, `inventory`

---

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `npm run prisma:migrate` | Create and apply new migration |
| `npm run seed` | Seed sample products |
