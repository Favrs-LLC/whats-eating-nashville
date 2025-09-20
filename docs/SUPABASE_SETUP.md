# Supabase Database Setup Guide

## 🎯 Quick Answer: Environment Variables

Yes, you should update your `.env.local` file with these **Supabase-specific** variables:

```bash
# Supabase Database Configuration
# Get these from your Supabase project dashboard -> Settings -> Database

# Transaction mode connection string (for app queries)
DATABASE_URL="postgresql://postgres.[project-ref]:[db-password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Session mode connection string (for Prisma migrations) 
# Same as above but change port to 5432 and remove pgbouncer params
DIRECT_URL="postgresql://postgres.[project-ref]:[db-password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## 📋 Step-by-Step Setup

### 1. Create Supabase Project
```bash
# You can use the Supabase MCP to create a project
# Or manually create one at https://supabase.com/dashboard
```

### 2. Get Connection Strings
1. Go to your Supabase project dashboard
2. Click **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **Session pooler** connection string

### 3. Configure Environment Variables

**For Transaction Mode (DATABASE_URL):**
- Use port `6543` 
- Add `?pgbouncer=true&connection_limit=1`

**For Session Mode (DIRECT_URL):**
- Use port `5432`
- No additional parameters needed

### 4. Example Real Values
```bash
# Replace these placeholders with your actual values:
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:your_actual_password@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.abcdefghijklmnop:your_actual_password@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## 🔧 Complete .env.local Template

Update your `.env.local` file with:

```bash
# === SUPABASE DATABASE ===
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# === WEBHOOK AUTHENTICATION ===
WEBHOOK_TOKEN=supersecret-bearer-token-change-me
WEBHOOK_HMAC_SECRET=replace-me-with-secure-secret

# === ADMIN AUTHENTICATION ===
ADMIN_BASIC_AUTH_USER=admin
ADMIN_BASIC_AUTH_PASS=long-random-password-change-me

# === OPENAI (OPTIONAL) ===
OPENAI_API_KEY=sk-your-openai-api-key-here

# === SITE CONFIGURATION ===
NEXT_PUBLIC_SITE_URL=http://localhost:3010

# === GUMLOOP INTEGRATION (OPTIONAL) ===
GUMLOOP_ENHANCER_URL=https://your-gumloop-enhancer-url
ENHANCER_SECRET=replace-me-with-enhancer-secret
```

## 🚀 After Database Setup

Once you have your Supabase connection strings:

```bash
# 1. Push the schema to Supabase
npm run db:push

# 2. Generate Prisma client
npm run db:generate

# 3. Seed the database with sample data
npm run db:seed

# 4. Test the connection
npm run dev
```

## 🎯 Why These Variables?

- **DATABASE_URL**: Used by your app for queries (transaction mode with pooling)
- **DIRECT_URL**: Used by Prisma for migrations (session mode, direct connection)
- **pgbouncer=true**: Required for Supabase's connection pooler
- **connection_limit=1**: Required for serverless environments (Vercel)

## 🔍 Troubleshooting

**Common Issues:**
1. **"prepared statements not supported"** → Make sure `pgbouncer=true` is in DATABASE_URL
2. **Migration errors** → Use DIRECT_URL for migrations (port 5432)
3. **Connection timeouts** → Check your password and project-ref are correct

## 🎉 Ready to Go!

Once configured, your application will have:
- ✅ Full database connectivity
- ✅ Working webhook endpoints  
- ✅ Admin panel with real data
- ✅ Public APIs returning actual content
- ✅ Complete editorial workflow

The database schema is already perfect for Supabase - no changes needed!
