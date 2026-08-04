import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/lib/seller-session";

/** Thin proxy to the backend's public OTP-request endpoint - no session/cookie logic. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const res = await fetch(`${BACKEND_API_URL}/api/auth/otp/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: body.phone }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
