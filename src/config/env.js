// Centralized, runtime-validated environment access for the Vite frontend.
// Only variables prefixed with VITE_ are exposed to the browser by Vite.

const isProd = import.meta.env.PROD;

function formatEnvHelp() {
  return `Create a .env file in the Vite project root (smart-parking-app-GoPerch-/parking-app) or set env vars on your deployment platform.\n` +
    `See .env.example for required keys.`;
}

function requiredViteEnv(key) {
  const value = import.meta.env[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable ${key}.\n${formatEnvHelp()}`);
  }
  return value;
}

function optionalViteEnv(key) {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function urlEnv(key, { fallbackForDev } = {}) {
  const value = optionalViteEnv(key);
  if (value) return value;

  if (!isProd && fallbackForDev) return fallbackForDev;

  throw new Error(`Missing required environment variable ${key}.\n${formatEnvHelp()}`);
}

export const ENV = Object.freeze({
  // Backends
  ZONES_API_BASE_URL: urlEnv("VITE_ZONES_API_BASE_URL", {
    fallbackForDev: "http://localhost:5000",
  }),
  // Reservations API now runs on the same backend server. Keep this for backwards compatibility
  // if someone still sets VITE_RESERVATIONS_API_BASE_URL, but default to the zones base URL.
  RESERVATIONS_API_BASE_URL:
    optionalViteEnv("VITE_RESERVATIONS_API_BASE_URL") ||
    urlEnv("VITE_ZONES_API_BASE_URL", { fallbackForDev: "http://localhost:5000" }),

  // Mapbox (public token, still required for map to function)
  MAPBOX_TOKEN: isProd ? requiredViteEnv("VITE_MAPBOX_TOKEN") : optionalViteEnv("VITE_MAPBOX_TOKEN"),

  // Firebase (public web config, required for auth flow)
  FIREBASE: Object.freeze({
    apiKey: requiredViteEnv("VITE_FIREBASE_API_KEY"),
    authDomain: requiredViteEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: requiredViteEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: requiredViteEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: requiredViteEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: requiredViteEnv("VITE_FIREBASE_APP_ID"),
    measurementId: optionalViteEnv("VITE_FIREBASE_MEASUREMENT_ID"),
  }),
});


