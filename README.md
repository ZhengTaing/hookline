# Hookline

A personal music theory course for guitar players. Short daily lessons you can hear, ear training, and a streak for showing up. It's a plain website hosted on GitHub Pages, with Google sign-in and saved progress from Firebase.

## Run it locally

```sh
npm install
npm run dev
```

Until the Firebase config in [`src/firebase.ts`](src/firebase.ts) is filled in, the site runs in **guest mode** and keeps progress in the browser.

## One-time setup

### 1. Firebase (sign-in and saved progress)

1. Create a free project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication**: enable the **Google** provider, and add `zhengtaing.github.io` under **Settings > Authorized domains**.
3. **Firestore Database**: create a database in production mode, then publish these rules:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /progress/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

4. **Project settings > Your apps**: register a web app and paste its `firebaseConfig` into `src/firebase.ts`. These values are meant to be public; the rules above protect the data.

Progress is one document per user at `progress/{uid}`. On first sign-in, progress already played on that device as a guest carries over.

### 2. GitHub Pages

In the repo, go to **Settings > Pages** and set **Source** to **GitHub Actions**. Every push to `main` tests, builds and publishes the site.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm test` | Unit tests (streak logic) |
| `npm run build` | Type-check and build to `dist/` |

## Lessons

Lesson content lives in [`src/lessons/content.ts`](src/lessons/content.ts). Each lesson is a list of steps: story cards, sound duels, a timed rush (staff and fretboard questions), and song matching. `npm test` checks that every answer is among its choices.

Lessons are adapted from Robert Hutchinson, *Music Theory for the 21st-Century Classroom* ([musictheory.pugetsound.edu](https://musictheory.pugetsound.edu)), under the GNU Free Documentation License 1.2. Adapted lesson text stays under that license.
