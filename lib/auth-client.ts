import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { auth } from "./auth";
import { usernameClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), usernameClient()],
});
