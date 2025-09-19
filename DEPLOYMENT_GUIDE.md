# Deployment Guide - What's Eating Nashville

## 🚀 Vercel Deployment Setup

### 1. Environment Variables Required

Set these in your Vercel dashboard under Project Settings → Environment Variables:

```bash
# Supabase Database (REQUIRED)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Webhook Authentication (REQUIRED)
WEBHOOK_TOKEN=your-secure-bearer-token
WEBHOOK_HMAC_SECRET=your-secure-hmac-secret

# Admin Authentication (REQUIRED)
ADMIN_BASIC_AUTH_USER=admin
ADMIN_BASIC_AUTH_PASS=your-secure-admin-password

# Site Configuration (REQUIRED)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# OpenAI Integration (OPTIONAL)
OPENAI_API_KEY=sk-your-openai-api-key

# Gumloop Integration (OPTIONAL)
GUMLOOP_ENHANCER_URL=https://your-gumloop-url
ENHANCER_SECRET=your-enhancer-secret
```

### 2. GitHub Actions Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```bash
# Vercel Integration
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=team_v7gIog2tY6SIeFJD8WA7hw2w
VERCEL_PROJECT_ID=prj_your-project-id

# Database (same as Vercel)
DATABASE_URL=your-supabase-connection-string
DIRECT_URL=your-supabase-direct-connection-string

# Authentication
WEBHOOK_TOKEN=your-webhook-token
WEBHOOK_HMAC_SECRET=your-hmac-secret
ADMIN_BASIC_AUTH_USER=admin
ADMIN_BASIC_AUTH_PASS=your-admin-password

# Site URL (will be updated after first deployment)
NEXT_PUBLIC_SITE_URL=https://whats-eating-nashville.vercel.app

# Optional
OPENAI_API_KEY=sk-your-openai-key
GUMLOOP_ENHANCER_URL=your-gumloop-url
ENHANCER_SECRET=your-enhancer-secret
```

### 3. Manual First Deployment

```bash
# Deploy to get the project created
npx vercel deploy

# Deploy to production
npx vercel deploy --prod
```

### 4. Automatic Deployments

Once set up, the GitHub Actions workflow will:

- **On Push to Master**: Deploy to production automatically
- **On Pull Request**: Create preview deployment with comment containing URL
- **Build Verification**: Run tests and build checks before deployment

### 5. Post-Deployment Steps

1. **Update NEXT_PUBLIC_SITE_URL** with your actual Vercel domain
2. **Test webhook endpoints** with your Gumloop integration
3. **Verify admin panel** access with your credentials
4. **Run database seed** if needed: `npm run db:seed`

### 6. Webhook Testing

Your webhook endpoints will be available at:
- `https://your-domain.vercel.app/api/hooks/gumloop/articles.create`
- `https://your-domain.vercel.app/api/hooks/gumloop/articles.merge`
- `https://your-domain.vercel.app/api/hooks/gumloop/creators.upsert`

### 7. Admin Panel Access

- **URL**: `https://your-domain.vercel.app/admin`
- **Credentials**: Use the values you set in environment variables

## 🎯 GitHub Actions Workflow

The workflow (`/.github/workflows/deploy.yml`) automatically:

1. **Builds the project** with all environment variables
2. **Deploys to Vercel** (production for master, preview for PRs)
3. **Comments on PRs** with preview deployment URLs
4. **Runs on every push** and pull request

## 🔒 Security Notes

- All sensitive data is stored in GitHub Secrets
- Environment variables are properly scoped
- Admin routes are protected with Basic Auth
- Webhook endpoints require proper authentication

## 🎉 Ready for Launch!

Once configured, your Nashville food platform will be live with:
- ✅ Automatic deployments on code changes
- ✅ Preview deployments for testing
- ✅ Full database integration
- ✅ Professional admin interface
- ✅ AI-powered content tools
