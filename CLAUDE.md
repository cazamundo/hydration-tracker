# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hydration Tracker is a Next.js 16 PWA for tracking water intake and bathroom visits. Built with React 19, TypeScript, and Tailwind CSS 4. Uses Upstash Redis for persistence.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

### Data Flow
- **Server Actions** (`app/actions.ts`) - All Redis operations use "use server" directive
- **Backend**: Upstash Redis via `@upstash/redis` REST API
- **Env vars**: `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- **Data keys**: `drinks:YYYY-MM-DD`, `pees:YYYY-MM-DD` storing arrays of `{ glasses/type, timestamp }`

### Key Files
- `app/page.tsx` - Main entry, tab-based navigation (drink/pee/overview)
- `app/actions.ts` - Server actions: `logDrink()`, `logPee()`, `getStats()`, `deleteDrinkEntry()`, `deletePeeEntry()`, `deleteDay()`, `getTodayEntries()`, `getAllEntries()`, `checkConnection()`
- `components/` - Client components with "use client" directive
- `lib/utils.ts` - `cn()` utility combining clsx + tailwind-merge

### UI Stack
- shadcn/ui components (new-york style) configured in `components.json`
- Radix UI primitives
- lucide-react icons
- next-themes for dark mode
- Path alias: `@/*` maps to project root

## Development Notes

- `next.config.mjs` has `ignoreBuildErrors: true` and `unoptimized: true` for images
- Content includes Dutch language labels (mixed with English)
- PWA manifest at `public/manifest.json`
