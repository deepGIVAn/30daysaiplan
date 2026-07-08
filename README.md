# Dr. Jerome Joseph BOOK HUB

Interactive book experience platform — don't just read, **do**.

## Features

- **30-Day Guided Dashboard** — Daily objectives, action checklists, AI prompts, and reflection journal
- **Progress Tracking** — Visual journey map, phase badges, streak counter, completion certificate
- **AI Brand Coach** — Context-aware chatbot powered by OpenAI, grounded in book content
- **Multi-Book Hub** — Scalable architecture for Dr. Jerome's full catalog (1 live, more coming soon)
- **User Accounts** — Supabase auth with cloud-synced progress across devices

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Copy your project URL and anon key to `.env.local`
4. (Optional) Disable email confirmation in Auth settings for faster dev testing

### 4. Generate book content (already done)

```bash
npm run generate-content
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy

## Project Structure

```
src/
  app/              # Next.js App Router pages & API routes
  components/       # UI, dashboard, chat, auth components
  lib/              # Supabase, OpenAI, RAG, progress helpers
  types/            # TypeScript types
content/
  books/            # Structured book content (JSON)
scripts/
  generate-content.ts   # Generate 30-day JSON from curated data
  extract-pdf-content.ts # PDF extraction (optional)
supabase/
  schema.sql        # Database schema + RLS policies
```

## Books

| Book | Status |
|------|--------|
| The 30-Day AI Personal Brand Plan | Available |
| The Brand Playbook | Coming Soon |
| The AI Customer Acquisition Playbook | Coming Soon |
| Internal Branding | Coming Soon |
| Stand Out! | Coming Soon |
| Get Aligned | Coming Soon |

---

© Global Brand Academy Pte Ltd · Dr. Jerome Joseph
