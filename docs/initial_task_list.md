# What's Eating Nashville - Development Task List

## Project Setup & Foundation

### 1. Initialize Project
- [x] Create Next.js 14+ app with TypeScript, App Router, and Tailwind CSS
- [x] Initialize Git repository
- [x] Set up project structure according to spec
- [x] Create `.env.local` with all required environment variables
- [x] Set up `.gitignore` to exclude env files and build artifacts

### 2. Database & ORM Setup
- [x] Create Supabase project and obtain connection strings
- [x] Install and configure Prisma with Supabase
- [x] Create complete Prisma schema (all models from spec)
- [x] Run initial migration (schema pushed to Supabase)
- [x] Create seed script with neighborhoods and cuisines data
- [x] Run seed script to populate initial data (3 creators, 3 places seeded)

### 3. Core Dependencies & Configuration
- [x] Install shadcn/ui and initialize with custom theme colors
- [x] Configure Tailwind with brand colors (#E8472B, #215E7C)
- [x] Set up custom fonts (Playfair Display, Inter)
- [x] Install TipTap editor dependencies
- [x] Install additional packages (next-seo, date-fns, etc.)
- [x] Configure TypeScript paths and aliases

## M1: Scaffold + DB (Foundation)

### 4. Database Models & Relations
- [x] Implement Prisma client singleton
- [x] Create type definitions from Prisma schema
- [x] Test all model relationships (confirmed working with Supabase)
- [x] Add database indexes for performance
- [x] Implement full-text search setup for articles/places

### 5. Base Layout & Navigation
- [x] Create root layout with NavBar component
- [x] Implement responsive navigation (Home, Spots, Creators, Map, About)
- [x] Create Footer component with links
- [x] Set up global styles and CSS variables
- [ ] Implement dark mode support (optional)

### 6. Home Page Structure
- [x] Create home page with Hero section
- [x] Implement article feed component
- [ ] Add loading and error states
- [x] Create placeholder content for testing

## M2: Webhooks (API Integration)

### 7. Authentication & Security
- [x] Implement webhook authentication (Bearer token)
- [x] Add HMAC signature verification
- [x] Create basic auth middleware for admin routes
- [x] Set up CORS configuration for public APIs
- [ ] Implement rate limiting (optional)

### 8. Webhook Infrastructure
- [x] Create webhook logging system (WebhookLog model)
- [x] Implement idempotency key handling
- [x] Create error handling and response utilities
- [ ] Set up webhook testing utilities

### 9. Create Article Webhook
- [x] Implement POST /api/hooks/gumloop/articles.create
- [x] Add creator upsert logic
- [x] Add place upsert logic
- [x] Implement article creation with all fields
- [x] Add source post tracking with SHA256 hash
- [x] Implement duplicate place detection
- [x] Add MergeEvent logging
- [x] Handle 201/202 responses correctly
- [x] Add comprehensive error handling

### 10. Merge Article Webhook
- [x] Implement POST /api/hooks/gumloop/articles.merge
- [x] Create intelligent merge logic for content
- [x] Implement review quote deduplication
- [x] Add source tracking for merged articles
- [x] Log merge events properly

### 11. Creator Upsert Webhook
- [x] Implement POST /api/hooks/gumloop/creators.upsert
- [x] Add validation for Instagram handles
- [x] Handle avatar URL updates

## M3: Frontend Polish (UI/UX)

### 12. Component Library
- [x] Create ArticleCard component
- [x] Create CreatorCard component
- [x] Create PlaceCard component
- [ ] Implement Badge component variations
- [ ] Style all shadcn/ui components to match brand

### 13. Article Pages
- [x] Implement article detail page (/articles/[slug]) with real data
- [x] Create InstagramEmbed component
- [x] Add article content rendering (HTML)
- [x] Implement place information panel
- [x] Add review quotes section
- [x] Add social sharing buttons
- [ ] Implement related articles

### 14. Creator Pages
- [x] Create creators index page (/creators) with real data
- [x] Implement creator profile page (/creators/[handle])
- [x] Add creator article list
- [x] Display Instagram link and bio
- [ ] Add follow functionality (stretch goal)

### 15. Place Pages
- [x] Create places index page (/places) with real data
- [x] Implement place detail page (/places/[placeId])
- [x] Add neighborhood and cuisine filters
- [x] Display aggregated reviews
- [x] Show all articles for a place
- [x] Add Google Maps link

### 16. Search & Filtering
- [x] Implement search functionality (UI created)
- [x] Add neighborhood filter dropdown
- [x] Add cuisine filter with badges
- [ ] Create filter state management
- [ ] Add URL parameter persistence

## M4: Admin Interface

### 17. Admin Authentication
- [x] Create admin login page (Basic Auth via middleware)
- [x] Implement basic auth check
- [x] Add session management (Basic Auth)
- [x] Create admin layout wrapper

### 18. Admin Dashboard
- [x] Create admin home (/admin)
- [x] Add webhook logs table
- [x] Display recent articles
- [x] Show system stats

### 19. Article Editor
- [x] Implement TipTap editor setup
- [x] Create article edit page (/admin/articles/[id])
- [x] Add auto-save functionality
- [x] Implement publish/unpublish toggle
- [x] Display source metadata
- [x] Add preview mode

### 20. OpenAI Integration
- [x] Create AI utility functions (lib/ai.ts)
- [x] Add excerpt generation button
- [x] Add bio enhancement button
- [x] Implement SEO title/description generation
- [x] Add loading states for AI operations

## M5: SEO & Launch

### 21. Public APIs
- [x] Implement GET /api/public/articles
- [x] Implement GET /api/public/articles/[slug]
- [x] Implement GET /api/public/creators
- [x] Implement GET /api/public/creators/[handle]
- [x] Implement GET /api/public/places
- [x] Implement GET /api/public/places/[placeId]
- [x] Add pagination and filtering
- [x] Implement proper CORS headers

### 22. SEO & Meta Tags
- [x] Configure next-seo defaults
- [x] Add page-specific meta tags
- [x] Implement JSON-LD for articles
- [x] Add JSON-LD for places
- [x] Add JSON-LD for organization
- [ ] Create Open Graph images

### 23. Feeds & Sitemaps
- [x] Generate dynamic sitemap.xml
- [x] Create RSS feed endpoint
- [x] Add Atom feed support
- [x] Implement robots.txt

### 24. Performance & Optimization
- [x] Implement ISR for appropriate pages
- [x] Add image optimization
- [x] Configure caching headers
- [ ] Add monitoring/analytics
- [x] Optimize database queries

## Testing & Deployment

### 25. Testing
- [ ] Write unit tests for utilities
- [ ] Test webhook endpoints
- [ ] Test authentication flows
- [ ] Add integration tests
- [ ] Manual QA checklist

### 26. Deployment
- [x] Set up Vercel project
- [x] Configure environment variables
- [x] Connect GitHub repository
- [x] Test preview deployments (GitHub Actions workflow)
- [x] Deploy to production (automated via GitHub Actions)
- [x] Verify all endpoints
- [x] Run production seed data

## Nice-to-Have Features (Post-Launch)

### 27. Enhanced Features
- [ ] Map view with restaurant clustering
- [ ] Email digest system for creator follows
- [ ] Image proxy for OG images
- [ ] Multi-admin support with RLS
- [ ] Advanced analytics dashboard
- [ ] Mobile app API extensions

## Notes

- Tasks should be completed in order within each section
- Each completed task should be tested before marking complete
- Update this list as new requirements emerge
- Consider creating Linear tickets for major sections

Last Updated: [Current Date]
