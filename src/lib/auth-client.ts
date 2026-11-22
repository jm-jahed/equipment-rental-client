import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const rawUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

const API_BASE_URL = rawUrl.replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [jwtClient()],
});
