// Hand-duplicated from shandilya-mobile/apps/mobile/src/lib/route-deviation.ts -
// see bearing.ts's note on why this isn't shared across the repo boundary.
import type { LatLng } from "./bearing";

const EARTH_RADIUS_M = 6371000;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversineMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

function distanceToSegmentMeters(point: LatLng, a: LatLng, b: LatLng): number {
  const metersPerDegLat = 111320;
  const metersPerDegLng = 111320 * Math.cos(toRad(point.lat));

  const toXY = (p: LatLng) => ({ x: (p.lng - a.lng) * metersPerDegLng, y: (p.lat - a.lat) * metersPerDegLat });
  const p = toXY(point);
  const bXY = toXY(b);

  const segLenSq = bXY.x ** 2 + bXY.y ** 2;
  if (segLenSq === 0) return haversineMeters(point, a);

  const t = Math.max(0, Math.min(1, (p.x * bXY.x + p.y * bXY.y) / segLenSq));
  const projected: LatLng = { lat: a.lat + t * (b.lat - a.lat), lng: a.lng + t * (b.lng - a.lng) };
  return haversineMeters(point, projected);
}

/** How far `point` is from the nearest point on `polyline`, in meters. */
export function distanceToPolylineMeters(point: LatLng, polyline: LatLng[]): number {
  if (polyline.length === 0) return Infinity;
  if (polyline.length === 1) return haversineMeters(point, polyline[0]);

  let min = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = distanceToSegmentMeters(point, polyline[i], polyline[i + 1]);
    if (d < min) min = d;
  }
  return min;
}

/** Beyond this distance from the last-fetched route, it's considered stale and worth recalculating. */
export const ROUTE_DEVIATION_THRESHOLD_M = 130;
