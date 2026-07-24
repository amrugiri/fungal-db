import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), "", { maxAge: 0, path: "/" });
  return response;
}
