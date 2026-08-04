import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_API_URL } from "@/lib/seller-session";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";
import type { SellerUser } from "@/lib/seller-types";

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

/**
 * POST verifies the OTP against the backend and, only for a seller/admin
 * role, sets an httpOnly session cookie (never returned to client JS).
 * Deliberately never forwards a `name` field - the backend only creates a
 * new account when `name` is present for an unrecognized phone, so an
 * unregistered number just 400s instead of the seller login form doubling
 * as a public signup form.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.phone || !body?.code) {
    return NextResponse.json({ error: "Phone and code are required" }, { status: 400 });
  }

  const backendRes = await fetch(`${BACKEND_API_URL}/api/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: body.phone, code: body.code }),
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const user = data.user as SellerUser;
  if (user.role !== "seller" && user.role !== "admin") {
    return NextResponse.json(
      { error: "This login is for authorized sellers only." },
      { status: 403 }
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, data.token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS_SECONDS,
  });

  return NextResponse.json({ user });
}

/** Sign-out: clears the session cookie. */
export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
