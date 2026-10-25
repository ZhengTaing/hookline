import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// The web app config from Firebase project settings. These values are public by design: access is
// guarded by the Firestore rules (each signed-in user can only read and write their own progress).
const config: Record<string, string> | null = null;

/** Null until the config is filled in. The site then runs in guest mode. */
export const cloud: { auth: Auth; db: Firestore } | null = config
  ? (() => {
      const app = initializeApp(config);
      return { auth: getAuth(app), db: getFirestore(app) };
    })()
  : null;
