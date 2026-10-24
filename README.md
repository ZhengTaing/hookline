# Hookline

A personal music theory course for guitar players. Short daily lessons you can hear, ear training, and a streak for showing up. It's a plain website hosted on GitHub Pages, with login and saved progress from Supabase.

## Run it locally

```sh
npm install
npm run dev
```

Without Supabase values the site runs in **guest mode** and keeps progress in the browser. To use login locally, copy `.env.example` to `.env` and fill in the two values.

## One-time setup

### 1. Supabase (login and saved progress)

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Authentication > URL Configuration**, set **Site URL** to the GitHub Pages address (for example `https://zhengtaing.github.io/hookline/`).
4. In **Project Settings > API**, copy the **Project URL** and the **anon public** key.
5. After you've created your own account on the site, you can turn off **Allow new users to sign up** under **Authentication > Sign In / Providers** so nobody else can register.

The anon key is meant to be public. Your data is protected by the row level security rules in `schema.sql`.

### 2. GitHub Pages

1. In the repo, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
2. In **Settings > Secrets and variables > Actions > Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Push to `main`. The workflow tests, builds and publishes the site.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm test` | Unit tests (streak logic) |
| `npm run build` | Type-check and build to `dist/` |

## Lessons

Lesson content lives in [`src/lessons/content.ts`](src/lessons/content.ts). Each lesson is a list of steps: story cards, sound duels, a timed rush (staff and fretboard questions), and song matching. `npm test` checks that every answer is among its choices.

Lessons are adapted from Robert Hutchinson, *Music Theory for the 21st-Century Classroom* ([musictheory.pugetsound.edu](https://musictheory.pugetsound.edu)), under the GNU Free Documentation License 1.2. Adapted lesson text stays under that license.
