import { cookies } from "next/headers";

const ADMIN_COOKIE = "fungal_admin_session";

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE;
}
