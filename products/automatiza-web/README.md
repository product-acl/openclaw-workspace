# Automatiza.lat Landing Page

A high-converting, single-page landing site for Automatiza.lat following the Designjoy productized service blueprint.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)

## Project Structure

```
automatiza-web/
├── app/
│   ├── layout.tsx          # Root layout with dark mode
│   ├── page.tsx            # Main landing page (7 sections)
│   └── globals.css         # Global styles & Tailwind
├── public/                 # Static assets
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js         # Static export config
└── README.md
```

## 7-Section Blueprint

1. **Hero**: Ultra-direct H1 with primary CTA
2. **The Pain / Anti-Status Quo**: 3-column problem statement
3. **How it Works**: 3-step process visualization
4. **Scope**: What we do vs What we don't (dual column)
5. **Trust / Founder Note**: Leo's background & credibility
6. **Pricing**: Single massive pricing card
7. **FAQ**: Common questions answered

## Design System

- **Colors**: Dark mode B2B SaaS (gray-950 background, blue-purple gradients)
- **Typography**: Inter font family
- **Spacing**: Consistent 8px grid system
- **Components**: Cards, badges, gradient buttons

## Deployment

### Vercel (Recommended)

1. Push to GitHub/GitLab
2. Import project in Vercel
3. Automatic deployments on push

### Netlify

```bash
npm run build
# Deploy the `out` directory
```

### Build Locally

```bash
npm install
npm run build
npm run start
```

## Development

```bash
npm run dev
# Open http://localhost:3000
```

## Customization

1. **Colors**: Update `tailwind.config.ts` and `globals.css`
2. **Copy**: Edit text in `app/page.tsx`
3. **CTA Links**: Replace button URLs with your Calendly/booking link
4. **Images**: Add to `public/` and update references

## Performance

- Static export (no server required)
- Optimized for Lighthouse scores
- Responsive on all devices
- Fast First Contentful Paint

## License

Proprietary - Built for Automatiza.lat