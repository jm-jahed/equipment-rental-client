/**
 * Centralized API & Base URL Configuration
 * Normalizes environment variables to prevent duplicate `/api` prefixes,
 * trailing slashes, and routing mismatches across local and production Vercel environments.
 */

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "http://localhost:5000";

// Clean base server origin without trailing slash or /api (e.g. "https://equipment-rental-server-delta.vercel.app")
export const API_BASE_URL = rawApiUrl
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

// Standard API root endpoint (e.g. "https://equipment-rental-server-delta.vercel.app/api")
export const API_URL = `${API_BASE_URL}/api`;

/**
 * Generates an absolute API endpoint URL safely.
 * Handles paths starting with or without leading slashes and with or without `/api`.
 *
 * Examples:
 * getApiEndpoint("/equipment") -> "https://domain.com/api/equipment"
 * getApiEndpoint("equipment")   -> "https://domain.com/api/equipment"
 * getApiEndpoint("/api/health") -> "https://domain.com/api/health"
 */
export const getApiEndpoint = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath.startsWith("/api/")) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  return `${API_URL}${cleanPath}`;
};
