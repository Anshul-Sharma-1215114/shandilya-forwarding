// Kept in its own file (no next/headers import) so both src/proxy.ts
// (Proxy runtime) and src/lib/seller-session.ts (Server Components/Actions)
// can share the exact cookie name without importing across those boundaries.
export const SESSION_COOKIE_NAME = "seller_token";
