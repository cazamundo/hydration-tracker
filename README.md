# Hydration Tracker

A PWA for tracking water intake and bathroom visits. Built with Next.js 16, React 19, and Tailwind CSS.

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- An Upstash Redis database

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd hydration-tracker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file with your Upstash Redis credentials:
   ```
   KV_REST_API_URL=https://your-database.upstash.io
   KV_REST_API_TOKEN=your-token-here
   ```

   You can get these from the [Upstash Console](https://console.upstash.com/) after creating a Redis database.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

1. Push this repository to GitHub

2. Import the project in [Vercel](https://vercel.com/new)

3. Add environment variables in Vercel project settings:
   - `KV_REST_API_URL` - Your Upstash Redis REST URL
   - `KV_REST_API_TOKEN` - Your Upstash Redis REST token

   Alternatively, use Vercel's [Upstash integration](https://vercel.com/integrations/upstash) to automatically provision and configure a Redis database.

4. Deploy

## Environment Variables

| Variable | Description |
|----------|-------------|
| `KV_REST_API_URL` | Upstash Redis REST API URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST API token |

The app will show a "not connected" indicator if these variables are missing or invalid.
