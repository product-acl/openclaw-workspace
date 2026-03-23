# Deployment Guide

## Quick Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js
   - Click "Deploy"

3. **Set Custom Domain** (Optional)
   - In Vercel project settings → Domains
   - Add `automatiza.lat` (point DNS to Vercel)

## Environment Setup

No environment variables needed (static site).

## Post-Deployment Checklist

- [ ] Update Calendly link in CTAs (search for "Book a Fit Call")
- [ ] Verify all links work
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Set up analytics (Plausible/Google Analytics)

## Manual Build & Test

```bash
# Install dependencies
npm install

# Development server
npm run dev
# Open http://localhost:3000

# Production build
npm run build

# Serve built site
npm run start
```

## File Structure for Reference

```
out/                    # Built static files (after npm run build)
├── index.html         # Main page
├── _next/            # Next.js assets
└── favicon.ico       # Default favicon
```

## Custom Domain Setup

### If using Vercel:
1. Add domain in Vercel dashboard
2. Update DNS records as instructed
3. Wait for SSL certificate (automatic)

### If using Netlify/other:
1. Build: `npm run build`
2. Deploy `out/` directory
3. Configure domain in host settings

## Performance Notes

- Site is statically exported (fastest possible)
- No server-side rendering needed
- All assets optimized during build
- Score target: 95+ Lighthouse