import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSessionToken } from "./admin-auth";

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}
