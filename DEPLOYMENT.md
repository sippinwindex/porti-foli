# Portfolio Deployment Guide

This guide will help you deploy your Next.js portfolio to Vercel with GitHub and Vercel API integrations.

## Prerequisites

- GitHub account with personal access token
- Vercel account with API token
- Node.js 18+ installed locally

## Environment Variables Setup

### 1. GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token with these scopes:
   - `repo` (for repository access)
   - `user` (for user information)
3. Copy the token and save it as `GITHUB_TOKEN`

### 2. Vercel API Token

1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token
3. Copy the token and save it as `VERCEL_TOKEN`

### 3. Create `.env.local`

Create a `.env.local` file in your project root:

```bash
# Required for GitHub integration
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_USERNAME=sippinwindex

# Required for Vercel integration
VERCEL_TOKEN=your_vercel_api_token_here

# Site configuration
NEXT_PUBLIC_SITE_URL=https://juanfernandez.dev
NEXT_PUBLIC_GITHUB_USERNAME=sippinwindex
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Test the application:**
   - Open http://localhost:3000
   - Check that GitHub data loads correctly
   - Verify Vercel deployment status (if configured)

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial portfolio deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

### Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `GITHUB_TOKEN` | Your GitHub token | For GitHub API access |
| `GITHUB_USERNAME` | `sippinwindex` | Your GitHub username |
| `VERCEL_TOKEN` | Your Vercel token | For Vercel API access |
| `NEXT_PUBLIC_SITE_URL` | Your domain | Your site URL |
| `NEXT_PUBLIC_GITHUB_USERNAME` | `sippinwindex` | Public GitHub username |

## Deployment Verification

After deployment, verify these features work:

1. **GitHub Integration:**
   - Portfolio projects load from GitHub
   - GitHub stats display correctly
   - Repository links work

2. **Vercel Integration:**
   - Deployment status shows for projects
   - Live URLs are accessible

3. **Performance:**
   - Lighthouse score > 90
   - Core Web Vitals are good
   - Images load properly

## Custom Domain Setup

1. **Add domain in Vercel:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update environment variables:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

## Troubleshooting

### GitHub API Issues

**Problem:** GitHub data not loading
**Solution:**
- Check if `GITHUB_TOKEN` is set correctly
- Verify token has required scopes
- Check API rate limits

### Vercel API Issues

**Problem:** Deployment status not showing
**Solution:**
- Verify `VERCEL_TOKEN` is valid
- Check project ID is correct
- Ensure API token has project access

### Build Failures

**Problem:** Build fails on Vercel
**Solution:**
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check TypeScript errors locally first

### Performance Issues

**Problem:** Slow loading times
**Solution:**
- Enable image optimization
- Use proper caching headers
- Optimize bundle size

## Monitoring & Analytics

1. **Vercel Analytics:**
   - Automatically enabled with Vercel deployment
   - View in Vercel dashboard

2. **Speed Insights:**
   - Already integrated via `@vercel/speed-insights`
   - Monitor Core Web Vitals

3. **Error Tracking:**
   - Check Vercel function logs
   - Monitor GitHub API rate limits

## Maintenance

### Regular Updates

1. **Dependencies:**
   ```bash
   npm update
   npm audit fix
   ```

2. **GitHub Token:**
   - Tokens expire - monitor expiration
   - Regenerate as needed

3. **Content Updates:**
   - GitHub data refreshes automatically
   - Project metadata in `lib/project-data.ts`

### Backup

- Repository is automatically backed up to GitHub
- Vercel maintains deployment history
- Export project data if needed

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test GitHub API locally
4. Check network connectivity

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub API Documentation](https://docs.github.com/en/rest)