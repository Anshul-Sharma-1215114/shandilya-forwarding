// Public - the browser needs a direct path to the backend for this (can't
// be proxied through a Next Server Action per-tile, there'd be far too many
// round trips). Routed through the backend's own caching proxy
// (apps/backend/src/routes/tiles.ts) rather than OpenStreetMap directly -
// OSM's tile usage policy requires a real identifying User-Agent header
// (which browser image requests can't set) and tile caching, neither of
// which a bare <img>/Leaflet fetch from the browser could ever satisfy on
// its own. Same OSM data underneath - this only changes how it's fetched.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export const TILE_URL_TEMPLATE = `${BACKEND_URL}/api/tiles/{z}/{x}/{y}.png`;
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
