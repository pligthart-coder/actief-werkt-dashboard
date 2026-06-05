# Deployment Guide - Actief Werkt Dashboard

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `actief-werkt-dashboard`
3. Description: "Go-live checklist dashboard for Actief Werkt Carerix implementation"
4. Choose **Private** (recommended for internal tools)
5. Click **"Create repository"**

### Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd /Users/Patrick/CascadeProjects/actief-werkt-dashboard
git remote add origin https://github.com/YOUR-USERNAME/actief-werkt-dashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### Step 3: Set Up PostgreSQL Database

**Option A: Vercel Postgres (Easiest)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database" → "Postgres"
3. Name: `actief-werkt-db`
4. Region: Choose closest to your users
5. Copy the `DATABASE_URL` connection string

**Option B: Supabase (Free tier)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection pooling" for serverless)

**Option C: Neon (Free tier)**
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy the connection string

### Step 4: Update Prisma Schema for PostgreSQL

The schema is already configured for SQLite. For production, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
}
```

And update `prisma.config.ts`:

```typescript
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### Step 5: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Root Directory: `./`
5. Build Command: Leave default
6. Output Directory: Leave default

### Step 6: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NEXTAUTH_SECRET=<generate-with-command-below>
NEXTAUTH_URL=https://your-app.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 7: Run Database Migrations

After deployment, run migrations:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run migrations
vercel env pull .env.production
DATABASE_URL="<your-production-db-url>" npx prisma migrate deploy
```

Or use Vercel's "Deployments" → "Functions" → Run migration in a serverless function.

### Step 8: Create First User

Visit your deployed app at `https://your-app.vercel.app` and:
1. Click "Registreer hier"
2. Create your account
3. Start using the dashboard!

## 🔒 Security Recommendations

1. **Change NEXTAUTH_SECRET** - Use a strong random string
2. **Use HTTPS only** - Vercel provides this automatically
3. **Restrict user registration** - Consider adding an invite-only system
4. **Enable 2FA** - Add two-factor authentication for sensitive projects
5. **Regular backups** - Set up automatic database backups

## 📊 Monitoring

- **Vercel Analytics**: Enable in project settings
- **Error Tracking**: Consider adding Sentry
- **Database Monitoring**: Use your database provider's dashboard

## 🔄 Updates & Maintenance

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy the changes!

## 🆘 Troubleshooting

**Build fails:**
- Check environment variables are set correctly
- Ensure DATABASE_URL is accessible from Vercel

**Database connection errors:**
- Verify DATABASE_URL format
- Check database is accessible from external connections
- For Vercel Postgres, ensure connection pooling is enabled

**Authentication issues:**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## 📞 Support

For issues, check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Documentation](https://vercel.com/docs)
