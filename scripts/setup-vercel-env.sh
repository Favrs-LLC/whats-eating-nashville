#!/bin/bash

# Setup Vercel Environment Variables
# Run this script to set all environment variables in Vercel

echo "🚀 Setting up Vercel environment variables..."

# Database URLs
echo "postgres://postgres:71ghtrf39abg@db.chvyagimodixqppacvwm.supabase.co:6543/postgres?pgbouncer=true" | npx vercel env add DATABASE_URL production
echo "postgres://postgres:71ghtrf39abg@db.chvyagimodixqppacvwm.supabase.co:5432/postgres" | npx vercel env add DIRECT_URL production

# Webhook Authentication
echo "supersecret-bearer-token-change-me" | npx vercel env add WEBHOOK_TOKEN production
echo "replace-me-with-secure-secret" | npx vercel env add WEBHOOK_HMAC_SECRET production

# Admin Authentication  
echo "admin" | npx vercel env add ADMIN_BASIC_AUTH_USER production
echo "willwazhere2021" | npx vercel env add ADMIN_BASIC_AUTH_PASS production

# Site Configuration
echo "https://whatseatingnashville.vercel.app" | npx vercel env add NEXT_PUBLIC_SITE_URL production

# Optional - OpenAI (placeholder)
echo "sk-your-openai-api-key-here" | npx vercel env add OPENAI_API_KEY production

# Optional - Gumloop (placeholder)
echo "https://your-gumloop-enhancer-url" | npx vercel env add GUMLOOP_ENHANCER_URL production
echo "replace-me-with-enhancer-secret" | npx vercel env add ENHANCER_SECRET production

echo "✅ Environment variables set in Vercel!"
echo "🚀 Ready for production deployment!"
