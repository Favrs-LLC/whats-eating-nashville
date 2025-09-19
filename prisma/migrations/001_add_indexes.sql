-- Add performance indexes for common queries

-- Article indexes
CREATE INDEX IF NOT EXISTS "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt" DESC);
CREATE INDEX IF NOT EXISTS "Article_creatorId_idx" ON "Article"("creatorId");
CREATE INDEX IF NOT EXISTS "Article_placeId_idx" ON "Article"("placeId");
CREATE INDEX IF NOT EXISTS "Article_slug_idx" ON "Article"("slug");

-- Creator indexes  
CREATE INDEX IF NOT EXISTS "Creator_instagramHandle_idx" ON "Creator"("instagramHandle");
CREATE INDEX IF NOT EXISTS "Creator_isActive_idx" ON "Creator"("isActive");

-- Place indexes
CREATE INDEX IF NOT EXISTS "Place_googlePlaceId_idx" ON "Place"("googlePlaceId");
CREATE INDEX IF NOT EXISTS "Place_neighborhood_idx" ON "Place"("neighborhood");
CREATE INDEX IF NOT EXISTS "Place_cuisines_idx" ON "Place" USING GIN("cuisines");

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS "Article_title_search_idx" ON "Article" USING GIN(to_tsvector('english', "title"));
CREATE INDEX IF NOT EXISTS "Article_excerpt_search_idx" ON "Article" USING GIN(to_tsvector('english', "excerpt"));
CREATE INDEX IF NOT EXISTS "Place_name_search_idx" ON "Place" USING GIN(to_tsvector('english', "name"));

-- Webhook and logging indexes
CREATE INDEX IF NOT EXISTS "WebhookLog_createdAt_idx" ON "WebhookLog"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "WebhookLog_source_endpoint_idx" ON "WebhookLog"("source", "endpoint");
CREATE INDEX IF NOT EXISTS "WebhookLog_requestIdemKey_idx" ON "WebhookLog"("requestIdemKey") WHERE "requestIdemKey" IS NOT NULL;

-- Source post indexes
CREATE INDEX IF NOT EXISTS "SourcePost_hash_idx" ON "SourcePost"("hash");
CREATE INDEX IF NOT EXISTS "SourcePost_postUrl_idx" ON "SourcePost"("postUrl");

-- Review quote indexes
CREATE INDEX IF NOT EXISTS "ReviewQuote_placeId_idx" ON "ReviewQuote"("placeId");
CREATE INDEX IF NOT EXISTS "ReviewQuote_rating_idx" ON "ReviewQuote"("rating") WHERE "rating" IS NOT NULL;
