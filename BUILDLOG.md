# Build Log — AI Usage

This log documents where AI (Claude) assisted in building this capstone, what it got right, what it got wrong, and what I changed. Kept honest and updated as I build, per the capstone's ground rules.

## Architecture & stack decisions

- Initial stack (Supabase) was replaced with Neon Postgres + Prisma + Auth.js after I confirmed I could only use MongoDB or Neon — documented here because it changed the auth model (Supabase Auth → NextAuth v5 credentials + bcrypt) and removed an entire folder (`supabase/`) that had already been scaffolded.
- Chose Upstash Redis for rate limiting specifically because in-memory rate limiting (e.g. plain `express-rate-limit`) does not work correctly on Vercel's stateless, multi-instance serverless functions — this was flagged by Claude, not something I already knew, and I verified it against [reasoning/source].

## Where AI helped

- (fill in per file/feature as you review and understand it — e.g. "geo fallback chain in `enrich.ts`: understood and can explain the try/catch loop and why it never throws")

## Where AI was wrong / had to be corrected

- `lucide-react` was initially installed as `^1.28.0`, which doesn't match that package's real versioning (it's on the `0.x` line) — caught and corrected to `^0.462.0` in `package.json`.
- (add any other corrections you make while testing)

## What I changed after generation

- (e.g. any UI tweaks, renamed fields, adjusted rate limit thresholds after testing)

## Lines I can explain unprompted

- (before your demo, pick 5–10 specific lines across different files and make sure you can explain them without looking — this is literally what gets tested)
