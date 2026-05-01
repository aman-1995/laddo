# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # start Next.js dev server (http://localhost:3000)
npm run build            # production build
npm run lint             # ESLint

npm run prisma:generate  # regenerate Prisma client after schema changes
npm run prisma:migrate   # create and apply a new migration
npm run seed             # seed the DB with sample products (scripts/seed.ts)

docker compose up db -d  # start PostgreSQL only (Redis has been removed)
docker compose up --build  # full stack
```

There is no test suite yet.

## Architecture

### Module pattern

All business logic lives in `modules/<domain>/` and follows a strict four-file layout:

```
<domain>.events.ts   — event name string constants (for future job queues)
<domain>.types.ts    — Zod schemas; TypeScript types are inferred from them
<domain>.repo.ts     — Prisma queries only, no business logic
<domain>.service.ts  — business logic; calls the repo; throws AppError
```

**Modules:** `auth`, `users`, `products`, `cart`, `orders`, `payments`, `inventory`

API route handlers in `app/api/` are thin: they validate input with the Zod schemas from `.types.ts`, call the relevant service, and map errors to HTTP responses. Keep business logic out of route files.

### Error handling

`lib/errors/app-error.ts` exports `AppError` with factory methods:

```ts
AppError.badRequest('message')   // 400
AppError.unauthorized()          // 401
AppError.forbidden()             // 403
AppError.notFound('message')     // 404
AppError.conflict('message')     // 409
AppError.internal('message')     // 500
```

API routes catch `AppError` and return `{ error: message }` at its `statusCode`. Zod `ZodError`s return 400 with `{ error: string, details: ZodIssue[] }`. Everything else is logged and returned as 500.

### Auth & middleware

`middleware.ts` guards all `/api/*` routes via Auth.js JWT validation. Public exceptions: `/api/auth/*` and `/api/health`. Session contains `user.id` (injected via the session callback in `lib/auth/auth.ts`). Route handlers retrieve the session with `auth()` from `lib/auth/auth.ts`.

### Database

Prisma schema is at `prisma/schema.prisma`. The singleton client is at `lib/db/prisma.ts`. All monetary values are stored in **paise** (Indian sub-unit); use `lib/utils/index.ts#formatPaise()` to format for display.

Key schema relationships:
- `ProductVariant` is the purchasable unit (price, SKU, stock) — not `Product`
- `Inventory` tracks stock per variant; `InventoryLog` is append-only for audit
- `CartItem` has a unique constraint on `(userId, variantId)`
- `Comment` is polymorphic — it can target `RecipeVideo`, `RecipeImage`, `ProductImage`, or `VendorReview` via nullable foreign keys
- Prices are stored as `Int` (paise); `ProductVariant.price` is selling price, `mrp` is list price

### Shared libraries

| Path | Purpose |
|------|---------|
| `lib/auth/auth.ts` | NextAuth config; export `auth` and handlers |
| `lib/db/prisma.ts` | Singleton PrismaClient |
| `lib/errors/app-error.ts` | AppError class |
| `lib/logger/logger.ts` | Pino instance; use this, not `console.log` |
| `lib/payments/razorpay.ts` | Razorpay client |
| `lib/utils/index.ts` | `formatPaise()` |
| `config/env.ts` | Zod-validated env; import `env` from here instead of `process.env` |

### Adding a new domain module

1. Create `modules/<domain>/` with the four files above
2. Define Zod schemas in `.types.ts`; export inferred types alongside them
3. Write Prisma queries in `.repo.ts`; return raw Prisma objects or mapped types
4. Write business logic in `.service.ts`; throw `AppError` for expected failures
5. Add API route(s) under `app/api/<domain>/route.ts`
