# What’s Eating Nashville — Developer Specification

> Deliverable: a complete, copy‑paste‑able plan for a coding agent (Cursor / Claude Code) to scaffold and implement **whatseatingnashville.com** using **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Prisma + Supabase Postgres**. Includes webhook endpoints for Gumloop, a simple admin, OpenAI hooks, public APIs, seed data, and a clean magazine‑style UI.

---

## 1) Project Overview
**Goal:** Publish articles derived from Nashville food creators’ public Instagram posts and Google Place reviews. Each article credits the creator, embeds the IG post, ties to a **Place** (Google Place ID), and can be updated if duplicate Places are detected.

**Key features**
- Creator profiles with IG links
- Place pages consolidating coverage + review quotes
- Webhook endpoints for Gumloop (create/merge articles)
- Admin UI with simple auth, in‑browser article editor
- Public read APIs for future integrations
- Optional OpenAI utilities to enhance bios/excerpts (server‑side)

**Non‑goals**
- No re‑hosting of IG media (embed or link instead)
- No user accounts (only a simple admin for now)

---

## 2) Tech Stack
- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **DB/ORM:** Supabase Postgres + Prisma ORM
- **Auth (admin + webhooks):** Simple Basic Auth for admin; Bearer/HMAC for webhooks
- **Content editing:** TipTap (rich text) → persisted as **HTML** (`bodyHtml`)
- **Search:** Postgres FTS (tsvector) on `Article.title`, `Article.excerpt`, `Place.name`
- **SEO:** next-seo + JSON‑LD schema
- **Deploy:** Vercel (Edge functions for read APIs allowed; DB interaction stays Node runtime)

---

## 3) Environment Variables
```
DATABASE_URL=postgres://… (Supabase)
DIRECT_URL=postgres://… (optional for Prisma migrate)
WEBHOOK_TOKEN=supersecret-bearer
WEBHOOK_HMAC_SECRET=replace_me
ADMIN_BASIC_AUTH_USER=admin
ADMIN_BASIC_AUTH_PASS=long_random
OPENAI_API_KEY=sk-… (optional now; wire later)
NEXT_PUBLIC_SITE_URL=https://whatseatingnashville.com
GUMLOOP_ENHANCER_URL=https://… (optional)
ENHANCER_SECRET=replace_me
```

---

## 4) Data Model (ERD)
```
Creator 1—* Article *—1 Place
Place   1—* ReviewQuote
SourcePost (raw ingest records)
MergeEvent (duplicate handling log)
WebhookLog (incoming/outgoing webhook observability)
CreatorFollow (optional, email-based follows)
```

### Prisma Schema (core)
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Creator {
  id               String   @id @default(cuid())
  displayName      String
  instagramHandle  String   @unique
  instagramUrl     String
  avatarUrl        String?
  bio              String?
  links            Json?
  isActive         Boolean  @default(true)
  articles         Article[]
  createdAt        DateTime @default(now())
}

model Place {
  id               String   @id @default(cuid())
  googlePlaceId    String   @unique
  name             String
  address          String?
  city             String?
  lat              Float?
  lng              Float?
  mapsUrl          String?
  avgRating        Float?
  reviewCount      Int?
  lastReviewSyncAt DateTime?
  neighborhood     String?
  cuisines         String[] @db.Text[]
  articles         Article[]
  reviews          ReviewQuote[]
  createdAt        DateTime @default(now())
}

model Article {
  id             String   @id @default(cuid())
  slug           String   @unique
  title          String
  excerpt        String?
  bodyHtml       String
  status         String   @default("published") // draft|published|archived
  sourcePlatform String
  sourcePostUrl  String
  sourceUsername String
  publishedAt    DateTime @default(now())
  creatorId      String
  placeId        String
  creator        Creator  @relation(fields: [creatorId], references: [id])
  place          Place    @relation(fields: [placeId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model SourcePost {
  id         String   @id @default(cuid())
  platform   String
  postUrl    String   @unique
  caption    String?
  transcript String?
  mediaType  String?
  mediaUrl   String?
  fetchedAt  DateTime
  hash       String   @unique
  creatorId  String?
  placeId    String?
  createdAt  DateTime @default(now())
}

model ReviewQuote {
  id         String   @id @default(cuid())
  placeId    String
  author     String?
  rating     Int?
  text       String
  reviewedAt DateTime?
  source     String   @default("google")
  place      Place    @relation(fields: [placeId], references: [id])
}

model MergeEvent {
  id                 String   @id @default(cuid())
  canonicalArticleId String
  incomingArticleId  String
  placeId            String
  payloadJson        Json
  createdAt          DateTime @default(now())
}

model WebhookLog {
  id             String   @id @default(cuid())
  source         String
  endpoint       String
  requestIdemKey String?
  statusCode     Int
  ok             Boolean
  bodyJson       Json
  createdAt      DateTime @default(now())
}

model CreatorFollow {
  id         String   @id @default(cuid())
  email      String
  creatorId  String
  creator    Creator  @relation(fields: [creatorId], references: [id])
  createdAt  DateTime @default(now())
  @@unique([email, creatorId])
}
```

---

## 5) Design System (for agent)
**Brand:** clean food‑mag vibe; accent colors `#E8472B` (hot chicken red), `#215E7C` (deep blue).
**Typography:** Playfair Display (headings), Inter (body).
**Layout:** max‑w `1100px`, grid gap `6`, rounded‑2xl card corners, subtle shadow.
**Components (shadcn/ui based):** Button, Card, Badge, DropdownMenu, Input, Textarea, Dialog, Sheet, Tabs.

**Core UI Blocks**
- **NavBar:** Logo text, links: Home, Spots, Creators, Map, About
- **Hero:** three latest Featured articles
- **Feed:** article cards (title, creator chip, place chip, date)
- **CreatorCard:** avatar, name, @handle, primary cuisines, CTA: “View profile”
- **PlaceCard:** name, neighborhood, cuisines (badges), avg rating
- **ArticlePage:** H1, byline/creator chip (link), IG embed, sections (H2), pull‑quotes, place panel (map link)
- **CreatorProfile:** header with avatar, IG link, bio; list of articles
- **PlacePage:** header with name + chips, review summary (quotes), coverage timeline
- **Footer:** About, contact, socials

---

## 6) Routes & Rendering
- `/` — Home (ISR `revalidate: 300`)
- `/articles/[slug]` — Article detail (SSG + ISR)
- `/creators` — Creators index (ISR)
- `/creators/[handle]` — Creator profile (SSG + ISR)
- `/places` — Places index with filters (SSR/ISR hybrid)
- `/places/[placeId]` — Place detail (SSG + ISR)
- `/about` — Static
- `/admin` — Admin index (basic auth)
- `/admin/articles/[id]` — Editor (TipTap)
- `/api/hooks/gumloop/*` — Webhook endpoints
- `/api/public/*` — Read APIs (CORS‑enabled)

---

## 7) API Contracts (Gumloop → WEN)
**Headers (all):**
- `Authorization: Bearer ${WEBHOOK_TOKEN}`
- `X-Idempotency-Key: ${uuid}` (optional)
- `Content-Type: application/json`

### 7.1 Create Article (seed/daily)
`POST /api/hooks/gumloop/articles.create`
```json
{
  "title": "Prince's Hot Chicken: The Line Was Worth It",
  "slug": "princes-hot-chicken-line-worth-it",
  "excerpt": "A spicy pilgrimage on Nolensville Pike…",
  "body_html": "<p>…</p>",
  "tags": ["hot-chicken", "south-nashville"],
  "source": {
    "platform": "instagram",
    "post_url": "https://www.instagram.com/p/ABC123/",
    "username": "nashfoodtours"
  },
  "creator": {
    "instagram_handle": "nashfoodtours",
    "display_name": "Nash Food Tours",
    "instagram_url": "https://instagram.com/nashfoodtours",
    "avatar_url": "https://…/avatar.jpg"
  },
  "place": {
    "google_place_id": "ChIJxxxxxxxxx",
    "name": "Prince's Hot Chicken",
    "maps_url": "https://maps.google.com/?q=ChIJxxxxxxxxx",
    "lat": 36.12,
    "lng": -86.76,
    "address": "5814 Nolensville Pike, Nashville, TN",
    "avg_rating": 4.5,
    "review_count": 2190,
    "review_quotes": [
      {"author": "Jane D.", "rating": 5, "text": "Life-changing heat!", "reviewed_at": "2025-08-15"}
    ]
  },
  "raw": {"caption": "🔥 …", "transcript": "…"}
}
```
**Behavior:**
- Upsert `Creator` (by `instagram_handle`)
- Upsert `Place` (by `google_place_id`)
- Create `Article` (status `published`)
- Save `SourcePost` with SHA256 `hash` of `post_url+caption+transcript`
- **Duplicate place logic:** If `google_place_id` already has another published Article, keep oldest/most complete as **canonical**, create `MergeEvent`, return 202 with canonical info. (Optionally POST to `${GUMLOOP_ENHANCER_URL}` with merge payload.)

**Responses:**
- `201` `{ article_id, slug, canonical: true|false }`
- `202` `{ duplicate: true, canonical_article_id }`
- Errors: `400/401/409/500`

### 7.2 Merge/Update Article (enhancer)
`POST /api/hooks/gumloop/articles.merge`
```json
{
  "canonical_article_id": "art_123",
  "place_id": "plc_456",
  "new_article_fields": {
    "body_html": "<p>Updated with second visit notes…</p>",
    "excerpt": "We went back for the extra hot.",
    "review_quotes": [
      {"author": "Chris K", "rating": 4, "text": "Lines are long but worth it."}
    ],
    "sources": [
      {"platform": "instagram", "post_url": "https://instagram.com/p/XYZ"}
    ]
  }
}
```
**Behavior:** fetch canonical article, merge intelligently (append sections, dedupe quotes), update, log `MergeEvent`. Return `200 { updated: true }`.

### 7.3 Upsert Creator (optional)
`POST /api/hooks/gumloop/creators.upsert`
```json
{
  "instagram_handle": "eastnashbites",
  "display_name": "East Nash Bites",
  "instagram_url": "https://instagram.com/eastnashbites",
  "avatar_url": "https://…/avatar.jpg",
  "bio": "Covering East Nashville eats."
}
```

---

## 8) Public Read APIs (CORS enabled)
- `GET /api/public/articles?limit=20&cursor=…&q=…&neighborhood=…&cuisine=…`
- `GET /api/public/articles/[slug]`
- `GET /api/public/creators?limit=…`
- `GET /api/public/creators/[handle]`
- `GET /api/public/places?limit=…&neighborhood=…&cuisine=…`
- `GET /api/public/places/[placeId]`

All return minimal JSON (IDs, titles, slugs, links, chips) for future apps.

---

## 9) Admin
- Route: `/admin` (Basic Auth using `ADMIN_BASIC_AUTH_USER/PASS`)
- Views: Webhook log table; Article list; Article editor
- **Editor:** TipTap with a constrained toolbar (H2, bold/italic, lists, quotes, links); auto‑save; show source metadata (creator, IG link, place)
- **Actions:** publish/unpublish; re‑generate excerpt; enhance with OpenAI (button)

**Basic Auth middleware** (edge‑safe): protect `/admin` and `/api/admin/*`.

---

## 10) OpenAI Integration (optional hooks)
Server utilities (`lib/ai.ts`) guarded by `OPENAI_API_KEY`:
- `enhanceCreatorBio(bio: string, constraints: {tone: "friendly", length: 120}) => string`
- `summarizeArticle(html: string) => { excerpt: string, tags: string[] }`
- `seoTitleDesc(article) => { title: string, description: string }`

Admin editor exposes buttons to call these and patch the record.

---

## 11) Seed Data

### 11.1 Neighborhoods (suggested list)
- Downtown, The Gulch, SoBro, Midtown, Music Row, East Nashville, 12 South, Germantown, Sylvan Park, Hillsboro Village, West End, Wedgewood‑Houston, Edgehill, Green Hills, Donelson, Opry/Music Valley, Berry Hill, Antioch, Bellevue, Melrose, The Nations, Nolensville Pike (corridor)

### 11.2 Cuisines (tags)
- Hot Chicken, BBQ, Southern, Meat & Three, American, Burgers, Tacos, Mexican, Tex‑Mex, Italian, Pizza, Sushi, Japanese, Chinese, Thai, Indian, Mediterranean, Middle Eastern, Korean, Vietnamese, Seafood, Brunch, Coffee, Bakery, Dessert, Vegan, Vegetarian, Food Truck

**Prisma seed**: create a few `Place` rows with `neighborhood` and `cuisines`, and a few `Creator` rows with handles.

---

## 12) Directory Structure (proposed)
```
app/
  layout.tsx
  page.tsx                      # Home
  (marketing)/about/page.tsx
  articles/[slug]/page.tsx
  creators/page.tsx
  creators/[handle]/page.tsx
  places/page.tsx
  places/[placeId]/page.tsx
  admin/page.tsx                # dashboard
  admin/articles/[id]/page.tsx  # editor
  api/hooks/gumloop/articles.create/route.ts
  api/hooks/gumloop/articles.merge/route.ts
  api/hooks/gumloop/creators.upsert/route.ts
  api/public/articles/route.ts
  api/public/articles/[slug]/route.ts
  api/public/creators/route.ts
  api/public/creators/[handle]/route.ts
  api/public/places/route.ts
  api/public/places/[placeId]/route.ts
components/
  ui/* (shadcn)
  cards/* (ArticleCard, CreatorCard, PlaceCard)
  embeds/InstagramEmbed.tsx
  editor/TipTapEditor.tsx
lib/
  prisma.ts
  auth.ts (basic auth + webhook verify)
  upserts.ts (creator/place helpers)
  articles.ts (create/merge logic)
  webhooks.ts (logging)
  ai.ts (OpenAI helpers)
  seo.ts
prisma/
  schema.prisma
  seed.ts
styles/
  globals.css
```

---

## 13) Key Implementations (sketches)

### 13.1 Webhook Auth & Logging
- Accept either **Bearer** check or **HMAC** signature (`X-Signature: sha256(payload, WEBHOOK_HMAC_SECRET)`)
- Persist a `WebhookLog` row per request
- If `X-Idempotency-Key` provided and previously seen → return previous result

### 13.2 Duplicate Logic
- On `articles.create`, after upserts, query for existing published articles for the same `placeId`.
- If exists and not the same record, mark incoming as duplicate → create `MergeEvent`, return `202`.
- Optionally `fetch(${GUMLOOP_ENHANCER_URL})` with `{canonical_article_id, new_article_fields…}`.

### 13.3 Instagram Embed Component
```tsx
// components/embeds/InstagramEmbed.tsx
'use client';
import { useEffect } from 'react';

export default function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);
  return (
    <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14">
      <a href={url}>View on Instagram</a>
    </blockquote>
  );
}
```

### 13.4 Basic Auth Middleware (admin)
- Wrap admin route segment with a server component check of `Authorization` header against env user/pass; or implement a simple `/admin/login` that sets a signed cookie.

---

## 14) SEO & Feeds
- JSON‑LD: `Article`, `Organization`, `Place`
- `sitemap.xml` and `feed.xml` (RSS/Atom) generated from latest published Articles
- Canonicals from `NEXT_PUBLIC_SITE_URL`

---

## 15) Deployment Steps
1. Create Supabase project; grab `DATABASE_URL`.
2. `npx shadcn-ui@latest init` (install base components)
3. `npx prisma migrate dev` then `prisma db push` (as needed)
4. `pnpm dlx create-next-app` (or npm/yarn) → add Tailwind, shadcn
5. Set env vars on Vercel; connect GitHub repo
6. `vercel --prod` — confirm API routes; run `prisma seed`

---

## 16) Milestones
- **M1 (Scaffold + DB):** schema, seeds, base pages
- **M2 (Webhooks):** create/merge endpoints + logs + dup logic
- **M3 (Frontend polish):** cards, embeds, creator/place pages, filters
- **M4 (Admin):** basic auth, editor, OpenAI buttons
- **M5 (SEO/Launch):** sitemap, feeds, monitoring

---

## 17) Nice‑to‑Have (Later)
- Map view with clustering
- Supabase row‑level security for multi‑admin support
- Image proxy for OG images
- Email digests for followers of specific creators (using CreatorFollow)

---

## 18) Acceptance Criteria (snapshot)
- Webhooks accept Gumloop payloads and create articles with linked Creator + Place
- Duplicate place payload returns 202 and logs MergeEvent
- Article page renders with IG embed, place panel, review quotes
- Admin can edit bodyHtml, toggle publish, and run OpenAI helpers
- Public APIs return JSON for articles/creators/places with CORS
- Seed taxonomies (neighborhoods/cuisines) visible as filters

---

**End of spec.**

