import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [jwtClient()],
});
